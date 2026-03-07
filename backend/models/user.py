from database import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  email = db.Column(db.String(120), unique=True, nullable=False)
  password = db.Column(db.String(255), nullable=False)
  role = db.Column(db.String(80), nullable=False, default="user")
  profile_image = db.Column(db.String(500), nullable=True)

  # Relacionamentos
  posts = db.relationship("Post", backref="author", lazy=True, cascade="all, delete-orphan")
  likes = db.relationship("Like", backref="user", lazy=True, cascade="all, delete-orphan")
