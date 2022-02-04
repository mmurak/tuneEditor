/* Main REP loop */
document.addEventListener("keydown", function (evt) {
  let keyname = evt.key;
//  console.log("KEYNAME:", keyname, evt.shiftKey);
  dispatcher.dispatch(evt);
});

window.addEventListener("blur", function (evt) {
  cMgr._hideBlinkingCursor();
});

window.addEventListener("focus", function (evt) {
  cMgr.draw();
});

window.addEventListener("popstate", function (evt) {
  if (!evt.originalEvent.state) {
    history.pushState(null, null, null);
    return;
  }
});

let mouseDown = false;
let iap = 0;
const NotSelected = -1;
let selPtr = NotSelected;
let textClick = false;
cMgr.ccanvas.addEventListener("mousedown", function(evt) {
  mouseDown = true;
  let xFixed = (cMgr.rect.left >= 0) ? cMgr.rect.left : 0;
  let coordX = evt.pageX - xFixed - 30;
  let coordY = evt.pageY - cMgr.rect.top;
  if (coordY < cMgr.UpperLimit) {   // text area
    textClick = true;
    let chp = 0;
    while((chp < cMgr.textdata.length) && (cMgr.ctx.measureText(cMgr.textdata.substr(0, chp+1)).width < coordX)) {
      chp += 1;
    }
    if (evt.shiftKey) {
      cMgr.edge = chp;
    } else {
      cMgr.ptr = cMgr.edge = chp;
    }
    cMgr.draw();
  } else if (document.getElementById("separator1").checked) {   // put a separator 
    document.getElementById("separator1").checked = false;
    cMgr.tnm.noteArray.push(new Separator(coordX));
    selPtr = NotSelected;
  } else {    // tone process
    if (cMgr.tnm.noteArray.length == 0)
      return;
    let delta = 99999;
    iap = 0;
    if (document.getElementById("summon").checked == false) {
      for (let i = 0; i < cMgr.tnm.noteArray.length; i++) {
        if (cMgr.tnm.noteArray[i].visible == false)
          continue;
        tempDelta = Math.abs(cMgr.tnm.noteArray[i].width - coordX);
        if (tempDelta < delta) {
          iap = i;
          delta = tempDelta;
        }
      }
      if (selPtr == iap) {
        selPtr = NotSelected;
      } else {
        selPtr = iap;
      }
    } else {    // summon process
      for (i = 0; i < cMgr.tnm.noteArray.length; i++) {
        if (cMgr.tnm.noteArray[i].visible)
          continue;
        tempDelta = Math.abs(cMgr.tnm.noteArray[i].width - coordX);
        if (tempDelta < delta) {
          iap = i;
          delta = tempDelta;
        }
      }
      cMgr.tnm.noteArray[iap].visible = true;
      selPtr = NotSelected;
    }
  }
  document.getElementById("summon").checked = false;
  cMgr.draw();
});

cMgr.ccanvas.addEventListener("mouseup", function (evt) {
  mouseDown = false;
  textClick = false;
});

cMgr.ccanvas.addEventListener("mousemove", function (evt) {
  if (textClick) {    // text area
    if (!mouseDown)
      return;
    let xFixed = (cMgr.rect.left >= 0) ? cMgr.rect.left : 0;
    let coordX = evt.pageX - xFixed - 30;
    let coordY = evt.pageY - cMgr.rect.top;
    let chp = 0;
    while((chp < cMgr.textdata.length) && (cMgr.ctx.measureText(cMgr.textdata.substr(0, chp+1)).width < coordX)) {
      chp += 1;
    }
    cMgr.edge = chp;
    cMgr.draw();
  } else {
    if (!mouseDown || selPtr == NotSelected) 
      return;
    let xFixed = (cMgr.rect.left >= 0) ? cMgr.rect.left : 0;
    let coordX = evt.pageX - xFixed;
    cMgr.tnm.noteArray[selPtr].width = coordX - 30;
    cMgr.draw();
  }
});

cMgr.canvas.oncontextmenu = function (evt) {
  mouseDown = false;
  selPtr = NotSelected;
  cMgr.draw();
  return false;
};


function clearfield() {
  cMgr.clear();
  document.getElementById("clearButton").blur();
}

function blurThis() {
  document.getElementById("clearButton").blur();
}

