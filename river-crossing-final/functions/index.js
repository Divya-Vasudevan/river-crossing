const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();
const deviceId = "e00fce6851f1e878f8e16268";
const token = "1f57f59b9dd429432661770758d1fb14d81a5ca2";
const fetch = require("isomorphic-fetch")


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });

const getstatuses = async () => {
    const theobject = await admin.firestore().doc("placeCounts/cHpzUXoRX99GfwTBJzs5").get().then(document => {
            return document.data();
        })
        .catch(error => {
            console.log(error);
        });
    return theobject;
}

const getTotemStatus = async (totemPath) => {
    const theobject = await admin.firestore().doc(totemPath).get().then(document => {
            return document.data();
        })
        .catch(error => {
            console.log(error);
        });
    return theobject;
}

const updateTotemStatus = (elemObj, totemName) => {
    admin
        .firestore()
        .doc("totems/" + totemName)
        .update({
            onBoat: elemObj.onBoat,
            position: elemObj.position,
            type: elemObj.type
        })
}

const updateStatuses = (statusVars) => {
    admin
        .firestore()
        .doc("placeCounts/cHpzUXoRX99GfwTBJzs5")
        .update({
            mNorth: statusVars.mNorth,
            mSouth: statusVars.mSouth,
            cNorth: statusVars.cNorth,
            cSouth: statusVars.cSouth,
            mBoat: statusVars.mBoat,
            cBoat: statusVars.cBoat,
            boatSide: statusVars.boatSide,
            boatNum: statusVars.boatNum,
            erWin: statusVars.erWin,
            message: statusVars.message
        })
}

exports.changeBoatState = functions.https.onRequest(async (request, response) => {
    let totemName = request.body.data;
    //let totemName = "totem1";
    const totemPath = "totems/" + totemName;
    console.log(totemName);
    let statusVars = await getstatuses();
    let elemObj = await getTotemStatus(totemPath);
    if (elemObj.onBoat === true) {
        elemObj.onBoat = false;
        statusVars.boatNum--;
        if (statusVars.boatSide !== elemObj.position) {
            statusVars.boatSide = elemObj.position;
            showBoatSide(statusVars.boatSide);
            verifyCount(statusVars);
        }
        if (elemObj.type === 'c') {
            statusVars.cBoat--;
            if (statusVars.boatSide === "north") {
                statusVars.cNorth++;
            } else {
                statusVars.cSouth++;
            }
        } else {
            statusVars.mBoat--;
            if (statusVars.boatSide === "north") {
                statusVars.mNorth++;
            } else {
                statusVars.mSouth++;
            }
        }
        //statusVars.message = `Keep Playing`;
    } else {
        if (statusVars.boatNum >= 2 && statusVars.erWin !== true) {
            console.log("Oops!! Cannot have more than 2 animals on boat.\nREMOVE ONE");
            statusVars.message = "Oops!! Cannot have more than 2 totems on boat.</br></br>REMOVE ONE TO ADD MORE";
        } else if (elemObj.position !== statusVars.boatSide && (statusVars.erWin !== true)) {
            console.log(`Oops!! Boat is not on ${elemObj.position} side. Pick an animal on ${statusVars.boatSide} side to continue.`);
            statusVars.message = `Oops!! Boat is not on ${elemObj.position} side. Pick an animal on ${statusVars.boatSide} side to continue.`;
        } else {
            elemObj.onBoat = true;
            statusVars.boatNum++;
            if (elemObj.type === 'c') {
                statusVars.cBoat++;
                if (statusVars.boatSide === "north") {
                    statusVars.cNorth--;
                } else {
                    statusVars.cSouth--;
                }
            } else {
                statusVars.mBoat++;
                if (statusVars.boatSide === "north") {
                    statusVars.mNorth--;
                } else {
                    statusVars.mSouth--;
                }
            }
            //statusVars.message = `Keep Playing`;
        }
    }
    if (statusVars.erWin === true) {
        if ((statusVars.mNorth + statusVars.cNorth) === 6) {
            statusVars.erWin = false;
            statusVars.boatSide = "north";
            showBoatSide(statusVars.boatSide);
            console.log("Start Playing");
            statusVars.message = "Start Playing";
        }
    }
    totemLightState(elemObj);
    //check if all are on opposite side -> indicate end of game
    if ((statusVars.mSouth + statusVars.cSouth) === 6 && (statusVars.erWin !== true)) {
        console.log("CONGRATUALTIONS YOU WIN");
        console.log("move all back to north to play again");
        statusVars.message = "CONGRATUALTIONS YOU WIN!!</br></br>Move all animals to the north to play again";
        winLights();
        statusVars.erWin = true;
    }
    updateTotemStatus(elemObj, totemName);
    updateStatuses(statusVars);
    //response.send("done");
    endResponse(response);
})

totemLightState = async (elemObj) => {
    let func = "";
    if (elemObj.onBoat === true) {
        func = "lightOn";
    } else {
        func = "lightOff";
    }
    const url = `https://api.particle.io/v1/devices/${elemObj.deviceId}/${func}?access_token=${token}`;
    fetch(url, {
            method: "POST"
        }).then(resp => {
            console.log(resp)
            return resp;
        })
        .catch(error => {
            console.log(error);
        });
    console.log("totem light");
    //endResponse(ret);
}

