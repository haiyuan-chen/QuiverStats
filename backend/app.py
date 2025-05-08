"""
This module defines the Flask application for the QuiverStats backend.

It includes routes for managing quivers, arrows, and arrow scores, as well as
database initialization and configuration.
"""

import os  # 1. access environment vars
from dotenv import load_dotenv  # 2. read .env file
from flask import Flask, jsonify, request, abort  # 3. core Flask imports
from flask_cors import CORS  # 5. CORS support
from flask_migrate import Migrate
from backend.extensions import db  # Import db from extensions
from backend.models import Quiver, Arrow, ArrowScore  # Import models here

# 6. Load variables from .env into os.environ
load_dotenv()

# 7. Create Flask app instance
app = Flask(__name__)

# 8. Enable CORS on all routes
CORS(app)

# 9. Configure database connection
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 10. Initialize extensions
db.init_app(app)  # Initialize db with the app
migrate = Migrate(app, db)


@app.route("/api/quivers", methods=["GET"])
def list_quivers():
    """
    Retrieve a list of all quivers from the database and return them as a JSON response.

    Returns:
        flask.Response: A JSON response containing a list of quivers, where each quiver is
        represented as a dictionary with 'id' and 'name' keys.
    """
    quivers = Quiver.query.all()
    return jsonify([{"id": q.id, "name": q.name} for q in quivers])


@app.route("/api/quivers", methods=["POST"])
def create_quiver():
    """
    Create a new quiver with the provided name.

    Returns:
        flask.Response: A JSON response containing the created quiver's ID and name.
    """
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        abort(400, "Name is required")
    q = Quiver(name=name)
    db.session.add(q)
    db.session.commit()
    return jsonify({"id": q.id, "name": q.name}), 201


@app.route("/api/quivers/<int:quiver_id>", methods=["GET"])
def get_quiver(quiver_id):
    """
    Retrieve a specific quiver by its ID, including its associated arrows.

    Args:
        quiver_id (int): The ID of the quiver to retrieve.

    Returns:
        flask.Response: A JSON response containing the quiver's details.
    """
    q = db.session.get(Quiver, quiver_id)
    if q is None:
        abort(404)

    return jsonify(
        {
            "id": q.id,
            "name": q.name,
            "arrows": [{"id": a.id, "name": a.name} for a in q.arrows],
        }
    )


@app.route("/api/quivers/<int:quiver_id>", methods=["PUT"])
def rename_quiver(quiver_id):
    """
    Update the name of a specific quiver.

    Args:
        quiver_id (int): The ID of the quiver to update.

    Returns:
        flask.Response: A JSON response containing the updated quiver's details.
    """
    q = db.session.get(Quiver, quiver_id)
    if q is None:
        abort(404)
    data = request.get_json() or {}
    if "name" in data:
        q.name = data["name"]
        db.session.commit()
    return jsonify({"id": q.id, "name": q.name})


@app.route("/api/quivers/<int:quiver_id>", methods=["DELETE"])
def delete_quiver(quiver_id):
    """
    Delete a specific quiver by its ID.

    Args:
        quiver_id (int): The ID of the quiver to delete.

    Returns:
        flask.Response: A JSON response indicating successful deletion.
    """
    q = db.session.get(Quiver, quiver_id)
    if q is None:
        abort(404)
    db.session.delete(q)
    db.session.commit()
    return jsonify({"message": "deleted"}), 204


# —————————— Arrow CRUD ——————————


@app.route("/api/quivers/<int:quiver_id>/arrows", methods=["GET"])
def list_arrows(quiver_id):
    """
    Retrieve all arrows associated with a specific quiver.

    Args:
        quiver_id (int): The ID of the quiver whose arrows are to be retrieved.

    Returns:
        flask.Response: A JSON response containing a list of arrows.
    """
    q = db.session.get(Quiver, quiver_id)
    if q is None:
        abort(404)
    return jsonify(
        [{"id": a.id, "name": a.name, "quiver_id": a.quiver_id} for a in q.arrows]
    )


