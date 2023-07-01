# AssessmentBot_Cho

Webhook service that handles and responds to POST requests from DialogFlow.\
<br>
Utilizes the Cloud Functions for Firebase to respond to triggers -> ./functions/src/index.ts\
Able to connect to Cloud Firetore to retrieve and update accordingly to user input - > ./functions/src/firestore.ts
Tested functionalities by sending different queries with unique sessionIds -> ./functions/testing/test.ts
<br>

## Functionalities:
- after receiving an offer - "how about {offer}" - the bot responds with the average of all offers it has received during the session
- when provided with a name - "My name is {name}" - the bot remembers the name and reponds by "Hello, {name}".
- When asked for a name - "What is my name?" - the bot responds by "Your name is {name}" if the user has already told the bot its name. Otherwise, the bot responds by "You haven't told me your name yet. What is your name?"
