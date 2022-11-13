history.pushState(null, null, null);
let G = new GlobalManager();
initParameters();
setupCentreline();

G.textCanvas.width = GPD["CanvasMinWidth"];
G.cursorCanvas.width = G.textCanvas.width;
G.textCanvas.height = GPD["CanvasMinHeight"];
G.cursorCanvas.height = G.textCanvas.height;
G.aView = new CanvasManager(G.textCanvas, G.cursorCanvas, 30);
G.aModel = new Model(G.aView);    // Model->View path
G.aDispatcher = new Dispatcher(G.aModel);  // Controller->Model path
G.aView.fitScrollCanvas2Window();
G.aModel.canvasMgr.draw(true);

// disable "prev-page" function of the browser
window.addEventListener("popstate", function (evt) {
    history.pushState(null, null, null);
    return;
});

/* Main REP loop */
document.addEventListener("keydown", function (evt) {
    let keyname = evt.key;
    if ((keyname == "Shift") || (keyname == "Meta") || (keyname == "Alt")) return;
    G.aDispatcher.dispatch(evt);
    if (keyname == " ")  evt.preventDefault();
});

window.addEventListener("blur", function (evt) {
    G.aView._hideBlinkingCursor();
});

window.addEventListener("focus", function (evt) {
    G.aView.draw(false);
});

window.addEventListener('keydown', function(evt){   // To prevent Back/Forward page
    let kc = event.keyCode;
    switch (kc) {
        case 37:    // ←
        case 39:    // →
            evt.preventDefault();
    }
}, true);


//////////
function _analyseClickedInfo(evt) {
    // fetch logical block information
    let realY = evt.offsetY - GPD["CanvasTopMargin"];
    if (realY <= 0) return [-1, -1, 0];
    let dotsAreaHeight = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
    let tsmDotsHeight = GPD["TSMHeight"] + dotsAreaHeight;
    let lineId = Math.trunc(realY / tsmDotsHeight);
    let innerYOffset = realY % tsmDotsHeight;
    let resultType = 0;
    if ((innerYOffset <= GPD["TSMHeight"]) || (GPD["DotsSwitch"] == 0)) {
        resultType = 1;     // TSM area
    } else if (innerYOffset <= tsmDotsHeight) {
        innerYOffset -= GPD["TSMHeight"];
        resultType = 2;     // Dots area
    } else {
        resultType = -1;    // Out of Bounce
    }
    let innerXOffset = evt.offsetX - GPD["CanvasLeftMargin"];
    return [lineId, resultType, innerXOffset, innerYOffset];	
}

function textFinder(lineNo, offset) {
	let textLines = G.aModel.getTextLines();
	if (lineNo  >= textLines.length) {
		return -1;
	}
	G.textClick = true;
	let chp = 0;
	while ((chp < textLines[lineNo].length) && G.aView.ctx.measureText(textLines[lineNo].substr(0, chp+1)).width < offset) {
		chp+=1;
	}
	let sumPtr = 0;
	for (let i = 0; i < lineNo; i++) {
		sumPtr += textLines[i].length + 1;
	}
	return sumPtr + chp;
}

function createSubToneArray(lineId) {
    let ptrStart = 0;
    let ptrEnd = 0;
    let textArray = G.aModel.textdata.split(/\n/);
    for (let i = 0; i < lineId; i++) {
        ptrStart += textArray[i].length + 1;
    }
    ptrEnd = ptrStart + textArray[lineId].length + 1;
    // get subset of [toneArray and the regularised offset]
    let sta = [];
    for (let i = 1; i < G.aModel.tnm.altArray.length; i += 2) {
        let vowelClusterPtr = G.aModel.tnm.altArray[i];
        if ((vowelClusterPtr >= ptrStart) && (vowelClusterPtr <= ptrEnd)) {
            let noteArrayIdx = Math.trunc(i / 2);
            sta.push([G.aModel.tnm.noteArray[noteArrayIdx], G.aView._getCoordInfo(noteArrayIdx), noteArrayIdx]);
        }
    }
    return sta;
}

