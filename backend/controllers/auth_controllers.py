from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_csrf_token
import jwt
from werkzeug.security import check_password_hash, generate_password_hash
from database import db
from models.user import User


def registrar():
	try:
		data = request.get_json()

		if not data:
			return jsonify({"message": "Dados inválidos!"}), 400

		username = data.get("username")
		email = data.get("email")
		password = data.get("password")

		if not username or not email or not password:
			return jsonify({"message": "Preencha todos os campos!"}), 400

		if User.query.filter_by(username=username).first():
			return jsonify({"message": "Username já existe!"}), 400

		if User.query.filter_by(email=email).first():
			return jsonify({"message": "Email já existe!"}), 400

		hashed_password = generate_password_hash(password)

		new_user = User(username=username, email=email, password=hashed_password, role="user")  # type: ignore
		db.session.add(new_user)
		db.session.commit()

		return jsonify({"message": "Usuário registrado com sucesso!"}), 201
	except Exception as e:
		db.session.rollback()
		return jsonify({"message": f"Erro ao registrar usuário: {str(e)}"}), 500


def get_users():
	try:
		users = User.query.all()
		return jsonify([{"id": user.id, "username": user.username, "email": user.email} for user in users]), 200
	except Exception as e:
		return jsonify({"message": f"Erro ao buscar usuários: {str(e)}"}), 500


def get_user(user_id):
	try:
		user = User.query.get(user_id)
		if user:
			return jsonify({
				"id": user.id,
				"username": user.username,
				"email": user.email,
				"role": user.role,
				"profile_image": user.profile_image
			}), 200

		return jsonify({"message": "Usuário não encontrado!"}), 404
	except Exception as e:
		return jsonify({"message": f"Erro ao buscar usuário: {str(e)}"}), 500



def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "Dados inválidos!"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Preencha todos os campos!"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Credenciais inválidas!"}), 401

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "message": "Login realizado com sucesso!",
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "profile_image": user.profile_image
            },
        }), 200

    except Exception:
        return jsonify({"message": "Erro interno no servidor"}), 500


def logout():
    response = jsonify({"message": "Logout realizado com sucesso!"})
    return response, 200


@jwt_required()
def me():
	try:
		current_user_id = int(get_jwt_identity())
		current_user = User.query.get(current_user_id)

		if not current_user:
			return jsonify({"message": "Usuário não encontrado!"}), 404

		return jsonify({
			"id": current_user.id,
			"username": current_user.username,
			"email": current_user.email,
			"role": current_user.role,
			"profile_image": current_user.profile_image
		}), 200

	except Exception as e:
		return jsonify({"message": f"Erro ao buscar usuário atual: {str(e)}"}), 500


@jwt_required()
def update_profile():
	try:
		current_user_id = int(get_jwt_identity())
		current_user = User.query.get(current_user_id)

		if not current_user:
			return jsonify({"message": "Usuário não encontrado!"}), 404

		data = request.get_json()

		if not data:
			return jsonify({"message": "Dados inválidos!"}), 400

		# Update profile image if provided
		if "profile_image" in data:
			current_user.profile_image = data["profile_image"]

		db.session.commit()

		return jsonify({
			"message": "Perfil atualizado com sucesso!",
			"user": {
				"id": current_user.id,
				"username": current_user.username,
				"email": current_user.email,
				"role": current_user.role,
				"profile_image": current_user.profile_image
			}
		}), 200

	except Exception as e:
		db.session.rollback()
		return jsonify({"message": f"Erro ao atualizar perfil: {str(e)}"}), 500
