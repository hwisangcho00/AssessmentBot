import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

import {Request, Response} from "express";

import {initializeAppWithProjectId, addOffer, generateOffer, saveName, getName} from "./firestore";

// Function that we want to deploy to firebase functions
export const handleDialogFlowWebhook = onRequest(async (request : Request, response : Response) => {
  const queryResult = request.body.queryResult; // queryResult of the json file
  const tag = queryResult.intent.displayName; // name of the intent
  const parameters = queryResult.parameters;
  // sample format: projects/assessmentbot-lwbx/agent/sessions/4141bdf9-4bc4-b9c7-8b93-88d6fa196f09
  const sessionIdList = request.body.session.split("/");
  const sessionId = sessionIdList[sessionIdList.length - 1]; // last string holds the session id
  const db = initializeAppWithProjectId(); // firestore db

  let jsonResponse = {};
  // check the tag and modify jsonResponse to the corresponding intent
  if (tag === "Default Welcome Intent") {
    jsonResponse = {
      fulfillment_messages: [
        {
          text: {
            text: ["Hello. Would you like to make an offer?"],
          },
        },
      ],
    };
  } else if (tag === "get-name") { // "My name is ______"
    const name = parameters["name"].name;
    await saveName(db, sessionId, name);
    jsonResponse = {
      fulfillment_messages: [
        {
          text: {
            text: [`Hello, ${name}`],
          },
        },
      ],
    };
  } else if (tag === "get-offer") { // "How about ____?"
    const offer = parameters["offer"];

    await addOffer(db, sessionId, offer); // add the new offer

    const responseOffer = await generateOffer(db, sessionId); // calculate the current average offer

    jsonResponse = {
      fulfillment_messages: [
        {
          text: {
            text: [
              `${responseOffer}`,
            ],
          },
        },
      ],
    };
  } else if (tag === 'asked-name') { // "What is my name?"
    let name = await getName(db, sessionId); // if "get-name" hasn't been executed, it returns an empty string ""

    // handles a weird behavior where name contains the string literal for vscode tests
    // but contains Object variable for DialogFlow tests
    if (!name.name === undefined) {
      name = name.name;
    }

    let responseText;
    if (name === "") {
      responseText = "You haven't told me your name yet. What is your name?";
    } else {
      responseText = `Your name is ${name}`;
    }

    jsonResponse = {
      // fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
      fulfillment_messages: [
        {
          text: {
            // fulfillment text response to be sent to the agent
            text: [
              responseText,
            ],
          },
        },
      ],
    };
  } else {
    jsonResponse = {
      // fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
      fulfillment_messages: [
        {
          text: {
            // fulfillment text response to be sent to the agent
            text: [
              `There are no fulfillment responses defined for "${tag}"" tag`,
            ],
          },
        },
      ],
    };
  }
  response.send(jsonResponse); // send out json response
});