const ColourNormal = "rgb(0, 0, 0)";
const ColourBackground = "rgb(255, 255, 255)";
const ColourSelected = "rgb(255, 0, 0)";
const ColourSummoned = "rgb(128, 128, 255)";
const lineWidth = 2;

function newCanvasWidth() {
  let dropBox = document.getElementById("canvaswidth");
  let newWidth = dropBox.value;
  dropBox.blur();
  if (newWidth == 9999) {
    newWidth = window.prompt("Enter canvas width:", "800");
    if ((newWidth == null) || (!newWidth.match(/^[0-9]+$/))) {
      return;
    }
  }
  SpecifiedCanvasWidth = newWidth;  // for Canvas shrinker
  let canvas = document.getElementById("canvas");
  canvas.width = newWidth;
  let ccanvas = document.getElementById("cursor");
  ccanvas.width = newWidth;
  cMgr.setCanvas(canvas, ccanvas);
  cMgr.draw();
}

function saveImage() {
  selPtr = NotSelected;
  cMgr.draw();
  let base64 = cMgr.canvas.toDataURL("image/jpeg");
  document.getElementById("download").href = base64;
}

function saveHalfImage() {
  selPtr = NotSelected;
  cMgr.draw();
  let half = document.getElementById("canvas2");
  half.width = cMgr.canvas.width;
  half.height = 53
  let image = cMgr.ctx.getImageData(0, 35, cMgr.canvas.width, 53);
  half.getContext("2d").putImageData(image, 0, 0);
  let base64 = canvas2.toDataURL("image/jpeg");
  document.getElementById("download2").href = base64;
}

function sendToTheShed() {
  if (selPtr == NotSelected)
    return;
  cMgr.tnm.noteArray[selPtr].visible = false;
  nextAvailableSyllable();
  cMgr.draw();
}

function retrieveFromTheShed() {
  document.getElementById("separator1").checked = false;
  selPtr = NotSelected;
  cMgr.draw();
}

function separatorClicked() {
  document.getElementById("summon").checked = false;
}

let weakSize = 4;
let midSize = 6;
let stressedSize = 8;
function setToneStress(tone, stress) {
  cMgr.ccanvas.focus();
  if (selPtr == NotSelected)
    return;
  cMgr.tnm.noteArray[selPtr].height = cMgr.getHeight4Note(stress, tone);
  cMgr.tnm.noteArray[selPtr].size = stress;
  if (event.shiftKey) {
    iap = selPtr;
  } else {
    nextAvailableSyllable();
  }
  cMgr.draw();
}

function assignNucleusPattern(pattern) {
  cMgr.ccanvas.focus();
  if (selPtr == NotSelected) {   // nasty patch up in case of nothing is selected
    selPtr = cMgr.tnm.noteArray.length;
  }
  if (iap != selPtr) {
    prevAvailableSyllable();
  }
  if (!(cMgr.tnm.noteArray[selPtr] instanceof ToneNote))
    return;
  cMgr.tnm.noteArray[selPtr].setPattern(pattern);
  if (event.shiftKey) {
    iap = selPtr;
  } else {
    nextAvailableSyllable();
  }
  cMgr.draw();
}

function fall() {
  assignNucleusPattern(1);
  cMgr.draw();
}

function riseFall() {
  assignNucleusPattern(3);
  cMgr.draw();
}

function rise() {
  assignNucleusPattern(4);
  cMgr.draw();
}

function fallRise() {
  assignNucleusPattern(6);
  cMgr.draw();
}

function midLevel() {
  assignNucleusPattern(7);
  cMgr.draw();
}

function notNucleus() {
  assignNucleusPattern(0);
  cMgr.draw();
}

function nextAvailableSyllable() {
  if ((selPtr == NotSelected) || (selPtr == cMgr.tnm.noteArray.length-1)) {
    selPtr = NotSelected;
    return;
  }
  selPtr += 1;
  while (selPtr < cMgr.tnm.noteArray.length) {
    let element = cMgr.tnm.noteArray[selPtr];
    if ((element.visible == true) && (element instanceof ToneNote))
      return;
    selPtr += 1;
  }
  selPtr = NotSelected;
}

function prevAvailableSyllable() {
  if (selPtr == NotSelected)
    selPtr = cMgr.tnm.noteArray.length;
  selPtr -= 1;
  while (selPtr >= 0) {
    let element = cMgr.tnm.noteArray[selPtr];
    if ((element.visible == true) && (element instanceof ToneNote))
      return;
    selPtr -= 1;
  }
  selPtr = NotSelected;
}

