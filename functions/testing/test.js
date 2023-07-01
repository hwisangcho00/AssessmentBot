"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// projectId: ID of the GCP project where Dialogflow agent is deployed
var projectId = "assessmentbot-lwbx";
// sessionId: String representing a random number or hashed user identifier
var sessionId = "newTest";
// queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
var queries = [
    "What is my name?",
    "My name is John",
    "How about 8000?",
    "What is my name?",
    "How about 12000?",
    "How about 15000?",
];
// languageCode: Indicates the language Dialogflow agent should use to detect intents
var languageCode = "en";
// Imports the Dialogflow library
var dialogflow = require("@google-cloud/dialogflow");
var storage_1 = require("@google-cloud/storage");
// Instantiates a session client
var sessionClient = new dialogflow.SessionsClient();
function detectIntent(projectId, sessionId, query, contexts, languageCode) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionPath, request, responses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
                    request = {
                        queryParams: {},
                        session: sessionPath,
                        queryInput: {
                            text: {
                                text: query,
                                languageCode: languageCode,
                            },
                        },
                    };
                    if (contexts && contexts.length > 0) {
                        request.queryParams = {
                            contexts: contexts,
                        };
                    }
                    return [4 /*yield*/, sessionClient.detectIntent(request)];
                case 1:
                    responses = _a.sent();
                    return [2 /*return*/, responses[0]];
            }
        });
    });
}
function executeQueries(projectId, sessionId, queries, languageCode) {
    return __awaiter(this, void 0, void 0, function () {
        var context, intentResponse, _i, queries_1, query, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, queries_1 = queries;
                    _a.label = 1;
                case 1:
                    if (!(_i < queries_1.length)) return [3 /*break*/, 6];
                    query = queries_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log("Sending Query: ".concat(query));
                    return [4 /*yield*/, detectIntent(projectId, sessionId, query, context, languageCode)];
                case 3:
                    intentResponse = _a.sent();
                    console.log("Detected intent");
                    console.log("Fulfillment Text: ".concat(intentResponse.queryResult.fulfillmentMessages[0].text.text[0]));
                    // Use the context from this response for next queries
                    context = intentResponse.queryResult.outputContexts;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function authenticateImplicitWithAdc() {
    return __awaiter(this, void 0, void 0, function () {
        var storage, buckets, _i, buckets_1, bucket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = new storage_1.Storage({
                        projectId: projectId,
                    });
                    return [4 /*yield*/, storage.getBuckets()];
                case 1:
                    buckets = (_a.sent())[0];
                    console.log("Buckets:");
                    for (_i = 0, buckets_1 = buckets; _i < buckets_1.length; _i++) {
                        bucket = buckets_1[_i];
                        console.log("- ".concat(bucket.name));
                    }
                    console.log('Listed all storage buckets.');
                    return [2 /*return*/];
            }
        });
    });
}
authenticateImplicitWithAdc();
executeQueries(projectId, sessionId, queries, languageCode);
