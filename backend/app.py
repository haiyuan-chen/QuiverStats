import os  # 1. access environment vars
from dotenv import load_dotenv  # 2. read .env file
from flask import Flask, jsonify, request  # 3. core Flask imports
from flask_sqlalchemy import SQLAlchemy  # 4. ORM
from flask_cors import CORS  # 5. CORS support
from flask_migrate import Migrate


# 6. Load variables from .env into os.environ
load_dotenv()

# 7. Create Flask app instance
app = Flask(__name__)

# 8. Enable CORS on all routes
CORS(app)

# 9. Configure database connection
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 10. Initialize SQLAlchemy
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from backend.models import Quiver, Arrow, ArrowScore


# 11. Define an Item model (table)
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)


# 12. Health‑check route
@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask!"})


# 13. GET all items
@app.route("/api/items")
def get_items():
    items = Item.query.all()
    return jsonify([{"id": i.id, "name": i.name} for i in items])


# Get all quivers
@app.route("/api/quivers", methods=["GET"])
def list_quivers():
    quivers = Quiver.query.all()
    results = [
        {
            "id": q.id,
            "name": q.name,
        }
        for q in quivers
    ]
    return jsonify(results)


# POST /api/quivers - Create a new quiver
@app.route("/api/quivers", methods=["POST"])
def create_quiver():
    data = request.get_json()
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Name is missing!"}), 400
    q = Quiver(name=name)
    db.session.add(q)
    db.session.commit()

    return jsonify({"id": q.id, "name": q.name}), 201


# 14. POST create a new item
@app.route("/api/items", methods=["POST"])
def create_item():
    data = request.get_json()  # parse JSON body
    item = Item(name=data["name"])  # create model object
    db.session.add(item)  # stage insert
    db.session.commit()  # execute insert
    return jsonify({"id": item.id, "name": item.name}), 201


# auto load models when in flask shell
@app.shell_context_processor
def make_shell_context():
    return {"db": db, "Quiver": Quiver, "Arrow": Arrow, "ArrowScore": ArrowScore}


# 15. Run the app when `python app.py` is executed
if __name__ == "__main__":
    app.run()
