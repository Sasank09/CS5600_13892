from flask import Flask, request, jsonify, Response
from pymongo import MongoClient
import json
from bson.json_util import dumps

app = Flask(__name__)
app.secret_key="sasank_databaseConnection123"

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


@app.route('/', methods=['GET', 'POST'])
def index():
        if request.method == 'GET':
                data = {
                        "available_dataoperation_info" : {
                                "Create": {
                                               "action" : "http://127.0.0.1:5000/api",
                                               "method" : "POST"
                                        },
                                "Retrieve All" : {
                                               "action" : "http://127.0.0.1:5000/api",
                                               "method" : "GET"
                                        },
                                "Update" : {
                                                "action" : "http://127.0.0.1:5000/api/<title>",
                                                "method" : "PATCH"
                                },
                                "Delete" : {
                                                "action" : "http://127.0.0.1:5000/api/<title>",
                                                "method" : "DELETE"
                                },
                                "Retrieve  By Title" : {
                                                "action" : "http://127.0.0.1:5000/api/<title>",
                                                "method" : "GET"
                                }
                        }
                }
                return jsonify(data)
        else:
                return ({'Error':'401 Bad Request'})

@app.route('/api', methods=['POST'])
def create_netflix_document():
        try:
                count =0
                request_data = request.get_json()
                netflix_coll_instance = database_db_instance.netflix
                if request_data != {} and request_data != []:
                        if type(request_data) == list:
                                inserted_film_cursor = netflix_coll_instance.insert_many(request_data)
                                createdIds = inserted_film_cursor.inserted_ids
                                retrieve_inserted_data = json.loads(dumps(netflix_coll_instance.find({"_id" : {"$in" : createdIds}})))
                        else:
                                inserted_film_cursor = netflix_coll_instance.insert_one(request_data)
                                createdIds = inserted_film_cursor.inserted_id
                                retrieve_inserted_data = json.loads(dumps(netflix_coll_instance.find({"_id" : createdIds})))
                        
                        count = len(retrieve_inserted_data)

                if count>0:
                        response = Response(f"{count} Movie Documents Created Successfully \n{dumps(retrieve_inserted_data, indent=2)}", status =200, mimetype='application/json')
                        return response
                else:
                        response = Response("Error in Creation of Documents, Please Check JSON Data",status=500, mimetype='application/json')
                        return response
        except Exception as ex:
                response = Response(f"Error in Create Operation: {ex}", status=500, mimetype="application/json")
                return response 

@app.route('/api', methods=['GET'])
def retrieve_netflix_document():
        try:     
                netflix_coll_instance = database_db_instance.netflix
                retrieved_documents_cursor = netflix_coll_instance.find()
                retrieved_documents = json.loads(dumps(retrieved_documents_cursor))
                count = len(retrieved_documents)
                if count>0 :
                        response = Response(f"{count} Movie Documents Retrieved Successfully \n{dumps(retrieved_documents, indent=2)}", status =200, mimetype='application/json')
                        return response
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
                if updated_film_cursor :
                        retrieve_updated_data = json.loads(dumps(netflix_coll_instance.find({"_id" : updated_film_cursor["_id"]})))
                        response = Response(f"1 Movie Document is Updated Successfully \n{dumps(retrieve_updated_data, indent=2)}", status =200, mimetype='application/json')
                        return response
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
                retrieved_documents = json.loads(dumps(deleted_film_cursor))
                if deleted_film_cursor:
                        reponse = Response(f"Movie with title: \"{movie_title}\" is Successfully Deleted. \n{dumps(retrieved_documents, indent=2)}", status=200, mimetype="application/json")
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
                retrieved_documents = json.loads(dumps(retrieved_documents_cursor))
                count = len(retrieved_documents)
                if count>0 :
                        response = Response(f"{count} Movie Documents with: {movie_title} is Retrieved Successfully \n{dumps(retrieved_documents, indent=2)}", status =200, mimetype='application/json')
                        return response
                else:
                        response = Response(f"No Files Found with Title: \"{movie_title}\"", status= 500, mimetype = "application/json") 
                        return response
        except Exception as ex:
                response = Response(f"Error in Retrieve Operation: {ex}", status=500, mimetype="application/json")
                return response
        

if __name__== '__main__':
        app.run(debug=True)