from flask import Flask, request, jsonify, Response
from pymongo import MongoClient
import json
from bson import ObjectId

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        else:
            return obj

app = Flask(__name__)
app.secret_key="sasank_databaseConnection123"
app.json_encoder = Encoder




#connecting to mongoDB database.netflix collection
try:
    mongo_client_connection = MongoClient(
        host = 'localhost',
        port = 27017,
        serverSelectionTimeoutMS = 1000
    )
    mongo_client_connection.server_info() #trigger exception if cannot connect to db
    
    print('CONGRATULATIONS, MongoDB DATABASE CONNECTION ESTABLISHED')

    database_db_instance = mongo_client_connection.database 
    netflix_coll_instance = database_db_instance.netflix
except Exception as ex:
    print('Error in connection to database server',ex,'\n')


@app.route('/api', methods=['POST'])
def create_netflix_document():
        try:
                request_data = request.get_json()
                netflix_coll_instance = database_db_instance.netflix
                inserted_film_cursor = netflix_coll_instance.insert_many(request_data)

                if inserted_film_cursor:
                        return jsonify(request_data)
                else:
                        response = Response("Error in Create Operation", status=500, mimetype="application/json")
                        return response  

        except Exception as ex:
                response = Response(f"Error in Create Operation: {ex}", status=500, mimetype="application/json")
                return response 

@app.route('/api', methods=['GET'])
def retrieve_netflix_document():
        try:     
                netflix_coll_instance = database_db_instance.netflix
                retrieved_documents_cursor = netflix_coll_instance.find()
                netflixData_list = list(retrieved_documents_cursor)
                if retrieved_documents_cursor :
                        return jsonify(netflixData_list)
                else:
                        response = Response("No Files Found, Collection is Empty", status= 500, mimetype = "application/json") 
                        return response
        except Exception as ex:
                response = Response(f"Error in Retrieve Operation: {ex}", status=500, mimetype="application/json")
                return response

@app.route('/api/<string:movie_title>', methods=['PATCH'])
def update_netflix_document(movie_title):
        try:    
                netflix_coll_instance = database_db_instance.netflix
                request_data = request.get_json()
                new_data_update = {
                        "title" : request_data["title"],
                        "description" : request_data["description"],
                        "imdb_score" : request_data["imdb_score"]
                }
                updated_film_cursor = netflix_coll_instance.find_one_and_update({"title":movie_title},{"$set" :new_data_update})
                netflixData_list = list(updated_film_cursor)
                if updated_film_cursor :
                        return jsonify(netflixData_list)
                else:
                        response = Response("Error in Finding & Updating File, Please Check Title",status=500, mimetype='application/json')
                        return response

        except Exception as ex:
                response = Response(f"Error in Update Operation: {ex}", status=500, mimetype="application/json")
                return response  

@app.route('/api/<string:movie_title>', methods=['DELETE'])
def delete_netflix_document(movie_title):
        try:
                netflix_coll_instance = database_db_instance.netflix
                deleted_film_cursor = netflix_coll_instance.find_one_and_delete({"title": movie_title})
                
                if deleted_film_cursor:
                        reponse = Response(f"Movie with title: \"{movie_title}\" is Successfully Deleted.", status=200, mimetype="application/json")
                        return reponse
                else:
                        response = Response(f"File not found with title: \"{movie_title}\".", status= 500, mimetype = "application/json") 
                        return response
        except Exception as ex:
                response = Response(f"Error in Delete Operation: {ex}", status=500, mimetype="application/json")
                return response
        
@app.route('/api/<string:movie_title>', methods=['GET'])
def get_netflix_document_by_title(movie_title):
        try:     
                netflix_coll_instance = database_db_instance.netflix
                retrieved_documents_cursor = netflix_coll_instance.find({"title":movie_title},{})
                retrieved_documents = list(retrieved_documents_cursor)
                if retrieved_documents_cursor :
                        return jsonify(retrieved_documents)
                else:
                        response = Response(f"No Files Found with Title: \"{movie_title}\"", status= 500, mimetype = "application/json") 
                        return response
                        
        except Exception as ex:
                response = Response(f"Error in Retrieve Operation: {ex}", status=500, mimetype="application/json")
                return response
        

if __name__== '__main__':
        app.run(debug=True)