G.aView.ccanvas.addEventListener("mousedown", function(evt) {
	let ci = _analyseClickedInfo(evt);
	if (ci[0] == -1)  return;		// upper oob
    G.mouseDown = true;
    if (ci[1]== 1) {					// TSM field
    	let chp = textFinder(ci[0], ci[2]);
    	if (chp == -1)  return   // lower oob
        G.textClick = true;
        if (evt.shiftKey) {
            G.aModel.edge = chp;
        } else {
            G.aModel.ptr = G.aModel.edge = chp;
        }
        G.aModel.selPtr = G.NotSelected;
        G.aModel.separatorPtr =  G.NotSelected;
        G.aView.draw(false);
    } else if (G.separator1.checked) {   // put a separator 
        G.separator1.checked = false;
        if (evt.shiftKey && evt.altKey) {
            G.aModel.tnm.separatorArray.push(new Separator4(ci[0], ci[2]));
        } else if (evt.shiftKey) {
            G.aModel.tnm.separatorArray.push(new Separator2(ci[0], ci[2]));
        } else if (evt.altKey) {
            G.aModel.tnm.separatorArray.push(new Separator3(ci[0], ci[2]));
        } else {
            G.aModel.tnm.separatorArray.push(new Separator1(ci[0], ci[2]));
        }
        G.aModel.selPtr = G.NotSelected;
        G.aModel.separatorPtr = G.NotSelected;
    } else if (G.separator2.checked) {   // put a Dashed separator 
        G.separator2.checked = false;
        if (evt.shiftKey && evt.altKey) {
            G.aModel.tnm.separatorArray.push(new SeparatorDL4(ci[0], ci[2]));
        } else if (evt.shiftKey) {
            G.aModel.tnm.separatorArray.push(new SeparatorDL2(ci[0], ci[2]));
        } else if (evt.altKey) {
            G.aModel.tnm.separatorArray.push(new SeparatorDL3(ci[0], ci[2]));
        } else {
            G.aModel.tnm.separatorArray.push(new SeparatorDL1(ci[0], ci[2]));
        }
        G.aModel.selPtr = G.NotSelected;
        G.aModel.separatorPtr = G.NotSelected;
    } else {    // tone process
        let subArray = createSubToneArray(ci[0]);
        let delta = 99999;
        G.iap = 0;
        if (G.summon.checked == false) {
            for (let i = 0; i < subArray.length; i++) {
                if (subArray[i][0].visible == false)
                    continue;
                let tempDelta = Math.abs(subArray[i][1][1] + ((subArray[i][0]).width) - ci[2]);
                if (tempDelta < delta) {
                    G.iap = subArray[i][2];
                    delta = tempDelta;
                }
            }
            let sepDelta = 99999;
            let tempSPtr = 0;
            for (let j = 0; j < G.aModel.tnm.separatorArray.length; j++) {
                if (G.aModel.tnm.separatorArray[j].visible == false)
                    continue;
                if (G.aModel.tnm.separatorArray[j].lineNo != ci[0])
                    continue;
                let tempDelta = Math.abs(G.aModel.tnm.separatorArray[j].offset - ci[2]);
                if (tempDelta < sepDelta) {
                    tempSPtr = j;
                    sepDelta = tempDelta;
                }
            }
            if (delta <= sepDelta) {
                if (G.aModel.selPtr == G.iap) {
                    G.aModel.selPtr = G.NotSelected;
                    G.aModel.separatorPtr =  G.NotSelected;
                } else {
                    if (evt.shiftKey) { // Smoother
                        smoother(subArray);
                        G.aModel.selPtr = G.NotSelected;
                        G.aModel.separatorPtr =  G.NotSelected;
                    } else {
                        G.aModel.selPtr = G.iap;
                        G.aModel.separatorPtr =  G.NotSelected;
                        G.aModel.ptr = G.aModel.edge = G.aModel.tnm.altArray[G.iap * 2 + 1];
                    }
                }
            } else {
                if (G.aModel.separatorPtr == tempSPtr) {
                    G.aModel.selPtr = G.NotSelected;
                    G.aModel.separatorPtr =  G.NotSelected;
                } else {
                    G.aModel.selPtr = G.NotSelected;
                    G.aModel.separatorPtr =  tempSPtr;
                }
            }
        } else {    // summon process
            let sapt = 0;
            for (i = 0; i < subArray.length; i++) {
                if (subArray[i][0].visible)  continue;
                tempDelta = Math.abs(subArray[i][1][1] + ((subArray[i][0]).width) - ci[2]);
                if (tempDelta < delta) {
                    G.iap = subArray[i][2];
                    sapt = i;
                    delta = tempDelta;
                }
            }
            let sepDelta = 99999;
            let tempSPtr = 0;
            for (let j = 0; j < G.aModel.tnm.separatorArray.length; j++) {
                if (G.aModel.tnm.separatorArray[j].visible)
                    continue;
                if (G.aModel.tnm.separatorArray[j].lineNo != ci[0])
                    continue;
                let tempDelta = Math.abs(G.aModel.tnm.separatorArray[j].offset - ci[2]);
                if (tempDelta < sepDelta) {
                    tempSPtr = j;
                    sepDelta = tempDelta;
                }
            }
            if (delta <= sepDelta) {
                subArray[sapt][0].visible = true;
                G.aModel.selPtr = G.NotSelected;
                G.aModel.separatorPtr = G.NotSelected;
            } else {
                G.aModel.tnm.separatorArray[tempSPtr].visible  = true;
                G.aModel.selPtr = G.NotSelected;
                G.aModel.separatorPtr = G.NotSelected;
            }
        }
    }
    G.summon.checked = false;
    G.aView.draw(false);
});