function centrelineControl() {
  document.getElementById("centrelineCB").blur();
  cMgr.draw();
}


let ParmList = null;

function getParm(key) {
  if (ParmList == null) {
    ParmList = [];
    var arg = location.search.substring(1);
    if (arg != "") {
      let args = arg.split("&");
      for(let i = 0; i < args.length; i++) {
        parmPair = args[i].split("=");
        ParmList[parmPair[0]] = parmPair[1];
      }
    }
  }
  if (key in ParmList) {
    return ParmList[key];
  } else {
    return "";
  }
}

function _serialiseConfiguration() {
  return 'baseline:' + cMgr.LowerLimit + "," +
            'small:' + weakSize + "," +
            'mid:' + midSize + "," +
            'large:' + stressedSize + "," +
            'magfactor:' + magFactor + "," +
            'font:' + cMgr.FontGlyph + "," +
            'fontsize:' + cMgr.FontSize + "," +
            'dotdistribution:' + cMgr.DotDistribution + "," +
            'midline:' + ((document.getElementById("centrelineCB").checked == true) ? 'y' : 'n');
}

function getClass(classname){return Function('return (' + classname + ')')();}
// new getClass("class name")

function _serialiseTSMarray() {
  let result = "";
  for (let i = 0; i < cMgr.tsm.tsmArray.length; i++) {
    let item = cMgr.tsm.tsmArray[i];
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
  for (let i = 0; i < cMgr.tnm.noteArray.length; i++) {
    let item = cMgr.tnm.noteArray[i];
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
  contents += "[CANVAS]" + cMgr.canvas.width + "\n";
  contents += "[TEXT]" + cMgr.textdata + "\n";
  contents += "[TSM]" + _serialiseTSMarray() + "\n";
  contents += "[UNDERLINE]" + Array.from(cMgr.underline).join("|") + "\n";
  contents += "[ALTARRAY]" + cMgr.tnm.altArray.join("|") + "\n";
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
      cMgr.LowerLimit = Number(kv[1]);
    } else if (kv[0] == "small") {
      weakSize = Number(kv[1]);
    } else if (kv[0] == "mid") {
      midSize = Number(kv[1]);
    } else if (kv[0] == "large") {
      stressedSize = Number(kv[1]);
    } else if (kv[0] == "magfactor") {
      magFactor = Number(kv[1]);
    } else if (kv[0] == "font") {
      cMgr.FontGlyph = kv[1];
      cMgr.setCanvas(cMgr.canvas, cMgr.ccanvas);
    } else if (kv[0] == "fontsize") {
      cMgr.FontSize = Number(kv[1]);
      cMgr.setCanvas(cMgr.canvas, cMgr.ccanvas);
    } else if (kv[0] == "dotdistribution") {
      cMgr.DotDistribution = Number(kv[1]);
    } else if (kv[0] == "midline") {
      let cb = document.getElementById("centrelineCB");
      if (kv[1] == "y") 
        cb.checked = true;
      else
        cb.checked = false;
    }
  }
}

function _setTSM(data) {
  cMgr.tsm.tsmArray = [];
  if (data == "") return;
  let tbl = data.split(/,/);
  let margin = cMgr.tsm.margin;
  let vmargin = cMgr.tsm.vmargin;
  for (const elem of tbl) {
    let kv = elem.split(/:/);
    let class2 = getClass(kv[1]);
    cMgr.tsm.tsmArray.push([Number(kv[0]), new class2(margin, vmargin)]);
  }
}

function _setNoteArray(data) {
  if (data == "") {
    cMgr.tnm.noteArray = [];
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
  cMgr.tnm.noteArray = noteArray;
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
    let canvas = document.getElementById("canvas");
    canvas.width = Number(m[1]);
    let ccanvas = document.getElementById("cursor");
    ccanvas.width = Number(m[1]);
    cMgr.setCanvas(canvas, ccanvas);
  } else {
    errorFlag = true;
  }
  if (m = data.match(/\[TEXT\]([^\n]*)\n/)) {
    cMgr.textdata = m[1];
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
      cMgr.underline = new Set(m[1].split(/\|/).map(function(e) { return Number(e);}));
    } else {
      cMgr.underline = new Set();
    }
  } else {
    errorFlag = true;
  }
  if (m = data.match(/\[ALTARRAY\]([^\n]*)\n/)) {
    cMgr.tnm.altArray = m[1].split(/\|/);
  } else {
    errorFlag = true;
  }
  if (m = data.match(/\[NOTEARRAY\]([^\n]*)\n/)) {
    _setNoteArray(m[1]);
  } else {
    errorFlag = true;
  }
  cMgr.ptr = 0;
  cMgr.edge = 0;
  iap = 0;
  selPtr = NotSelected;
  cMgr.draw();
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



