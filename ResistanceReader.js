'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var supportAvalon = false;
const roles = [
    'blind spy',
    'deep cover spy',
    'false commander',
    'commander',
    'body guard',
    'defectors variant 1',
    'defectors variant 2'
];

const avalonRoles = [
    'oberon',
    'mordred',
    'morgana',
    'merlin',
    'percival',
    'lancelot variant 1',
    'lancelot variant 2'
];




// --------------- Helpers that build all of the responses -----------------------

/* Support builder functions

function addCardInfo(response, cardType, cardTitle, cardContent){
    if(!response)
}*/

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


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback, session) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = session.attributes;
    const cardTitle = 'Welcome to the Resistance Reader';
    const speechOutput = 'Welcome to the Resistance Reader. What would you like to do?';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'What would you like to do? you can add a role, review settings or start the script.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback, session) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = session.attributes;
    const cardTitle = 'Resistance Reader Help';
    const speechOutput = 'You can add a role, review settings or start the script. So, what would you like to do?';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, speechOutput, shouldEndSession));
}

function addRole(intent, session, callback) {

    const roleSlot = intent.slots.Role;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    var cardTitle;
    

    if (roleSlot) {
        const role = roleSlot.value;
        sessionAttributes[role] = true;
        cardTitle = `${role} added`;
        speechOutput = `${role} added. What would you like to do next?`;
        repromptText = `What would you like to do next? You can add role, review settings or start the script.`;
    } else {
        cardTitle = 'Unknown role';
        speechOutput = "I'm not sure what role you were trying to add. Please try again.";
        repromptText = "I'm not sure what role you were trying to add. Please try again.";
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function removeRole(intent, session, callback) {
    var cardTitle;
    const roleSlot = intent.slots.Role;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (roleSlot) {
        const role = roleSlot.value;
        sessionAttributes[role] = false;
        
        cardTitle = `${role} added`;
        speechOutput = `${role} removed. What would you like to do next?`;
        repromptText = `What would you like to do next? You can add role, review settings or start the script.`;
    } else {
        cardTitle = 'Unknown role';
        speechOutput = "I'm not sure what role you were trying to remove. Please try again.";
        repromptText = "I'm not sure what role you were trying to remove. Please try again.";
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function changeGameType(intent, session, callback) {
    const cardTitle = intent.name;
    const roleSlot = intent.slots.Role;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (roleSlot) {
        const role = roleSlot.value;
        sessionAttributes[role] = false;
        speechOutput = `${role} removed. What would you like to do next?`;
        repromptText = `What would you like to do next? You can add role, review settings or start the script.`;
    } else {
        speechOutput = "I'm not sure what role you were trying to remove. Please try again.";
        repromptText = "I'm not sure what role you were trying to remove. Please try again.";
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

}

function reviewSettings(intent, session, callback) {
    const cardTitle = 'Current configuration';
    let repromptText = "What would you like to do next? You can add role, review settings or start the script.";
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    if (supportAvalon) {
        var gameType = session.attributes.gameType;
        speechOutput += `Your game type is ${gameType}.`;
    }
    speechOutput += "You've added roles ";
    let addedRoles = false;
    roles.forEach((role) => {
        if (sessionAttributes[role]) {
            speechOutput += role + ", ";
            addedRoles = true;
        }
    });
    if (!addedRoles)
        speechOutput = "No roles added.";
        
        speechOutput+=" What would you like to do next?";
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
    let speechOutput;
    if (supportAvalon) {
        var gameType = session.attributes.gameType;
        if (gameType === 'avalon')
            speechOutput = generateAvalonScript(addedRoles, 1000);
        else
            speechOutput = generateResistanceScript(addedRoles, 1000);
    } else {
        speechOutput = generateResistanceScript(addedRoles, 1000);
    }

    callback(session.attributes,
        buildSsmlResponse(cardTitle, speechOutput, null, shouldEndSession,'The script is currently being read'));

}

function generateResistanceScript(addedRoles, msPause) {
    var script = "<speak>";
    script += "Players, close your eyes and put your fists in the center of the group. ";
    script += ("<break time=\"" + (msPause * 1.5) + "ms\"/>");
    if (addedRoles.indexOf('defectors variant 1') >= 0) {
        script += "Spy defector, please put up your thumb. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }
    script += "Spies, ";
    if (addedRoles.indexOf('deep cover spy') >= 0 && addedRoles.indexOf('false commander') >= 0) {
        script += "including the deep cover spy and the false commander, ";
    } else if (addedRoles.indexOf('deep cover spy') >= 0) {
        script += "including the deep cover spy, ";
    } else if (addedRoles.indexOf('false commander') >= 0) {
        script += "including the false commander, ";
    }
    if (addedRoles.indexOf('blind spy') >= 0) {
        script += "but not the blind spy, ";
    }
    script += "open your eyes and acknowledge your fellow spies. ";
    script += ("<break time=\"" + (msPause * 2) + "ms\"/>");
    script += "Everyone close your eyes and put your thumbs down. ";
    script += ("<break time=\"" + msPause + "ms\"/>");
    if (addedRoles.indexOf('commander') >= 0) {
        script += "Spies, ";
        if (addedRoles.indexOf('blind spy') >= 0 && addedRoles.indexOf('false commander') >= 0) {
            script += "including the blind spy and the false commander, ";
        } else if (addedRoles.indexOf('blind spy') >= 0) {
            script += "including the blind spy, ";
        } else if (addedRoles.indexOf('false commander') >= 0) {
            script += "including the false commander, ";
        }
        if (addedRoles.indexOf('deep cover spy') >= 0) {
            script += "but not the deep cover spy, ";
        }
        script += "put up your thumbs. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
        script += "Commander, open your eyes and see the spies. ";
        script += ("<break time=\"" + (msPause * 2) + "ms\"/>");
        script += "Everyone, close your eyes and put your thumbs down. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }
    if (addedRoles.indexOf('body guard') >= 0 && (addedRoles.indexOf('commander') >= 0 || addedRoles.indexOf('false commander') >= 0)) {
        if (addedRoles.indexOf('commander') >= 0 && addedRoles.indexOf('false commander') >= 0) {
            script += "Commander and false commander, ";
        } else if (addedRoles.indexOf('commander') >= 0) {
            script += "Commander, ";
        } else if (addedRoles.indexOf('false commander') >= 0) {
            script += "False commander, ";
        }
        script += " please put up your thumbs. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
        script += "Body guard, open your eyes. ";
        script += ("<break time=\"" + (msPause * 1.5) + "ms\"/>");
        script += "Everyone close your eyes and put your thumbs down. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }

    if (addedRoles.indexOf('defectors variant 2') >= 0) {
        script += "Defectors, open your eyes and acknowledge one another. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
        script += "Defectors, close your eyes. ";
        script += ("<break time=\"" + msPause + "ms\"/>");
    }
    script += "Everyone open your eyes. ";
    script += "</speak>";

    return script;

}

function generateAvalonScript(addedRoles, msPause) {
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
    session.attributes.gameType = 'resistance';
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
        addRole(intent, session, callback);
    } else if (intentName === 'RemoveRole') {
        removeRole(intent, session, callback);
    } else if (intentName === 'ReviewSettings') {
        reviewSettings(intent, session, callback);
    } else if (intentName === 'ReadScript') {
        readScript(intent, session, callback);
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