function getSubArrayIndexFromGlobalIndex(subArray, x) {
    for(let i = 0; i < subArray.length; i++) {
        if (subArray[i][2] == x) {
            return i;
        }
    }
    return -1;
}

function smoother(subArray) {
    let startP = subArray[0][2];
    let endP = subArray[subArray.length-1][2];
    if ((startP <= G.aModel.selPtr) && (G.aModel.selPtr <= endP)) {
        let fromP = getSubArrayIndexFromGlobalIndex(subArray, G.aModel.selPtr);
        let toP = getSubArrayIndexFromGlobalIndex(subArray, G.iap);
        if (fromP > toP) {
            [fromP, toP] = [toP, fromP];
        }
        let startHeight = subArray[fromP][0].height;
        let endHeight = subArray[toP][0].height;
        if ((GPD["DotDistributionPattern"] == 2) && 
            ((startHeight >= -1) || (startHeight <= G.aView.MaxLevel) ||
            (endHeight >= -1) || (endHeight <= G.aView.MaxLevel))) {
            if (window.confirm("'Smoothing' would work better with 'DotDistributionPattern=0'.\nPress 'OK' to change the setting.\n(You can re-set the parameter with CTRL-K dialog box whenever you like.)")) {
                GPD["DotDistributionPattern"] = 0;
            }
        }
        let xorigin = subArray[fromP][1][1] + subArray[fromP][0].width;
        let deltaX = subArray[toP][1][1] + subArray[toP][0].width - xorigin;
        let yorigin =  subArray[fromP][0].height;
        let deltaY =  subArray[toP][0].height - subArray[fromP][0].height;
        let slope = deltaY / deltaX;
        for(let i = fromP + 1; i <= toP; i++) {
            subArray[i][0].height = yorigin + Math.round((subArray[i][1][1] + subArray[i][0].width - xorigin) * slope);
        }
    }
}



G.aView.ccanvas.addEventListener("contextmenu", function(evt) {
    evt.preventDefault();
}, true);