// CONFIGURATOR SECTION
//   default baseline=150&s=4&m=6&l=8&magfactor=1.0
//     if baseline >= 170  s=6&m=9&l=13&magfactor=1.5
let parmwork = getParm("baseline");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    cMgr.LowerLimit = Number(parmwork);
//    console.log("baseline: '" + parmwork + "'");
  }
}
parmwork = getParm("s");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    weakSize = Number(parmwork);
//    console.log("s(small dot): '" + parmwork + "'");
  }
}
parmwork = getParm("m");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    midSize = Number(parmwork);
//    console.log("m(medium dot): '" + parmwork + "'");
  }
}
parmwork = getParm("l");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    stressedSize = Number(parmwork);
//    console.log("l(large dot): '" + parmwork + "'");
  }
}
parmwork = getParm("magfactor");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    magFactor = Number(parmwork);
//    console.log("magfactor: '" + parmwork + "'");
  }
}
parmwork = getParm("font");
if (parmwork != "") {
  cMgr.FontGlyph = decodeURI(parmwork);
  cMgr.setCanvas(cMgr.canvas, cMgr.ccanvas);
//  console.log("font: '" + cMgr.FontGlyph + "'");
}
parmwork = getParm("fontsize");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    cMgr.FontSize = Number(parmwork);
    cMgr.setCanvas(cMgr.canvas, cMgr.ccanvas);
//    console.log("fontsize: '" + cMgr.FontSize + "'");
  }
}
parmwork = getParm("dotdistribution");
if (parmwork != "") {
  cMgr.DotDistribution = Number(parmwork);
//  console.log("dotdistribution: '" + parmwork + "'");
}
parmwork = getParm("midline");
if ((parmwork == "y") || (parmwork == "Y")) {
  document.getElementById("centrelineCB").checked = true;
//  console.log("midline: '" + parmwork + "'");
}

const coldColor = "rgb(224, 255, 255);"
const hotColor = "rgb(255, 192, 203);"
const coldGateStyle = "background-color:" + coldColor + "caret-color:" + coldColor + "font-size:200%;font-color:rgb(255,0,0);text-align:center;";
const hotGateStyle = "background-color:" + hotColor + "caret-color:" + hotColor + "font-size:200%;font-color:rgb(255,0,0);text-align:center;";

let Restraint = "off";
parmwork = getParm("restraint");
if (parmwork == "on") {
  Restraint = "on";
} else {
  let hiddenArea = document.getElementById("hiddenArea");
  // Hot-gate
  let hotGate = document.createElement("textarea");
  hotGate.cols = 16;
  hotGate.rows = 1;
  hotGate.style = coldGateStyle;
  hotGate.addEventListener("focus", (evt) => {
    hotGate.style = hotGateStyle;
    hotGate.value = "";
  });
  hotGate.addEventListener("focusout", (evt) => {
    hotGate.style = coldGateStyle;
    hotGate.value = "";
  });
  hotGate.addEventListener("input", (evt) => {
    let injectile = hotGate.value;
    hotGate.value = "";
    hotGate.blur();
      for (const ch of Array.from(injectile)) {
        cMgr.insert(ch);
      }
      cMgr.draw();
  });
  hiddenArea.appendChild(hotGate);
  hiddenArea.appendChild(document.createElement("hr"));
  // File input
  let pButton = document.createElement("input");
  pButton.type = "file";
  pButton.id = "projInput";
  pButton.accept = ".tir";
  pButton.addEventListener("click", evt => {pButton.value=null;}, false);
  pButton.addEventListener("focus", evt => {pButton.blur();}, false);
  pButton.addEventListener("change", loadInternalStructure, false);
  hiddenArea.appendChild(pButton);
//  console.log("Restraint: '" + parmwork + "'");
}

cMgr.draw();
