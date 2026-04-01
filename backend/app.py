from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database import db
from config import Config
from services.cloudinary_service import configure_cloudinary
from routes.auth_routes import auth_routes
from routes.comment_routes import comment_routes
from routes.post_routes import post_routes
from routes.like_routes import like_routes


app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    supports_credentials=True,
  origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://187.77.253.129:5175",
  ],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600
)

jwt = JWTManager(app)
db.init_app(app)
configure_cloudinary()

with app.app_context():
    db.create_all()

@app.route("/", methods=["GET"])
def home():
  return "Mexendo com python"

app.register_blueprint(auth_routes)
app.register_blueprint(comment_routes)
app.register_blueprint(post_routes)
app.register_blueprint(like_routes)



if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5001, debug=True)