G.aView.ccanvas.addEventListener("mouseup", function (evt) {
    G.mouseDown = false;
    G.textClick = false;
});



G.aView.ccanvas.addEventListener("mousemove", function(evt) {
    if (G.textClick) {    // text area
        if (!G.mouseDown)  return;
    	let ci = _analyseClickedInfo(evt);
	    if (ci[0] == -1)  return;		// upper oob
        if (ci[1]== 1) {					// TSM field
        	let chp = textFinder(ci[0], ci[2]);
        	if (chp == -1)  return   // lower oob
            G.aModel.edge = chp;
            G.aView.draw(false);
        }
    } else {                // Tone note Area
        if (G.mouseDown) {
            if (G.aModel.selPtr != G.NotSelected) {
                G.aModel.tnm.noteArray[G.iap].width = evt.offsetX - GPD["CanvasLeftMargin"] - G.aView._getCoordInfo(G.iap)[1];
            } else if (G.aModel.separatorPtr != G.NotSelected) {
                G.aModel.tnm.separatorArray[G.aModel.separatorPtr].offset = evt.offsetX - GPD["CanvasLeftMargin"];
            }
            G.aView.draw(false);
        }
    } 
});


G.aView.canvas.oncontextmenu = function (evt) {
    G.mouseDown = false;
    G.aModel.selPtr = G.NotSelected;
    G.aView.draw(false);
    return false;
};

G.hotGate.addEventListener("focus", (evt) => {
    G.hotGate.style = G.hotGateStyle;
    G.hotGate.value = "";
});
G.hotGate.addEventListener("focusout", (evt) => {
    G.hotGate.style = G.coldGateStyle;
    G.hotGate.value = "";
});
G.hotGate.addEventListener("input", (evt) => {
    let injectile = G.hotGate.value;
    G.hotGate.value = "";
    G.hotGate.blur();
    for (const ch of Array.from(injectile)) {
        G.aModel.insert(ch);
    }
    G.aView.draw(true);
});
G.projInput.addEventListener("click", evt => {G.projInput.value=null;}, false);
G.projInput.addEventListener("focus", evt => {G.projInput.blur();}, false);
G.projInput.addEventListener("change", loadInternalStructure, false);

window.addEventListener("resize", evt => {
    G.aView.fitScrollCanvas2Window();
});


function clearfield() {
    if (confirm("Erase all data?")) {
        G.aView.clear();
        G.clearButton.blur();
    }
}

function blurThis() {
    G.clearButton.blur();
}

function newCanvasWidth() {
    let newWidth = G.canvasWidth.value;
    G.canvasWidth.blur();
    if (newWidth == 9999) {
        newWidth = window.prompt("Enter canvas width:", "800");
        if ((newWidth == null) || (!newWidth.match(/^[0-9]+$/))) {
            return;
        }
    }
    G.specifiedCanvasWidth = newWidth;  // for Canvas shrinker
    G.textCanvas.width = newWidth;
    G.cursorCanvas.width = newWidth;
    G.scrollCanvas.style = "height: 256px; max-width:" + (Number(newWidth) + 10) + "px;overflow-x: scroll;";
    G.scrollAreaWidth = Number(newWidth);
    G.aView.setCanvas(G.textCanvas, G.cursorCanvas);
    G.aView.draw(false);
}

function saveImage() {
    G.aModel.selPtr = G.NotSelected;
    G.aModel.separatorPtr = G.NotSelected;
    G.aView.draw(false);
    let base64 = G.aView.canvas.toDataURL("image/jpeg");
//    let link = document.createElement("a");
//    link.href = base64;
//    link.download = "canvas.jpeg";
//    link.click();
    G.download.href =  base64;
    G.download.download = "canvas.jpeg";
    G.download.blur();
}

