"""
This module defines the database models for the QuiverStats backend.

It includes models for Quiver, Arrow, and ArrowScore, along with their relationships.
"""

from backend.extensions import db


class Quiver(db.Model):
    """
    Represents a quiver, which is a collection of arrows.

    Attributes:
        id (int): The primary key of the quiver.
        name (str): The name of the quiver.
        arrows (list[Arrow]): The list of arrows associated with the quiver.
    """

    __tablename__ = "quiver"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    arrows = db.relationship("Arrow", back_populates="quiver")


class Arrow(db.Model):
    """
    Represents an arrow, which belongs to a quiver and can have scores.

    Attributes:
        id (int): The primary key of the arrow.
        quiver_id (int): The foreign key referencing the associated quiver.
        name (str): The name of the arrow.
        quiver (Quiver): The quiver to which the arrow belongs.
        scores (list[ArrowScore]): The list of scores associated with the arrow.
    """

    __tablename__ = "arrow"
    id = db.Column(db.Integer, primary_key=True)
    quiver_id = db.Column(db.Integer, db.ForeignKey("quiver.id"), nullable=False)
    name = db.Column(db.Text, nullable=False)
    quiver = db.relationship("Quiver", back_populates="arrows")
    scores = db.relationship("ArrowScore", back_populates="arrow")


class ArrowScore(db.Model):
    """
    Represents a score associated with an arrow.

    Attributes:
        id (int): The primary key of the score.
        arrow_id (int): The foreign key referencing the associated arrow.
        score (float): The score value.
        arrow (Arrow): The arrow to which the score belongs.
    """

    __tablename__ = "arrow_score"
    id = db.Column(db.Integer, primary_key=True)
    arrow_id = db.Column(db.Integer, db.ForeignKey("arrow.id"), nullable=False)
    score = db.Column(db.Numeric, nullable=False)
    arrow = db.relationship("Arrow", back_populates="scores")
