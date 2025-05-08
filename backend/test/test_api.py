"""
This module contains tests for the QuiverStats API.

It includes tests for CRUD operations on quivers, arrows, and scores.
"""

# Standard library imports
import os
import sys
import pytest
from backend.app import app, db
# Add the project root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))


@pytest.fixture(scope="function")
def client():  # Fixture name
    """
    Configure the Flask app for testing and provide a test client.

    This fixture sets up a fresh database for each test function.

    Yields:
        FlaskClient: A test client for the Flask application.
    """
    # Configure for testing
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    # Create app context
    with app.app_context():
        # Create all tables
        db.create_all()

        # Create and yield test client
        test_client = app.test_client()
        yield test_client

        # Clean up after test
        db.session.remove()
        db.drop_all()


def test_quiver_crud(client_app):  # Different parameter name from fixture
    """
    Test CRUD operations for quivers.

    Args:
        client_app: Flask test client from fixture
    """
    # List quivers empty
    assert client_app.get("/api/quivers").get_json() == []

    # Fail to create quiver without name
    rv = client_app.post("/api/quivers", json={})
    assert rv.status_code == 400

    # Create quiver
    rv = client_app.post("/api/quivers", json={"name": "Q1"})
    assert rv.status_code == 201
    q1 = rv.get_json()
    assert q1["name"] == "Q1" and "id" in q1

    # List quivers contains Q1
    assert client_app.get("/api/quivers").get_json() == [q1]

    # Get single quiver (no arrows yet)
    rv = client_app.get(f"/api/quivers/{q1['id']}")
    assert rv.status_code == 200
    assert rv.get_json() == {
        "id": q1["id"],
        "name": "Q1",
        "arrows": [],
    }

    # Rename quiver
    rv = client_app.put(f"/api/quivers/{q1['id']}", json={"name": "Q1-updated"})
    assert rv.status_code == 200
    assert rv.get_json()["name"] == "Q1-updated"

    # Delete quiver
    rv = client_app.delete(f"/api/quivers/{q1['id']}")
    assert rv.status_code == 204
    # Now list is empty again
    assert client_app.get("/api/quivers").get_json() == []


def test_arrow_crud(client_app):  # Different parameter name from fixture
    """
    Test CRUD operations for arrows.

    Args:
        client_app: Flask test client from fixture
    """
    # Create quiver to host arrows
    q = client_app.post("/api/quivers", json={"name": "Q2"}).get_json()

    # List arrows empty
    assert client_app.get(f"/api/quivers/{q['id']}/arrows").get_json() == []

    # Fail to create arrow without name
    rv = client_app.post(f"/api/quivers/{q['id']}/arrows", json={})
    assert rv.status_code == 400

    # Create arrow
    rv = client_app.post(f"/api/quivers/{q['id']}/arrows", json={"name": "A1"})
    assert rv.status_code == 201
    a1 = rv.get_json()
    assert a1["name"] == "A1" and a1["quiver_id"] == q["id"]

    # List arrows contains A1
    assert client_app.get(f"/api/quivers/{q['id']}/arrows").get_json() == [a1]

    # Rename arrow
    rv = client_app.put(f"/api/arrows/{a1['id']}", json={"name": "A1-new"})
    assert rv.status_code == 200
    assert rv.get_json()["name"] == "A1-new"

    # Delete arrow
    rv = client_app.delete(f"/api/arrows/{a1['id']}")
    assert rv.status_code == 204
    # Now arrows empty again
    assert client_app.get(f"/api/quivers/{q['id']}/arrows").get_json() == []


def test_score_crud(client_app):  # Different parameter name from fixture
    """
    Test CRUD operations for scores.

    Args:
        client_app: Flask test client from fixture
    """
    # Prepare quiver and arrow
    q = client_app.post("/api/quivers", json={"name": "Q3"}).get_json()
    a = client_app.post(
        f"/api/quivers/{q['id']}/arrows", json={"name": "A2"}
    ).get_json()

    # List scores empty
    assert client_app.get(f"/api/arrows/{a['id']}/scores").get_json() == []

    # Fail to create score without value
    rv = client_app.post(f"/api/arrows/{a['id']}/scores", json={})
    assert rv.status_code == 400

    # Create a score
    rv = client_app.post(f"/api/arrows/{a['id']}/scores", json={"score": 9})
    assert rv.status_code == 201
    s = rv.get_json()
    assert s["score"] == 9 and s["arrow_id"] == a["id"]

    # List scores contains our entry
    scores = client_app.get(f"/api/arrows/{a['id']}/scores").get_json()
    assert len(scores) == 1 and scores[0]["score"] == 9

    # Delete the score
    rv = client_app.delete(f"/api/arrows/scores/{s['id']}")
    assert rv.status_code == 204

    # Back to empty
    assert client_app.get(f"/api/arrows/{a['id']}/scores").get_json() == []
