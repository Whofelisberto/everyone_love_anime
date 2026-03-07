from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, verify_jwt_in_request
from database import db
import traceback
import cloudinary.uploader

from models.post import Post
from models.user import User
from models.like import Like
from models.comment import Comment

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@jwt_required()
def criar_post():
    try:

        current_user_id = int(get_jwt_identity())

        title = None
        content = None
        image_url = None

        if request.files:
            title = request.form.get("title")
            content = request.form.get("content")
            image = request.files.get("image")

            if image and image.filename:
                if not allowed_file(image.filename):
                    return jsonify({"message": "Formato de imagem inválido."}), 400

                upload = cloudinary.uploader.upload(
                    image,
                    folder="everyone_love_anime/posts",
                    resource_type="auto",
                    transformation=[
                        {"width": 1200, "height": 1200, "crop": "limit"},
                        {"quality": "auto:good"},
                    ],
                )

                image_url = upload["secure_url"]

        else:
            data = request.get_json(silent=True)
            if data is None:
                return jsonify({"message": "Dados inválidos!"}), 400

            title = data.get("title")
            content = data.get("content")

        title = title.strip() if title else None
        content = content.strip() if content else None

        if not title or not content:
            return jsonify({"message": "Título e conteúdo são obrigatórios!"}), 400

        post = Post(title=title, content=content, image_url=image_url, author_id=current_user_id)  # type: ignore
        db.session.add(post)
        db.session.commit()

        user = User.query.get(current_user_id)
        username = user.username if user else "Usuário Desconhecido"

        post_data = {
            "message": "Post criado com sucesso!",
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "image_url": post.image_url,
            "author_id": post.author_id,
            "username": username,
            "likes_count": 0,
            "comments_count": 0,
            "liked_by_current_user": False,
            "created_at": post.created_at.isoformat() if post.created_at else None,
        }

        return jsonify(post_data), 201

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"message": f"Erro ao criar post: {str(e)}"}), 500

def listar_posts():
  try:
    verify_jwt_in_request(optional=True)
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id) if current_user_id else None

    posts = Post.query.order_by(Post.id.desc()).all()
    posts_data = []
    for post in posts:
      user = User.query.get(post.author_id)
      likes_count = Like.query.filter_by(post_id=post.id).count()
      comments_count = Comment.query.filter_by(post_id=post.id).count()
      liked_by_current_user = False

      if current_user_id:
        liked_by_current_user = (
          Like.query.filter_by(post_id=post.id, user_id=current_user_id).first()
          is not None
        )

      posts_data.append({
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "image_url": post.image_url,
        "author_id": post.author_id,
        "username": user.username if user else "Usuário Desconhecido",
        "likes_count": likes_count,
        "comments_count": comments_count,
        "liked_by_current_user": liked_by_current_user,
        "created_at": post.created_at.isoformat() if post.created_at else None,
      })

    return jsonify(posts_data), 200

  except Exception as e:
    return jsonify({"message": f"Erro ao listar posts: {str(e)}"}), 500



def listar_posts_usuario(user_id):
  try:
    verify_jwt_in_request(optional=True)
    current_user_id = get_jwt_identity()
    current_user_id = int(current_user_id) if current_user_id else None

    # Verify if the user exists
    user = User.query.get(user_id)
    if not user:
      return jsonify({"message": "Usuário não encontrado!"}), 404

    posts = (
      Post.query.filter_by(author_id=user_id)
      .order_by(Post.id.desc())
      .all()
    )

    posts_data = []
    for post in posts:
      likes_count = Like.query.filter_by(post_id=post.id).count()
      comments_count = Comment.query.filter_by(post_id=post.id).count()
      liked_by_current_user = False

      if current_user_id:
        liked_by_current_user = (
          Like.query.filter_by(post_id=post.id, user_id=current_user_id).first()
          is not None
        )

      posts_data.append({
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "image_url": post.image_url,
        "author_id": post.author_id,
        "username": user.username,
        "likes_count": likes_count,
        "comments_count": comments_count,
        "liked_by_current_user": liked_by_current_user,
        "created_at": post.created_at.isoformat() if post.created_at else None,
      })

    return jsonify(posts_data), 200

  except Exception as e:
    return jsonify({"message": f"Erro ao listar posts do usuário: {str(e)}"}), 500
