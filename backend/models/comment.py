from database import db

class Comment(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
  post_id = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)
  content = db.Column(db.Text, nullable=False)
  created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
  user = db.relationship("User", backref=db.backref("comments", lazy=True))
  post = db.relationship("Post", backref=db.backref("comments", lazy=True))
