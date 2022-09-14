import time
import json
from pymongo import MongoClient
from bson.json_util import loads,dumps

print('Thank you runnning databaseConnection.py, started the process to connect to MongoDB with localhost server....s')
time.sleep(1)

# this is to close the database connection
def closeDBConnection():
    mongo.close()
    print('DATABASE CONNECTION IS ENDED SUCCESSFULLY, THANK YOU')

#this function is to create/insert documents into mongoDB    
def createDocument():
    inputType = input('\nEnter "0" to provide JSON Input or "1" to provide input via guided questions: ')
    try:
        if(inputType=='1'):
            print('\nPlease provide the following details to create new document')
            movie_id = input('Enter movie id: ')
            movie_title = input('Enter title of movie: ')
            movie_type = input('Enter type of movie: ')
            movie_description = input('Enter description of movie: ')
            movie_releaseYear = int(input('Enter movie release year (yyyy): '))
            movie_ageCert = input('Enter age certification of movie: ')
            movie_runtime = int(input('Enter run time of movie (in minutes): '))
            movie_genres = input('Enter genres of movie (comma seperated): ').split(",")
            movie_prodCountries = input('Enter Production Countries of Movie (comma seperated): ').split(",")
            movie_imdb = float(input('Enter imdb score for movie(1.0-10.0): '))
            #insertion of collected data as json with insert_one method  
            records_ids = collection_instance.insert_one(
                {
                    "id": movie_id,
                    "title":movie_title,
                    "type":movie_type,
                    "description":movie_description,
                    "release_year":movie_releaseYear,
                    "age_certification":movie_ageCert,
                    "runtime":movie_runtime,
                    "genres":movie_genres,
                    "production_countries":movie_prodCountries,
                    "imdb_score":movie_imdb
            })
            time.sleep(1)
            print('\nInserted data successfully.', records_ids)
        #insertion of data in json format
        else:
            print('\nPlease enter data in this format [{"id":"Val", "title":"val",.. },{"id":"val", "title":"val",..},...] pair: ') 
            movieDocument = input()
            print('\nFollowing data insertion is in process\n', dumps(loads(movieDocument), indent=2))
            records_ids = collection_instance.insert_many(loads(movieDocument))
            time.sleep(1)
            print('\nInserted data successfully.', records_ids.inserted_ids)  
    
    except Exception as ex:
        print('Error in Insertion to DB.collection, Details: ',ex)

    #want to continue to modify mongoDB
    crud_selection()

# this function is to handle update method
def updateDocument():
    try:
        print('Please enter input in this format {"attribute":"value", "att2":"val",......} to get extract documents that you want to update')
        retrieveQuery = input()
        netflixData_cursor = collection_instance.find(loads(retrieveQuery))
        netflixData_list = list(netflixData_cursor)
        if(netflixData_list):
            print('\nResults of queried search')
            print(dumps(netflixData_list, indent = 2))
            print('\nPlease enter input in this format {"attribute":"value", "att2":"val",......} to get update in the extracted documents')
            updateQuery = input()
            updateType = input('\nPlease enter "0" to update 1st document only (OR) "1" to update all data based on query: ')
            if(updateType=='0'):
                x= collection_instance.update_one(loads(retrieveQuery), {"$set": loads(updateQuery)})
                print(x.modified_count," documents Updated succesfully")
            else:
                x=collection_instance.update_many(loads(retrieveQuery), {"$set": loads(updateQuery)})
                print(x.modified_count," documents Updated succesfully")
        else:
            print('No Documents found with the search query: ',retrieveQuery)

    except Exception as ex:
        print("Error in Updating Operation. Details: ",ex)

    #want to continue to modify mongoDB
    crud_selection()