function sendToTheShed() {
    if ((G.aModel.selPtr == G.NotSelected) && (G.aModel.separatorPtr == G.NotSelected))
        return;
    if (G.aModel.selPtr != G.NotSelected) {
        G.aModel.tnm.noteArray[G.aModel.selPtr].visible = false;
        nextAvailableSyllable();
    }
    if (G.aModel.separatorPtr != G.NotSelected) {
        G.aModel.tnm.separatorArray[G.aModel.separatorPtr].visible = false;      // should be permanently deleted
    }
    G.aView.draw(false);
}

function retrieveFromTheShed() {
    G.separator1.checked = false;
    G.separator2.checked = false;
    G.aModel.selPtr = G.NotSelected;
    G.aModel.separatorPtr = G.NotSelected;
    G.aView.draw(false);
}

function separatorClicked() {
    G.separator2.checked = false;
    G.summon.checked = false;
}

function separatorClickedDL() {
    G.separator1.checked = false;
    G.summon.checked = false;
}

function setToneStress(tone, stress) {
    G.aView.ccanvas.focus();
    if (G.aModel.selPtr == G.NotSelected)
        return;
    G.aModel.tnm.noteArray[G.aModel.selPtr].height = -(tone * 125 + 1);
    G.aModel.tnm.noteArray[G.aModel.selPtr].size = stress;
    if (event.shiftKey) {
        G.iap = G.aModel.selPtr;
    } else {
        nextAvailableSyllable();
    }
    G.aView.draw(false);
}

function assignNucleusPattern(pattern) {
    G.aView.ccanvas.focus();
    if (G.aModel.selPtr == G.NotSelected) {   // nasty patch up in case of nothing is selected
        G.aModel.selPtr = G.aModel.tnm.noteArray.length;
    }
    if (G.iap != G.aModel.selPtr) {
        prevAvailableSyllable();
    }
    if (!(G.aModel.tnm.noteArray[G.aModel.selPtr] instanceof ToneNote))
        return;
    G.aModel.tnm.noteArray[G.aModel.selPtr].setPattern(pattern);
    if (event.shiftKey) {
        G.iap = G.aModel.selPtr;
    } else {
        nextAvailableSyllable();
    }
    G.aView.draw(false);
    document.activeElement.blur();
}

function fall() {
    assignNucleusPattern(1);
}

function riseFall() {
    assignNucleusPattern(3);
}

function rise() {
    assignNucleusPattern(4);
}

function fallRise() {
    assignNucleusPattern(6);
}

function midLevel() {
    assignNucleusPattern(7);
}

function notNucleus() {
    assignNucleusPattern(0);
}

function nextAvailableSyllable() {
    if ((G.aModel.selPtr == G.NotSelected) || (G.aModel.selPtr == G.aModel.tnm.noteArray.length-1)) {
        G.aModel.selPtr = G.NotSelected;
        return;
    }
    G.aModel.selPtr += 1;
    while (G.aModel.selPtr < G.aModel.tnm.noteArray.length) {
        let element = G.aModel.tnm.noteArray[G.aModel.selPtr];
        if ((element.visible == true) && (element instanceof ToneNote))
            return;
        G.aModel.selPtr += 1;
    }
    G.aModel.selPtr = G.NotSelected;
}

function prevAvailableSyllable() {
    if (G.aModel.selPtr == G.NotSelected)
        G.aModel.selPtr = G.aModel.tnm.noteArray.length;
    G.aModel.selPtr -= 1;
    while (G.aModel.selPtr >= 0) {
        let element = G.aModel.tnm.noteArray[G.aModel.selPtr];
        if ((element.visible == true) && (element instanceof ToneNote))
            return;
        G.aModel.selPtr -= 1;
    }
    G.aModel.selPtr = G.NotSelected;
}

function centrelineControl() {
    G.centrelineCheckBox.blur();
    if (G.centrelineCheckBox.checked) {
        GP["CentrelineSwitch"] = "1";
        GPD["CentrelineSwitch"] = 1;
    } else {
        GP["CentrelineSwitch"] = "0";
        GPD["CentrelineSwitch"] = 0;
    }
    G.aView.draw(false);
}

