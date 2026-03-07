from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity

from database import db
from models.comment import Comment
from models.post import Post
from models.user import User


def criar_comentario(post_id):
    try:
        current_user_id = int(get_jwt_identity())

        data = request.get_json()

        if not data:
            return jsonify({"message": "Dados inválidos!"}), 400

        content = data.get("content")

        if not content:
            return jsonify({"message": "O conteúdo do comentário é obrigatório!"}), 400

        post = Post.query.get(post_id)
        if not post:
            return jsonify({"message": "Post não encontrado!"}), 404

        new_comment = Comment(user_id=current_user_id, post_id=post_id, content=content) # type: ignore

        db.session.add(new_comment)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Comentário criado com sucesso!",
                    "id": new_comment.id,
                    "content": new_comment.content,
                    "user_id": new_comment.user_id,
                    "post_id": new_comment.post_id,
                    "username": new_comment.user.username,
                    "created_at": new_comment.created_at,
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erro ao criar comentário: {str(e)}"}), 500


def obter_comentarios_por_post(post_id):
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"message": "Post não encontrado!"}), 404

        comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.desc()).all()

        return (
            jsonify(
                [
                    {
                        "id": comment.id,
                        "content": comment.content,
                        "user_id": comment.user_id,
                        "username": comment.user.username,
                        "created_at": comment.created_at,
                    }
                    for comment in comments
                ]
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Erro ao obter comentários: {str(e)}"}), 500


def obter_comentario(comment_id):
    try:
        comment = Comment.query.get(comment_id)

        if not comment:
            return jsonify({"message": "Comentário não encontrado!"}), 404

        return (
            jsonify(
                {
                    "id": comment.id,
                    "content": comment.content,
                    "user_id": comment.user_id,
                    "username": comment.user.username,
                    "post_id": comment.post_id,
                    "created_at": comment.created_at,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Erro ao obter comentário: {str(e)}"}), 500


def atualizar_comentario(comment_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        comment = Comment.query.get(comment_id)

        if not comment:
            return jsonify({"message": "Comentário não encontrado!"}), 404

        if not current_user or (comment.user_id != current_user.id and current_user.role != "admin"):
            return (
                jsonify({"message": "Você não pode atualizar este comentário!"}),
                403,
            )

        data = request.get_json()

        if not data:
            return jsonify({"message": "Dados inválidos!"}), 400

        content = data.get("content")

        if not content:
            return jsonify({"message": "O conteúdo do comentário é obrigatório!"}), 400

        comment.content = content
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Comentário atualizado com sucesso!",
                    "id": comment.id,
                    "content": comment.content,
                    "user_id": comment.user_id,
                    "post_id": comment.post_id,
                    "username": comment.user.username,
                    "created_at": comment.created_at,
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erro ao atualizar comentário: {str(e)}"}), 500


def deletar_comentario(comment_id):
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        comment = Comment.query.get(comment_id)

        if not comment:
            return jsonify({"message": "Comentário não encontrado!"}), 404

        if not current_user or (comment.user_id != current_user.id and current_user.role != "admin"):
            return (
                jsonify({"message": "Você não pode deletar este comentário!"}),
                403,
            )

        db.session.delete(comment)
        db.session.commit()

        return jsonify({"message": "Comentário deletado com sucesso!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erro ao deletar comentário: {str(e)}"}), 500
