from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from database import db
from models.post import Post
from models.user import User
from models.like import Like


def like_post(post_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        if not current_user:
            return jsonify({"message": "Usuário não encontrado!"}), 404

        post = Post.query.get(post_id)
        if not post:
            return jsonify({"message": "Post não encontrado!"}), 404

        existing_like = Like.query.filter_by(user_id=current_user_id, post_id=post_id).first()

        if existing_like:
            db.session.delete(existing_like)
            db.session.commit()
            likes_count = Like.query.filter_by(post_id=post_id).count()
            return jsonify({"message": "Post descurtido!", "liked": False, "likes_count": likes_count}), 200
        else:
            new_like = Like(user_id=current_user_id, post_id=post_id) # type: ignore
            db.session.add(new_like)
            db.session.commit()
            likes_count = Like.query.filter_by(post_id=post_id).count()
            return jsonify({"message": "Post curtido!", "liked": True, "likes_count": likes_count}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erro ao curtir/descurtir post: {str(e)}"}), 500
