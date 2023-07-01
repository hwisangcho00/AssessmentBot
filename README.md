# AssessmentBot_Cho

Webhook service that handles and responds to POST requests from DialogFlow.\
<br>
Utilizes the Cloud Functions for Firebase to respond to triggers -> ./functions/src/index.ts\
Able to connect to Cloud Firetore to retrieve and update accordingly to user input - > ./functions/src/firestore.ts
Tested functionalities by sending different queries with unique sessionIds -> ./functions/testing/test.ts
