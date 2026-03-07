from database import db

class Like(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
  post_id = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)

  __table_args__ = (
    db.UniqueConstraint("user_id", "post_id", name="unique_like"),
  )
