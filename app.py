from flask import Flask, render_template, request, session, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import secrets

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)
app.secret_key = secrets.token_hex()

class User(db.Model):
    email = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(50))
    surname = db.Column(db.String(80))
    password = db.Column(db.String(80))

    def __init__(self, name, surname, email, password):
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password

class CirclesSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey(User.email))

    def __init__(self, user):
        self.user = user

class Circle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    circles = db.Column(db.Integer, db.ForeignKey(CirclesSettings.id))
    radius = db.Column(db.Integer)
    time = db.Column(db.Float)

    def __init__(self, circles, radius, time):
        self.circles = circles
        self.radius = radius
        self.time = time

with app.app_context():
    db.create_all()

@app.get("/")
def index():
    return render_template('index.html')

@app.get("/register")
def register_view():
    if 'email' in session:
        session.pop('email', None)
        return redirect('/')
    return render_template('register.html')

@app.post("/register")
def register():
    user = User(name=request.form['name'], surname=request.form['surname'], email=request.form['email'], password=request.form['password'])
    db.session.add(user)
    db.session.commit()
    return render_template('login.html')

@app.get("/login")
def login_view():
    if 'email' in session:
        session.pop('email', None)
        return redirect('/')
    return render_template('login.html')

@app.post("/login")
def login():
    user = User.query.filter(User.email == request.form['email']).first()
    if user and user.password == request.form['password']:
        session['email'] = request.form['email']
        return redirect('/')
    return redirect('/login')

@app.get("/logout")
def logout():
    session.pop('email', None)
    return redirect('/')

@app.post("/save")
def save():
    data = request.get_json()
    circles = CirclesSettings(user=session['email'])
    db.session.add(circles)
    db.session.commit()
    for circle in data:
        db.session.add(Circle(circles=circles.id, radius=circle[0], time=circle[1]))
    db.session.commit()
    return "Good"

@app.get("/load")
def load_view():
    if 'email' not in session:
        return redirect('/')
    result = (db.session.query(CirclesSettings.id, func.count(Circle.id), func.sum(Circle.time))
                .join(User, User.email == CirclesSettings.user).join(Circle, Circle.circles == CirclesSettings.id)
                .filter(User.email == session['email']).group_by(CirclesSettings.id)).all()
    return render_template('load.html', circles=result)

@app.get("/load/<id>")
def load_circles(id):
    return redirect('/')

@app.get("/circles/<id>")
def get_circles(id):
    if 'email' not in session:
        return redirect('/')
    circles = Circle.query.filter(circles=id).all()
    print(id)
    return jsonify([{'radius': circle.radius, 'time': circle.time} for circle in circles])

@app.delete("/delete/<id>")
def delete(id):
    circles = db.session.query(Circle).filter_by(circles=id).all()
    for x in circles:
        db.session.delete(x)
    db.session.delete(db.session.query(CirclesSettings).filter_by(id=id).first())
    db.session.commit()
    return ""