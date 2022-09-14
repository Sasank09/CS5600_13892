from flask import Flask, request, jsonify, Response
from flask_mongoengine import MongoEngine

app = Flask(__name__)
app.secret_key="databaseConnection123"
app.config['MONGODB_SETTINGS'] = {
    'db':'database',
    'host':'localhost',
    'port':27017
}
try:
        global db
        db = MongoEngine(app)
except Exception as ex:
        print("Error in connection: ",ex)
    
print('CONGRATULATIONS, MongoDB DATABASE CONNECTION ESTABLISHED')

class netflix(db.Document):
    id = db.StringField()
    title = db.StringField()
    type = db.StringField()
    description = db.StringField()
    release_year = db.IntField()
    age_certification = db.StringField()
    runtime = db.IntField()
    genres = db.ListField()
    production_countries = db.ListField()
    imdb_score = db.FloatField()


@app.route('/api', methods=['POST'])
def create_netflix_document():
        body = request.get_json()
        netflix_movies = netflix(**body).save()
        return jsonify(netflix_movies), 201

@app.route('/api', methods=['GET'])
def retrieve_netflix_document():
        try:
            netflix_movies = netflix.objects()
            return  jsonify(netflix_movies), 200
        except Exception as ex:
                response = Response(f"Error in Create Operation: {ex}", status=500, mimetype="application/json")
                return response 

@app.route('/api/<string:movie_title>', methods=['PATCH'])
def update_netflix_document(movie_title):
        request_data = request.get_json()
        netflix_movies = netflix.objects(title=movie_title)
        netflix_movies.update(**request_data)
        netflix_movies = netflix.objects(title=request_data["title"])
        return jsonify(netflix_movies), 200

@app.route('/api/<string:movie_title>', methods=['DELETE'])
def delete_netflix_document(movie_title):
        netflix_movies = netflix.objects(title=movie_title)
        netflix_movies.delete()
        return jsonify(netflix_movies), 200
        
@app.route('/api/<string:movie_title>', methods=['GET'])
def get_netflix_document_by_title(movie_title):
    netflix_movies = netflix.objects(title=movie_title)
    return jsonify(netflix_movies), 200
        

if __name__== '__main__':
        app.run(debug=True)