#this function is to handle retrieval of data from MongoDB
def retrieveDocument():
    retrieveType = input('\nPlease enter "0" to retrieve all data (OR) "1" to retrieve data based on query: ')
    try:
        if(retrieveType=='1'):
            print('Please enter input in this format to get results {"attribute":"value",......} ')
            retrieveQuery = input()
            netflixData_cursor = collection_instance.find(loads(retrieveQuery))
            netflixData_list = list(netflixData_cursor)
            if(netflixData_list):
                print('\nResults of queried search')
                print(dumps(netflixData_list, indent = 2))
            else:
                print("No records found with search query: ", retrieveQuery)            
        else:
            print('Displaying all the netflix data')
            netflixData_cursor = collection_instance.find()
            netflixData_list = list(netflixData_cursor)
            print(dumps(netflixData_list, indent = 2))

    except Exception as ex:
        print('Error in Retrieving Database.collection documents, Details: ',ex)

    #want to continue to modify mongoDB
    crud_selection()

#this function is to handle deletion of documents
def deleteDocument():
    try:
        print('Please enter input in this format to get results {"attribute":"value", "att2":"val",......} & enter to delete')
        retrieveQuery = input()
        netflixData_cursor = collection_instance.find(loads(retrieveQuery))
        netflixData_list = list(netflixData_cursor)
        if(netflixData_list):
            print('\nResults of queried search the file going to be deleted\n', )
            print(dumps(netflixData_list, indent = 2))
            deleteType = input('\nPlease enter "0" to delete 1st document only (OR) "1" to delete all data based on query: ')
            confirmation = input('Type "Yes" to delete above documents (OR) "No" to cancel operation: ')
            if(confirmation.lower()=='yes'):
                if(deleteType=='0'):
                    x= collection_instance.delete_one(loads(retrieveQuery))
                    print(x.deleted_count,' documents deleted succesfully')
                else:
                    x= collection_instance.delete_many(loads(retrieveQuery))
                    print(x.deleted_count,' documents deleted succesfully')
        else:
            print('No Documents found with the search query: ',retrieveQuery)

    except Exception as ex:
        print('Delete operation is failed. Details: ',ex)

    #want to continue to modify mongoDB   
    crud_selection()

#this function is to display option and routing to respective CRUD operation
def crud_selection():
    selection = input('Please enter Yes: if you want to continue to "database": ["netflix"] (OR) No: to end database connection: ')
    if(selection.lower()!='no'):
        print('\nPlease select the type of CRUD operation you want to perform')
        print('1. Create/Insert new documents')
        print('2. Retrieve documents')
        print('3. Update documents')
        print('4. Delete documents')
        print('5. Close the Database Connection')
        selectedValue = input('Waiting for your input, please select (1-5): ')
        if selectedValue == '1':
            createDocument()
        elif selectedValue == '2':
            retrieveDocument()
        elif selectedValue == '3':
            updateDocument()
        elif selectedValue == '4':
            deleteDocument()
        elif selectedValue == '5':
            closeDBConnection()
        else:
            print('/nInvalid Input:', selectedValue,'Please try again')
    else:
        closeDBConnection()



def updateStringToArray(x):
    myQuery = {"production_countries": x["production_countries"]}
    update = json.loads(x["production_countries"])
    newValues = {"$set":{"production_countries":update}} 
    collection_instance.update_one(myQuery,newValues)

#connecting to mongoDB database.netflix instance
try:
    mongo = MongoClient(
        host = 'localhost',
        port = 27017,
        serverSelectionTimeoutMS = 1000
    )
    mongo.server_info() #trigger exception if cannot connect to db
    
    print('CONGRATULATIONS, MongoDB DATABASE CONNECTION ESTABLISHED........ And Contains the following Databases with Collections')

    all_databases = dict((each_database_instance, [collection for collection in mongo[each_database_instance].list_collection_names()])
            for each_database_instance in mongo.list_database_names())
    print(all_databases, '\n')
    database_instance = mongo.database
    collection_instance = database_instance.netflix

    #to update string to array in mongoDB    
    data = collection_instance.find()
    for x in data:
        updateStringToArray(x)


except Exception as ex:
    print('Error in connection to database server',ex,'\n')

if(collection_instance!=''):
    crud_selection()