function graphicsControl() {
    G.graphicsCheckBox.blur();
    if (G.graphicsCheckBox.checked) {
        GP["DotsSwitch"] = "1";
        GPD["DotsSwitch"] = 1;
        G.centrelineCheckBox.disabled = false;
    } else {
        GP["DotsSwitch"] = "0";
        GPD["DotsSwitch"] = 0;
        G.centrelineCheckBox.disabled = true;
    }
    G.aView.draw(false);
}

function _serialiseConfiguration() {
    let regexp = new RegExp(/^\-?[0-9]+\.?[0-9]*$/);
    let result = "";
    for (let key in GP) {
        if (regexp.test(GP[key])) {
            result += key + "=" + GP[key] + ",";
        }
    }
    result += "FontName=" + GP["FontName"];
    return result;
}

function getClass(classname){return Function('return (' + classname + ')')();}

function _serialiseTSMarray() {
    let result = "";
    for (let i = 0; i < G.aModel.tsm.tsmArray.length; i++) {
        let item = G.aModel.tsm.tsmArray[i];
        result += item[0] + ":" + item[1].getClassName() + ",";
    }
    return result.slice(0, -1);
}

function _serialiseNoteArray() {
/*
ToneNote: width, height, size, pattern, magX, magY, finalY, visible
Separator: width, visible
*/
    let result = "";
    for (let i = 0; i < G.aModel.tnm.noteArray.length; i++) {
        let item = G.aModel.tnm.noteArray[i];
        let cn = item.getClassName();
       result += `${cn}|${item.width}|${item.height}|${item.size}|${item.pattern}|${item.magX}|${item.magY}|${item.finalY}|${item.visible},`;
    }
    return result.slice(0, -1);
}

function _serialiseSeparatorArray() {
    let result = "";
    for (let i = 0; i < G.aModel.tnm.separatorArray.length; i++) {
        let item = G.aModel.tnm.separatorArray[i];
        let cn = item.getClassName();
        result += `${cn}|${item.lineNo}|${item.offset}|${item.visible},`;
    }
    return result.slice(0, -1);
}

function saveInternalStructure() {
    let contents = "[VERSION]4.01\n";
    contents += "[CONFIG]" + _serialiseConfiguration() + "\n";
    contents += "[TEXT]" + G.aModel.textdata.replaceAll("\n", "\\n") + "\n";
    contents += "[TSM]" + _serialiseTSMarray() + "\n";
    contents += "[UNDERLINE]" + Array.from(G.aModel.underline).join("|") + "\n";
    contents += "[ALTARRAY]" + G.aModel.tnm.altArray.join("|") + "\n";
    contents += "[NOTEARRAY]" + _serialiseNoteArray() + "\n";
    contents += "[SEPARATORARRAY]" + _serialiseSeparatorArray() + "\n";

    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([ bom, contents ], { "type" : "text/plain" });
//    let link = document.createElement("a");
//    link.href = URL.createObjectURL(blob);
//    link.download = "Project.ti4";
//    link.click();
    G.download2.href = URL.createObjectURL(blob);
    G.download2.download = "Project.ti4";
    G.download2.blur();
}

function _setConfig(data) {
    let tbl = data.split(/,/);
    for (const elem of tbl) {
        let kv = elem.split(/=/);
        GP[kv[0]] = kv[1];
        if (kv[0] == "FontName") {
            GPD[kv[0]] = kv[1];
        } else {
            GPD[kv[0]] = Number(kv[1]);
        }
    }
    if (GPD["DotsSwitch"] == 1) {
        G.graphicsCheckBox.checked = true;
        G.centrelineCheckBox.disabled = false;
    } else {
        G.graphicsCheckBox.checked = false;
        G.centrelineCheckBox.disabled = true;
    }
    if (GPD["CentrelineSwitch"] == 1) {
        G.centrelineCheckBox.checked = true;
    } else {
        G.centrelineCheckBox.checked = false;
    }
}

