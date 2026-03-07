from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.auth_controllers import (
	get_user,
	get_users,
	login,
	logout,
	registrar,
	me,
	update_profile
)

auth_routes = Blueprint("auth_routes", __name__)


@auth_routes.route("/registrar", methods=["POST"])
def register_route():
	return registrar()


@auth_routes.route("/users", methods=["GET"])
def users_route():
	return get_users()


@auth_routes.route("/user/<int:user_id>", methods=["GET"])
def user_route(user_id):
	return get_user(user_id)



@auth_routes.route("/login", methods=["POST"])
def login_route():
	return login()


@auth_routes.route("/logout", methods=["POST"])
def logout_route():
	return logout()

@auth_routes.route("/me", methods=["GET"])
@jwt_required()
def me_route():
	return me()

@auth_routes.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile_route():
	return update_profile()
