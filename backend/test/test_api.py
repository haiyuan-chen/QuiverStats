"""
This module contains tests for the QuiverStats API.

It includes tests for CRUD operations on quivers, arrows, and scores.
"""

import sys
import os

# Add the project root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.app import app, db

import pytest

@pytest.fixture(autouse=True)
def setup_db():
    """
    Reset the database before each test.
    
    This fixture runs automatically before each test function.
    """
    with app.app_context():
        db.drop_all()
        db.create_all()
    yield
    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture
def test_client():  # Renamed from client to test_client
    """
    Configure the Flask app for testing and provide a test client.

    Yields:
        FlaskClient: A test client for the Flask application.
    """
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_quiver_crud(test_client):  # Now this matches the fixture name
    """
    Test CRUD operations for quivers.
    """
    # List quivers empty
    assert test_client.get("/api/quivers").get_json() == []

    # Fail to create quiver without name
    rv = test_client.post("/api/quivers", json={})
    assert rv.status_code == 400

    # Create quiver
    rv = test_client.post("/api/quivers", json={"name": "Q1"})
    assert rv.status_code == 201
    q1 = rv.get_json()
    assert q1["name"] == "Q1" and "id" in q1

    # List quivers contains Q1
    assert test_client.get("/api/quivers").get_json() == [q1]

    # Get single quiver (no arrows yet)
    rv = test_client.get(f"/api/quivers/{q1['id']}")
    assert rv.status_code == 200
    assert rv.get_json() == {
        "id": q1["id"],
        "name": "Q1",
        "arrows": [],
    }

    # Rename quiver
    rv = test_client.put(f"/api/quivers/{q1['id']}", json={"name": "Q1-updated"})
    assert rv.status_code == 200
    assert rv.get_json()["name"] == "Q1-updated"

    # Delete quiver
    rv = test_client.delete(f"/api/quivers/{q1['id']}")
    assert rv.status_code == 204
    # Now list is empty again
    assert test_client.get("/api/quivers").get_json() == []


def test_arrow_crud(test_client):  # Now this matches the fixture name
    """
    Test CRUD operations for arrows.
    """
    # Create quiver to host arrows
    q = test_client.post("/api/quivers", json={"name": "Q2"}).get_json()

    # List arrows empty
    assert test_client.get(f"/api/quivers/{q['id']}/arrows").get_json() == []

    # Fail to create arrow without name
    rv = test_client.post(f"/api/quivers/{q['id']}/arrows", json={})
    assert rv.status_code == 400

    # Create arrow
    rv = test_client.post(f"/api/quivers/{q['id']}/arrows", json={"name": "A1"})
    assert rv.status_code == 201
    a1 = rv.get_json()
    assert a1["name"] == "A1" and a1["quiver_id"] == q["id"]

    # List arrows contains A1
    assert test_client.get(f"/api/quivers/{q['id']}/arrows").get_json() == [a1]

    # Rename arrow
    rv = test_client.put(f"/api/arrows/{a1['id']}", json={"name": "A1-new"})
    assert rv.status_code == 200
    assert rv.get_json()["name"] == "A1-new"

    # Delete arrow
    rv = test_client.delete(f"/api/arrows/{a1['id']}")
    assert rv.status_code == 204
    # Now arrows empty again
    assert test_client.get(f"/api/quivers/{q['id']}/arrows").get_json() == []


def test_score_crud(test_client):  # Now this matches the fixture name
    """
    Test CRUD operations for scores.
    """
    # Prepare quiver and arrow
    q = test_client.post("/api/quivers", json={"name": "Q3"}).get_json()
    a = test_client.post(f"/api/quivers/{q['id']}/arrows", json={"name": "A2"}).get_json()

    # List scores empty
    assert test_client.get(f"/api/arrows/{a['id']}/scores").get_json() == []

    # Fail to create score without value
    rv = test_client.post(f"/api/arrows/{a['id']}/scores", json={})
    assert rv.status_code == 400

    # Create a score - first create the score, then check it
    rv = test_client.post(f"/api/arrows/{a['id']}/scores", json={"score": 9})
    assert rv.status_code == 201
    s = rv.get_json()
    assert s["score"] == 9 and s["arrow_id"] == a["id"]

    # List scores contains our entry
    scores = test_client.get(f"/api/arrows/{a['id']}/scores").get_json()
    assert len(scores) == 1 and scores[0]["score"] == 9

    # Delete the score
    rv = test_client.delete(f"/api/arrows/scores/{s['id']}")
    assert rv.status_code == 204
    
    # Back to empty
    assert test_client.get(f"/api/arrows/{a['id']}/scores").get_json() == []