function _setTSM(data) {
    G.aModel.tsm.tsmArray = [];
    if (data == "") return;
    let tbl = data.split(/,/);
    let margin = G.aModel.tsm.margin;
    let vmargin = G.aModel.tsm.vmargin;
    for (const elem of tbl) {
        let kv = elem.split(/:/);
        let class2 = getClass(kv[1]);
        G.aModel.tsm.tsmArray.push([Number(kv[0]), new class2(margin, vmargin)]);
    }
}

function _setNoteArray(data) {
    if (data == "") {
        G.aModel.tnm.noteArray = [];
        return;
    }
    let tbl = data.split(/,/);
    let noteArray = [];
    for (const elem of tbl) {
        let p = elem.split(/\|/);
        let obj = new ToneNote(Number(p[1]), Number(p[2]), p[3], 0);
        obj.pattern = Number(p[4]);
        obj.magX = Number(p[5]);
        obj.magY = Number(p[6]);
        obj.finalY = Number(p[7]);
        obj.visible = (p[8] == "true") ? true : false;
        noteArray.push(obj);
    }
    G.aModel.tnm.noteArray = noteArray;
}

function _parseInternalStructure(data) {
    let errorFlag = false;
    if (m = data.match(/^\[VERSION\]([^\n]*)\n/)) {
        console.log("Loading project file ver. " + m[1]);
    } else {
        errorFlag = true;
        return;
    }
    if (m = data.match(/\[CONFIG\]([^\n]*)\n/)) {
        _setConfig(m[1]);
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[TEXT\]([^\n]*)\n/)) {
        G.aModel.textdata = m[1].replaceAll("\\n", "\n");
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[TSM\]([^\n]*)\n/)) {
        _setTSM(m[1]);
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[UNDERLINE\]([^\n]*)\n/)) {
        if (m[1] != "") {
            G.aModel.underline = new Set(m[1].split(/\|/).map(function(e) { return Number(e);}));
        } else {
            G.aModel.underline = new Set();
        }
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[ALTARRAY\]([^\n]*)\n/)) {
        G.aModel.tnm.altArray = m[1].split(/\|/).map(function(e) { return Number(e);});
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[NOTEARRAY\]([^\n]*)\n/)) {
        _setNoteArray(m[1]);
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[SEPARATORARRAY\]([^\n]*)\n/)) {
        if (m[1] != "") {
            G.aModel.tnm.separatorArray = [];
            for (const entry of m[1].split(/,/)) {
                let info = entry.split(/\|/);
                let classData = getClass(info[0]);
                G.aModel.tnm.separatorArray.push(new classData(Number(info[1]), Number(info[2]), (info[3] == "true") ? true: false));
            }
        } else {
            G.aModel.tnm.separatorArray = [];
        }
    } else {
        errorFlag = true;
    }
    G.aModel.ptr = 0;
    G.aModel.edge = 0;
    G.iap = 0;
    G.aModel.selPtr = G.NotSelected;
    G.aModel.separatorPtr = G.NotSelected;
    G.aView.draw(false);    
}

function _parseParameterFile(content) {
    let lines = content.split(/\n/);
    for (let line of lines) {
        if ((line == "") || (line.match(/^ *\#/))) {
            continue;
        }
        _checkAndModify(1, line);      // _checkAndModify is defined in ParameterManager4.js
    }
}

function loadInternalStructure(evt) {
    let input = evt.target;
    if (input.files.length == 0) {
        console.log('No file selected');
        return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        if (file.name.match(/\.ti4$/i)) {
            _parseInternalStructure(reader.result);
        } else if (file.name.match(/\.cfg$/i)) {
            _parseParameterFile(reader.result);
        } else {
            alert("File: '" + file.name + "' not supported.");
        }
    };
    reader.readAsText(file);
}
