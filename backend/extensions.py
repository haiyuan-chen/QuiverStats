"""
This module initializes shared extensions for the Flask application.

It includes the SQLAlchemy database instance.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
