from backend.app import db

class Quiver(db.Model):
    __tablename__ = 'quiver'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    arrows     = db.relationship('Arrow', back_populates='quiver')


class Arrow(db.Model):
    __tablename__ = 'arrow'
    id         = db.Column(db.Integer, primary_key=True)
    quiver_id  = db.Column(db.Integer, db.ForeignKey('quiver.id'), nullable=False)
    name       = db.Column(db.Text, nullable=False)
    quiver     = db.relationship('Quiver', back_populates='arrows')
    scores     = db.relationship('ArrowScore', back_populates='arrow')


class ArrowScore(db.Model):
    __tablename__ = 'arrow_score'
    id          = db.Column(db.Integer, primary_key=True)
    arrow_id    = db.Column(db.Integer, db.ForeignKey('arrow.id'), nullable=False)
    score       = db.Column(db.Numeric, nullable=False)
    arrow       = db.relationship('Arrow', back_populates='scores')
