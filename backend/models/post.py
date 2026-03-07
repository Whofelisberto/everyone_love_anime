from database import db
from datetime import datetime

class Post(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(200), nullable=False)
  content = db.Column(db.Text, nullable=False)
  image_url = db.Column(db.String(500), nullable=True)
  author_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

  # Relacionamentos
  likes = db.relationship("Like", backref="post", lazy=True, cascade="all, delete-orphan")
