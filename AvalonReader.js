'use strict';

const roles = [
    'oberon',
    'mordred',
    'morgana',
    'merlin',
    'percival',
    'lancelot variant 1',
    'lancelot variant 2'
];


const skillName='Avalon Reader';

function generateScript(addedRoles, msPause) {
    var script = "<speak>";
    script += "Players, close your eyes and put your fists in the center of the group. ";
    script += ("<break time=\"" + (msPause * 1.5) + "ms\"/>");
    if (addedRoles.indexOf('lancelot variant 1') >= 0) {
        script += "Evil lancelot, please put up your thumb. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }
    script += "Minions of mordred, ";
    if (addedRoles.indexOf('mordred') >= 0 && addedRoles.indexOf('morgana') >= 0) {
        script += "including mordred and Morgana, ";
    } else if (addedRoles.indexOf('mordred') >= 0) {
        script += "including the mordred, ";
    } else if (addedRoles.indexOf('morgana') >= 0) {
        script += "including the morgana, ";
    }
    if (addedRoles.indexOf('oberon') >= 0) {
        script += "but not oberon, ";
    }
    script += "open your eyes and acknowledge your fellow minions. ";
    script += ("<break time=\"" + (msPause * 2) + "ms\"/>");
    script += "Everyone close your eyes and put your thumbs down. ";
    script += ("<break time=\"" + msPause + "ms\"/>");
    if (addedRoles.indexOf('merlin') >= 0) {
        script += "Minions of Mordred, ";
        if (addedRoles.indexOf('oberon') >= 0 && addedRoles.indexOf('morgana') >= 0) {
            script += "including oberon and morgana, ";
        } else if (addedRoles.indexOf('oberon') >= 0) {
            script += "including Oberon, ";
        } else if (addedRoles.indexOf('morgana') >= 0) {
            script += "including Morgana, ";
        }
        if (addedRoles.indexOf('mordred') >= 0) {
            script += "but not Mordred, ";
        }
        script += "put up your thumbs. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
        script += "Merlin, open your eyes and see the minions. ";
        script += ("<break time=\"" + (msPause * 2) + "ms\"/>");
        script += "Everyone, close your eyes and put your thumbs down. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }
    if (addedRoles.indexOf('percival') >= 0 && (addedRoles.indexOf('merlin') >= 0 || addedRoles.indexOf('morgana') >= 0)) {
        if (addedRoles.indexOf('merlin') >= 0 && addedRoles.indexOf('morgana') >= 0) {
            script += "Merlin and morgana, ";
        } else if (addedRoles.indexOf('merlin') >= 0) {
            script += "Merlin, ";
        } else if (addedRoles.indexOf('morgana') >= 0) {
            script += "Morgana, ";
        }
        script += " please put up your thumbs. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
        script += "Percival, open your eyes. ";
        script += ("<break time=\"" + (msPause * 1.5) + "ms\"/>");
        script += "Everyone close your eyes and put your thumbs down. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }

    if (addedRoles.indexOf('lancelot variant 2') >= 0) {
        script += "Lancelots, open your eyes and acknowledge one another. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
        script += "Lancelots, close your eyes. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }
    script += "Everyone open your eyes. ";
    script += "</speak>";

    return script;

}

// --------------- Functions that control the skill's behavior -----------------------
const availableActions='You can add or remove a role, list available roles, review settings or start the script.'

function getWelcomeResponse(callback, session) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = session.attributes;
    const cardTitle = `Welcome to the ${skillName}`;
    const speechOutput = `Welcome to the ${skillName}. What would you like to do?`;
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = `What would you like to do? ${availableActions}`;
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback, session) {
    const sessionAttributes = session.attributes;
    const cardTitle = `${skillName} Help`;
    const speechOutput = `${availableActions} So, what would you like to do?`;
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, speechOutput, shouldEndSession));
}

function listRoles(intent, session, callback) {
    const sessionAttributes = session.attributes;
    const cardTitle = 'Available roles';
    const speechOutput = 'Available roles are '+roles.join(', ')+'. What would you like to do now?';
    const shouldEndSession = false;
    
    const repromptText = `What would you like to do? ${availableActions}`;
    

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function setRole(intent, session, callback, enable) {
    var cardTitle;
    const roleSlot = intent.slots.Role;
    const repromptText = `What would you like to do next? ${availableActions}`;
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    let action = enable ? "added" : "removed";

    if (roleSlot) {
        const role = roleSlot.value;
        sessionAttributes[role] = enable;

        cardTitle = `${role} ${action}`;
        speechOutput = `${role} ${action}. What would you like to do next?`;
            callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    } else {
        listRoles(intent, session, callback);
    }

}

function reviewSettings(intent, session, callback) {
    const cardTitle = 'Current configuration';
    let repromptText = `What would you like to do next? ${availableActions}`;
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = "You've added roles ";
    let addedRoles = false;
    roles.forEach((role) => {
        if (sessionAttributes[role]) {
            speechOutput += role + ", ";
            addedRoles = true;
        }
    });
    if (!addedRoles)
        speechOutput = "No roles added.";

    speechOutput += " What would you like to do next?";
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function readScript(intent, session, callback) {
    var addedRoles = [];
    roles.forEach((role) => {
        if (session.attributes[role]) {
            addedRoles.push(role);
        }
    });
    console.log(`Reading script with roles: ${JSON.stringify(addedRoles)}`);

    const cardTitle = 'Reading script';

    const shouldEndSession = true;
    let speechOutput= generateScript(addedRoles, 1000);


    callback(session.attributes,
        buildSsmlResponse(cardTitle, speechOutput, null, shouldEndSession, 'The script is currently being read'));

}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = '';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
    session.attributes = {};
    roles.forEach((role) => {
        session.attributes[role] = false;
    });
    console.log(`Session attributes ${JSON.stringify(session.attributes)}`);

}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback, session);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}, intentName=${intentName}`);

    // Dispatch to your skill's intent handlers
    if (intentName === 'AddRole') {
        setRole(intent, session, callback, true);
    } else if (intentName === 'RemoveRole') {
        setRole(intent, session, callback, false);
    } else if (intentName === 'ReviewSettings') {
        reviewSettings(intent, session, callback);
    } else if (intentName === 'ReadScript') {
        readScript(intent, session, callback);
    } else if (intentName === 'ListRoles') {
        listRoles(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getHelpResponse(callback, session);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({
                requestId: event.request.requestId
            }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: title,
            content: output,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildSsmlResponse(title, output, repromptText, shouldEndSession, cardText) {
    return {
        outputSpeech: {
            type: 'SSML',
            ssml: output,
        },
        card: {
            type: 'Simple',
            title: title,
            content: cardText,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
