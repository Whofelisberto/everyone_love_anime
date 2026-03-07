from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.comment_controllers import (
    atualizar_comentario,
    criar_comentario,
    deletar_comentario,
    obter_comentario,
    obter_comentarios_por_post,
)

comment_routes = Blueprint("comment_routes", __name__)


@comment_routes.route("/post/<int:post_id>/criar-comentario", methods=["POST"])
@jwt_required()
def create_comment_route(post_id):
    return criar_comentario(post_id)


@comment_routes.route("/post/<int:post_id>/comentarios", methods=["GET"])
def get_post_comments_route(post_id):
    return obter_comentarios_por_post(post_id)


@comment_routes.route("/comentario/<int:comment_id>", methods=["GET"])
def get_comment_route(comment_id):
    return obter_comentario(comment_id)


@comment_routes.route("/comentario/<int:comment_id>", methods=["PUT"])
@jwt_required()
def update_comment_route(comment_id):
    return atualizar_comentario(comment_id)


@comment_routes.route("/comentario/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment_route(comment_id):
    return deletar_comentario(comment_id)
