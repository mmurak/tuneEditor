function clearfield() {
    aView.clear();
    G.clearButton.blur();
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
    aView.setCanvas(G.textCanvas, G.cursorCanvas);
    aView.draw(false);
}

function saveImage() {
    aModel.selPtr = G.NotSelected;
    aView.draw(false);
    let base64 = aView.canvas.toDataURL("image/jpeg");
    G.download.href = base64;
}

function saveHalfImage() {
    aModel.selPtr = G.NotSelected;
    aView.draw(false);
    G.hiddenCanvas.width = aView.canvas.width;
    G.hiddenCanvas.height = 75
    let image = aView.ctx.getImageData(0, 15, aView.canvas.width, 75);
    G.hiddenCanvas.getContext("2d").putImageData(image, 0, 0);
    let base64 = G.hiddenCanvas.toDataURL("image/jpeg");
    G.download2.href = base64;
}

function sendToTheShed() {
    if (aModel.selPtr == G.NotSelected)
        return;
    aView.model.tnm.noteArray[aModel.selPtr].visible = false;
    nextAvailableSyllable();
    aView.draw(false);
}

function retrieveFromTheShed() {
    G.separator1.checked = false;
    G.separator2.checked = false;
    aModel.selPtr = G.NotSelected;
    aView.draw(false);
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
    aView.ccanvas.focus();
    if (aModel.selPtr == G.NotSelected)
        return;
    aView.model.tnm.noteArray[aModel.selPtr].height = aView.getHeight4Note(stress, tone);
    aView.model.tnm.noteArray[aModel.selPtr].size = stress;
    if (event.shiftKey) {
        G.iap = aModel.selPtr;
    } else {
        nextAvailableSyllable();
    }
    aView.draw(false);
}

function assignNucleusPattern(pattern) {
    aView.ccanvas.focus();
    if (aModel.selPtr == G.NotSelected) {   // nasty patch up in case of nothing is selected
        aModel.selPtr = aView.model.tnm.noteArray.length;
    }
    if (G.iap != aModel.selPtr) {
        prevAvailableSyllable();
    }
    if (!(aView.model.tnm.noteArray[aModel.selPtr] instanceof ToneNote))
        return;
    aView.model.tnm.noteArray[aModel.selPtr].setPattern(pattern);
    if (event.shiftKey) {
        G.iap = aModel.selPtr;
    } else {
        nextAvailableSyllable();
    }
    aView.draw(false);
}

function fall() {
    assignNucleusPattern(1);
    aView.draw(false);
}

function riseFall() {
    assignNucleusPattern(3);
    aView.draw(false);
}

function rise() {
    assignNucleusPattern(4);
    aView.draw(false);
}

function fallRise() {
    assignNucleusPattern(6);
    aView.draw(false);
}

function midLevel() {
    assignNucleusPattern(7);
    aView.draw(false);
}

function notNucleus() {
    assignNucleusPattern(0);
    aView.draw(false);
}

function nextAvailableSyllable() {
    if ((aModel.selPtr == G.NotSelected) || (aModel.selPtr == aView.model.tnm.noteArray.length-1)) {
        aModel.selPtr = G.NotSelected;
        return;
    }
    aModel.selPtr += 1;
    while (aModel.selPtr < aView.model.tnm.noteArray.length) {
        let element = aView.model.tnm.noteArray[aModel.selPtr];
        if ((element.visible == true) && (element instanceof ToneNote))
            return;
        aModel.selPtr += 1;
    }
    aModel.selPtr = G.NotSelected;
}

function prevAvailableSyllable() {
    if (aModel.selPtr == G.NotSelected)
        aModel.selPtr = aView.model.tnm.noteArray.length;
    aModel.selPtr -= 1;
    while (aModel.selPtr >= 0) {
        let element = aView.model.tnm.noteArray[aModel.selPtr];
        if ((element.visible == true) && (element instanceof ToneNote))
            return;
        aModel.selPtr -= 1;
    }
    aModel.selPtr = G.NotSelected;
}

function centrelineControl() {
    G.centrelineCheckBox.blur();
    aView.draw(false);
}

function _serialiseConfiguration() {
    return 'baseline:' + aView.LowerLimit + "," +
            'small:' + G.weakSize + "," +
            'mid:' + G.midSize + "," +
            'large:' + G.stressedSize + "," +
            'magfactor:' + magFactor + "," +
            'font:' + aView.FontGlyph + "," +
            'fontsize:' + aView.FontSize + "," +
            'dotdistribution:' + aView.DotDistribution + "," +
            'midline:' + ((G.centrelineCheckBox.checked == true) ? 'y' : 'n');
}

function getClass(classname){return Function('return (' + classname + ')')();}
// new getClass("class name")