exports.move = functions.https.onRequest(async (request, response) => {
    let totemName = request.body.data;
    //let totemName = "totem1";
    const totemPath = "totems/" + totemName;
    console.log(totemName);

    let statusVars = await getstatuses();
    let elemObj = await getTotemStatus(totemPath);

    if (elemObj.position === "north") {
        if (elemObj.onBoat !== true) {
            if (elemObj.type === 'c') {
                statusVars.cNorth--;
                statusVars.cSouth++;
            } else {
                statusVars.mNorth--;
                statusVars.mSouth++;
            }
        }
        elemObj.position = "south";
        statusVars.boatSide = "south";
    } else {
        if (elemObj.onBoat !== true) {
            if (elemObj.type === 'c') {
                statusVars.cNorth++;
                statusVars.cSouth--;
            } else {
                statusVars.mNorth++;
                statusVars.mSouth--;
            }
        }
        elemObj.position = "north";
        statusVars.boatSide = "north";
    }
    if (elemObj.onBoat === true) {
        showBoatSide(statusVars.boatSide);
        verifyCount(statusVars);
        //statusVars.message = `Keep Playing`;
    } else {
        if (statusVars.erWin === true) {
            if ((statusVars.mNorth + statusVars.cNorth) === 6) {
                statusVars.erWin = false;
                statusVars.boatSide = "north";
                showBoatSide(statusVars.boatSide);
                console.log("Start Playing in move func" + statusVars.mNorth + "|" + statusVars.cNorth);
                statusVars.message = "Start Playing";
            }
        } else {
            errorLights();
            statusVars.erWin = true;
            console.log("ERROR: Cannot move totems without placing on boat.\nRESTART GAME");
            statusVars.message = "Oops!! Cannot move animals without placing on boat.</br></br>RESTART GAME</br></br>Move all animals to the north to play again";
            if (statusVars.erWin === true) {
                if ((statusVars.mNorth + statusVars.cNorth) === 6) {
                    statusVars.erWin = false;
                    statusVars.boatSide = "north";
                    showBoatSide(statusVars.boatSide);
                    console.log("Start Playing in move else" + statusVars.mNorth + "|" + statusVars.cNorth);
                    statusVars.message = "Cannot move animals without placing on boat.</br></br>START AGAIN";
                }
            }
        }
    }
    updateTotemStatus(elemObj, totemName);
    updateStatuses(statusVars);
    //response.send("done");
    endResponse(response);
});

showBoatSide = async (side) => {
    let func = "";
    if (side === "north") {
        func = "lightNorth";
    } else {
        func = "lightSouth";
    }
    const url = `https://api.particle.io/v1/devices/${deviceId}/${func}?access_token=${token}`;
    fetch(url, {
            method: "POST"
        }).then(resp => {
            console.log(resp)
            return 0;
        })
        .catch(error => {
            console.log(error);
        });
    console.log("show new boat func");
}

errorLights = async () => {
    const url = `https://api.particle.io/v1/devices/${deviceId}/lightError?access_token=${token}`;
    fetch(url, {
            method: "POST"
        }).then(resp => {
            console.log(resp)
            return 0;
        })
        .catch(error => {
            console.log(error);
        });
    console.log("error lights");
}

winLights = async () => {
    const url = `https://api.particle.io/v1/devices/${deviceId}/lightWin?access_token=${token}`;
    fetch(url, {
            method: "POST"
        }).then(resp => {
            console.log(resp)
            return 0;
        })
        .catch(error => {
            console.log(error);
        });
    console.log("win lights");
}

verifyCount = (statusVars) => {
    if (statusVars.boatSide === "south") {
        let mNumSouth = statusVars.mSouth + statusVars.mBoat;
        let cNumSouth = statusVars.cSouth + statusVars.cBoat;
        if (((mNumSouth < cNumSouth) && (mNumSouth !== 0)) || ((statusVars.mNorth < statusVars.cNorth) && (statusVars.mNorth !== 0))) {
            console.log("SORRY: The tigers overpowered the goats and ate them up.\n START AGAIN");
            statusVars.message = "SORRY: The tigers overpowered the goats and ate them up.</br></br>RESTART GAME";
            errorLights();
            statusVars.erWin = true;
            if (statusVars.erWin === true) {
                if ((statusVars.mNorth + statusVars.cNorth) === 6) {
                    statusVars.erWin = false;
                    statusVars.boatSide = "north";
                    showBoatSide(statusVars.boatSide);
                    console.log("can start playing again");
                    statusVars.message = "Oops!! The tigers overpowered the goats and ate them up.</br></br>START AGAIN";
                }
            }
        }
    } else {
        let mNumNorth = statusVars.mNorth + statusVars.mBoat;
        let cNumNorth = statusVars.cNorth + statusVars.cBoat;
        if (((mNumNorth < cNumNorth) && (mNumNorth !== 0)) || ((statusVars.mSouth < statusVars.cSouth) && (statusVars.mSouth !== 0))) {
            console.log("SORRY: The tigers overpowered the goats and ate them up.\n START AGAIN");
            statusVars.message = "Oops!! The tigers overpowered the goats and ate them up.</br></br>RESTART GAME";
            errorLights();
            if (statusVars.erWin === true) {
                if ((statusVars.mNorth + statusVars.cNorth) === 6) {
                    statusVars.erWin = false;
                    statusVars.boatSide = "north";
                    showBoatSide(statusVars.boatSide);
                    console.log("can start playing again");
                    statusVars.message = "Oops!! The tigers overpowered the goats and ate them up.</br></br>START AGAIN";
                }
            }
            statusVars.erWin = true;
        }
    }
    updateStatuses(statusVars);
}

endResponse = (response) => {
    if (response.status(200)) {
        response.status(200).end();
    } else {
        response.end();
    }
}