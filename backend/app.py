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
    origins=["http://localhost:5173"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600
)

jwt = JWTManager(app)
db.init_app(app)
configure_cloudinary()

@app.route("/", methods=["GET"])
def home():
  return "Mexendo com python"

app.register_blueprint(auth_routes)
app.register_blueprint(comment_routes)
app.register_blueprint(post_routes)
app.register_blueprint(like_routes)



if __name__ == "__main__":
  with app.app_context():
    db.create_all()
  app.run(host="127.0.0.1", port=5000, debug=True)
