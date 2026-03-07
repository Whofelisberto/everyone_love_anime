from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.post_controllers import criar_post, listar_posts, listar_posts_usuario

post_routes = Blueprint("post_routes", __name__)


@post_routes.route("/post", methods=["POST"])
@jwt_required()
def create_post_route():
    return criar_post()


@post_routes.route("/posts", methods=["GET"])
def list_posts_route():
    return listar_posts()


@post_routes.route("/user/<int:user_id>/posts", methods=["GET"])
def list_user_posts_route(user_id):
    return listar_posts_usuario(user_id)