function _serialiseTSMarray() {
    let result = "";
    for (let i = 0; i < aView.model.tsm.tsmArray.length; i++) {
        let item = aView.model.tsm.tsmArray[i];
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
    for (let i = 0; i < aView.model.tnm.noteArray.length; i++) {
        let item = aView.model.tnm.noteArray[i];
        let cn = item.getClassName();
        if (cn == "ToneNote") {
            result += `${cn}|${item.width}|${item.height}|${item.size}|${item.pattern}|${item.magX}|${item.magY}|${item.finalY}|${item.visible},`;
        } else {  // must be one of the Separators
            result += `${cn}|${item.width}|${item.visible},`;
        }
    }
    return result.slice(0, -1);
}

function saveInternalStructure() {
    let contents = "[VERSION]1.02\n";
    contents += "[CONFIG]" + _serialiseConfiguration() + "\n";
    contents += "[CANVAS]" + aView.canvas.width + "\n";
    contents += "[TEXT]" + aView.model.textdata + "\n";
    contents += "[TSM]" + _serialiseTSMarray() + "\n";
    contents += "[UNDERLINE]" + Array.from(aView.model.underline).join("|") + "\n";
    contents += "[ALTARRAY]" + aView.model.tnm.altArray.join("|") + "\n";
    contents += "[NOTEARRAY]" + _serialiseNoteArray() + "\n";

    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([ bom, contents ], { "type" : "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Project.tir";
    link.click();
}

function _setConfig(data) {
    let tbl = data.split(/,/);
    for (const elem of tbl) {
        let kv = elem.split(/:/);
        if (kv[0] == "baseline") {
            aView.LowerLimit = Number(kv[1]);
        } else if (kv[0] == "small") {
            G.weakSize = Number(kv[1]);
        } else if (kv[0] == "mid") {
            G.midSize = Number(kv[1]);
        } else if (kv[0] == "large") {
            G.stressedSize = Number(kv[1]);
        } else if (kv[0] == "magfactor") {
            magFactor = Number(kv[1]);
        } else if (kv[0] == "font") {
            aView.FontGlyph = kv[1];
            aView.setCanvas(aView.canvas, aView.ccanvas);
        } else if (kv[0] == "fontsize") {
            aView.FontSize = Number(kv[1]);
            aView.setCanvas(aView.canvas, aView.ccanvas);
        } else if (kv[0] == "dotdistribution") {
            aView.DotDistribution = Number(kv[1]);
        } else if (kv[0] == "midline") {
            if (kv[1] == "y") 
              G.centrelineCheckBox.checked = true;
            else
                G.centrelineCheckBox.checked = false;
        }
    }
}

function _setTSM(data) {
    aView.model.tsm.tsmArray = [];
    if (data == "") return;
    let tbl = data.split(/,/);
    let margin = aView.model.tsm.margin;
    let vmargin = aView.model.tsm.vmargin;
    for (const elem of tbl) {
        let kv = elem.split(/:/);
        let class2 = getClass(kv[1]);
        aView.model.tsm.tsmArray.push([Number(kv[0]), new class2(margin, vmargin)]);
    }
}

function _setNoteArray(data) {
    if (data == "") {
        aView.model.tnm.noteArray = [];
        return;
    }
    let tbl = data.split(/,/);
    let noteArray = [];
    for (const elem of tbl) {
        let p = elem.split(/\|/);
        let class2 = getClass(p[0]);
        if (p[0] == "ToneNote") {
            let obj = new class2(Number(p[1]), Number(p[2]), Number(p[3]), 0);
            obj.pattern = Number(p[4]);
            obj.magX = Number(p[5]);
            obj.magY = Number(p[6]);
            obj.finalY = Number(p[7]);
            obj.visible = (p[8] == "true") ? true : false;
            noteArray.push(obj);
        } else {    // It must be Separator
            let obj = new class2(Number(p[1]), (p[8] == "true") ? true : false);
            noteArray.push(obj);
        }
    }
    aView.model.tnm.noteArray = noteArray;
}

function _parseInternalStructure(data) {
    let errorFlag = false;
    if (m = data.match(/^\[VERSION\]([^\n]*)\n/)) {
        console.log(m[1]);
    } else {
        errorFlag = true;
        return;
    }
    if (m = data.match(/\[CONFIG\]([^\n]*)\n/)) {
        _setConfig(m[1]);
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[CANVAS\]([^\n]*)\n/)) {
        document.getElementById("canvaswidth").options[0].selected = true;
        G.textCanvas.width = Number(m[1]);
        G.cursorCanvas.width = Number(m[1]);
        aView.setCanvas(G.textCanvas, G.cursorCanvas);
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[TEXT\]([^\n]*)\n/)) {
        aView.model.textdata = m[1];
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
            aView.model.underline = new Set(m[1].split(/\|/).map(function(e) { return Number(e);}));
        } else {
            aView.model.underline = new Set();
        }
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[ALTARRAY\]([^\n]*)\n/)) {
        aView.model.tnm.altArray = m[1].split(/\|/);
    } else {
        errorFlag = true;
    }
    if (m = data.match(/\[NOTEARRAY\]([^\n]*)\n/)) {
        _setNoteArray(m[1]);
    } else {
        errorFlag = true;
    }
    aView.model.ptr = 0;
    aView.model.edge = 0;
    G.iap = 0;
    aModel.selPtr = G.NotSelected;
    aView.draw(false);
}

function loadInternalStructure(evt) {
    console.log("LoadInternalStructure called");
    let input = evt.target;
    if (input.files.length == 0) {
        console.log('No file selected');
        return;
    }
    const file = input.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
        _parseInternalStructure(reader.result);
    };
    reader.readAsText(file);
}
