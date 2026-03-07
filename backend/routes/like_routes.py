from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.like_controllers import like_post

like_routes = Blueprint("like_routes", __name__)


@like_routes.route("/post/<int:post_id>/like", methods=["POST"])
@jwt_required()
def like_post_route(post_id):
    return like_post(post_id)
