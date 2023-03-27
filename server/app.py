from flask import Flask, request, session, make_response, jsonify, abort, render_template
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import NotFound, Unauthorized
from config import app, db, api
from models import User, Group
from flask_cors import CORS

# import os

# from dotenv import load_dotenv
# load_dotenv()

CORS(app)

@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")

class Signup(Resource):

    def post(self):

        data = request.get_json()

        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email']
        )

        new_user.password_hash = data['password']

        
        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id

        response = make_response(
            new_user.to_dict(),
            201
        )
        return response



class AuthorizedSession(Resource):

    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            response = make_response(
                user.to_dict(),
                200
            )
            return response

        return {'error': '401 Unauthorized'}, 401

class Login(Resource):
    def post(self):

        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter(User.email == email).first()

            
        if user.authenticate(data['password']):

            session['user_id'] = user.id

            response = make_response(
                user.to_dict(),
                200
            )
            return response
        return {'error' : "Invalid Username or Password"}, 401
                


class Logout(Resource):

    def delete(self):

        if session.get('user_id'):

            session['user_id'] = None

            return {}, 204

        return {'error': '401 Unauthorized'}, 401
    
class HostGroups(Resource):
    def get(self, id):
        groups = [group.to_dict() for group in Group.query.filter(Group.host_id == id).all()]

        if not groups:
            pass

        response = make_response(
            groups, 
            200
        )

        return response

@app.errorhandler(NotFound)
def handle_not_found(e):
    response = make_response(
        "Not Found: Sorry the resource you are lookiung for does not exist",
        404
    )
    return response

api.add_resource(Signup, '/signup')
api.add_resource(AuthorizedSession, '/authorized')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(HostGroups, '/host/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)