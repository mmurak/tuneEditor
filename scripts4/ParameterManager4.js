// This module needs GP (parameter database) as global variable.

// These parameters could be overridden by URL parameters

GPD = {};

function _typeSorter(key) {
    const regexp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (regexp.test(GP[key])) {
        GPD[key] = Number(GP[key]);
    } else {
        GPD[key] = GP[key];
    }
}

function initParameters() {
    for (let key in GP) {
        _typeSorter(key);
    }
    let urlParm = location.search.substring(1);
    if (urlParm != "") {
        let args = urlParm.split("&");
        for(let i = 0; i < args.length; i++) {
            _checkAndModify(0, args[i]);
        }
    }
    setupGraphics();
    setupCentreline();
}

// Maintenance panel entry
function override(parm) {
    _checkAndModify(1, parm);   // 1 means the output would be directed to ALERT(), otherwise CONSOLE.LOG()
}

function getShortRep(val) {
    let dat = GP[val];
    let result = "";
    result += (dat.indexOf("Ctrl") >= 0) ? "C" : "c";
    result += (dat.indexOf("Meta") >= 0) ? "M" : "m";
    result += (dat.indexOf("Shift") >= 0) ? "S" : "s";
    result += dat.split("+").pop().toUpperCase();
    return result;
}

function _errorOutput(dest, message) {
    if (dest == 0) {
        console.log(message);
    } else {
        alert(message);
    }
}

function setupCentreline() {
    if (GP["CentrelineSwitch"] == "1") {
        G.centrelineCheckBox.checked = true;
    } else {
        G.centrelineCheckBox.checked = false;
    }
}

function setupGraphics() {
    if (GP["DotsSwitch"] == "1") {
        G.graphicsCheckBox.checked = true;
        G.centrelineCheckBox.disabled = false;
    } else {
        G.graphicsCheckBox.checked = false;
        G.centrelineCheckBox.disabled = true;
    }
}

function _checkAndModify(dest, parm) {
    let parmPair = parm.split("=");
    if (typeof parmPair[1] !== "undefined") {
        if (parmPair[0] in GP) {
            GP[parmPair[0]] = parmPair[1];
            _typeSorter(parmPair[0]);
        } else {
            _errorOutput(dest, "Parameter name not found: " + parm);
        }
    } else {
        _errorOutput(dest, "Parameter format error: " + parm);
    }
}
