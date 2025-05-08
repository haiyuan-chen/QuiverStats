"""
Utility functions for the QuiverStats backend.
"""

from flask import abort
from backend.extensions import db

def get_or_404(model, object_id):
    """
    Get an object by ID or raise a 404 error if not found.
    
    Args:
        model: The SQLAlchemy model class
        object_id: The primary key ID to look up
        
    Returns:
        The found database object
    """
    obj = db.session.get(model, object_id)
    if obj is None:
        abort(404)
    return obj