@app.route("/api/quivers/<int:quiver_id>/arrows", methods=["POST"])
def create_arrow(quiver_id):
    """
    Create a new arrow within a specific quiver.

    Args:
        quiver_id (int): The ID of the quiver to which the arrow belongs.

    Returns:
        flask.Response: A JSON response containing the created arrow's details.
    """
    q = db.session.get(Quiver, quiver_id)
    if q is None:
        abort(404)
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        abort(400, "Name is required")
    a = Arrow(name=name, quiver=q)
    db.session.add(a)
    db.session.commit()
    return jsonify({"id": a.id, "name": a.name, "quiver_id": a.quiver_id}), 201


@app.route("/api/arrows/<int:arrow_id>", methods=["PUT"])
def rename_arrow(arrow_id):
    """
    Update the name of a specific arrow.

    Args:
        arrow_id (int): The ID of the arrow to update.

    Returns:
        flask.Response: A JSON response containing the updated arrow's details.
    """
    a = db.session.get(Arrow, arrow_id)
    if a is None:
        abort(404)
    data = request.get_json() or {}
    if "name" in data:
        a.name = data["name"]
        db.session.commit()
    return jsonify({"id": a.id, "name": a.name, "quiver_id": a.quiver_id})


@app.route("/api/arrows/<int:arrow_id>", methods=["DELETE"])
def delete_arrow(arrow_id):
    """
    Delete a specific arrow by its ID.

    Args:
        arrow_id (int): The ID of the arrow to delete.

    Returns:
        flask.Response: A JSON response indicating successful deletion.
    """
    a = db.session.get(Arrow, arrow_id)
    if a is None:
        abort(404)
    db.session.delete(a)
    db.session.commit()
    return jsonify({"message": "deleted"}), 204


# —————————— Score Endpoints (unchanged) ——————————


@app.route("/api/arrows/<int:arrow_id>/scores", methods=["GET"])
def list_scores(arrow_id):
    """
    Retrieve all scores associated with a specific arrow.

    Args:
        arrow_id (int): The ID of the arrow whose scores are to be retrieved.

    Returns:
        flask.Response: A JSON response containing a list of scores.
    """
    a = db.session.get(Arrow, arrow_id)
    if a is None:
        abort(404)
    return jsonify([{"id": s.id, "score": float(s.score)} for s in a.scores])


@app.route("/api/arrows/<int:arrow_id>/scores", methods=["POST"])
def create_score(arrow_id):
    """
    Create a new score for a specific arrow.

    Args:
        arrow_id (int): The ID of the arrow to which the score belongs.

    Returns:
        flask.Response: A JSON response containing the created score's details.
    """
    a = db.session.get(Arrow, arrow_id)
    if a is None:
        abort(404)
    data = request.get_json() or {}
    score = data.get("score")
    if score is None:
        abort(400, "Score is required")
    s = ArrowScore(arrow=a, score=score)
    db.session.add(s)
    db.session.commit()
    return jsonify({"id": s.id, "arrow_id": a.id, "score": float(s.score)}), 201


@app.route("/api/arrows/scores/<int:score_id>", methods=["DELETE"])
def delete_score(score_id):
    """
    Delete a specific score by its ID.

    Args:
        score_id (int): The ID of the score to delete.

    Returns:
        flask.Response: A JSON response indicating successful deletion.
    """
    s = db.session.get(ArrowScore, score_id)
    if s is None:
        abort(404)
    db.session.delete(s)
    db.session.commit()
    return jsonify({"message": "deleted"}), 204


# auto load models when in flask shell
@app.shell_context_processor
def make_shell_context():
    """
    Provide a shell context for Flask CLI.

    Returns:
        dict: A dictionary containing the database instance and models.
    """
    return {"db": db, "Quiver": Quiver, "Arrow": Arrow, "ArrowScore": ArrowScore}


# 15. Run the app when `python app.py` is executed
if __name__ == "__main__":
    app.run()
