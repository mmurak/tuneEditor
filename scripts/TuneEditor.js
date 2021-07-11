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

let mouseDown = false;
let iap = 0;
const NotSelected = -1;
let selPtr = NotSelected;
let textClick = false;
cMgr.ccanvas.addEventListener("mousedown", function(evt) {
  mouseDown = true;
  let coordX = evt.clientX - cMgr.rect.left - 30;
  let coordY = evt.clientY - cMgr.rect.top;
//console.log(coordY);
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
    let coordX = evt.clientX - cMgr.rect.left - 30;
    let coordY = evt.clientY - cMgr.rect.top;
    let chp = 0;
    while((chp < cMgr.textdata.length) && (cMgr.ctx.measureText(cMgr.textdata.substr(0, chp+1)).width < coordX)) {
      chp += 1;
    }
    cMgr.edge = chp;
    cMgr.draw();
  } else {
    if (!mouseDown || selPtr == NotSelected) 
      return;
    let coordX = evt.clientX - cMgr.rect.left;
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

// CONFIGURATOR SECTION
//   default baseline=150&s=4&m=6&l=8&magfactor=1.0
//     if baseline >= 170  s=6&m=9&l=13&magfactor=1.5
let parmwork = getParm("baseline");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    cMgr.LowerLimit = Number(parmwork);
  }
}
parmwork = getParm("s");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    weakSize = Number(parmwork);
  }
}
parmwork = getParm("m");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    midSize = Number(parmwork);
  }
}
parmwork = getParm("l");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    stressedSize = Number(parmwork);
  }
}
parmwork = getParm("magfactor");
if (parmwork != "") {
  if (isNumber(parmwork)) {
    magFactor = Number(parmwork);
  }
}
cMgr.draw();