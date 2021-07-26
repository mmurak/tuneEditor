class CanvasManager {
  /* Constructor
   *   canvas: canvas for text string
   *   ccanvas: canvas for cursor
   *   offset: left margin (in px)
   * ----------
   *   width: canvas width
   *   height: canvas height
   *   ctx: canvas context for text string
   *   cctx: canvas context for cursor
   *   rect: bounding rect for ccanvas
   *   ptr: cursor position (insersion pointer)
   *   edge: region edge pointer
   *   intervalId: timer object
   *   innerClipboard: inner clipboard buffer
   *   underline: Underline set
   *   tsm: Tone Stress Mark Manager object
   *   tnm: Tone Note Manager object
   *   maxLevel: Max-levels for Tone Note
   */
  constructor(canvas, ccanvas, offset) {
    // CONSTANTS
    this.NormalColour = "rgb(0, 0, 0)";
    this.GrayColour = "rgb(180, 180, 180)";
    this.RedColour = "rgb(255, 0, 0)";
    this.BlueColour = "rgb(128, 128, 255)";
    this.BackgroundColour = "rgb(255, 255, 255)";
    this.CursorColour = "rgba(64, 128, 64, 0.8)";
    this.RangeColour = "rgba(135, 206, 235, 0.5)";
    this.FontGlyph = "Times New Roman";
    this.FontSize = "27";
    this.LineWidth = 2;
    this.CursorWidth = 3;
    this.UpperLimit = 96;
    this.LowerLimit = 150;
    this.Margin = 20;
    this.MaxLevel = 9;
    this.DotDistribution = 0;
    // Initialise canvas info.
    this.setCanvas(canvas, ccanvas);
    // display offset
    this.offset = offset;
    // miscellaneous
    this.textdata = "";
    this.ptr = 0;
    this.edge = 0;
    this.intervalId;
    this.innerClipboard = ""
    this.underline = new Set();
    this.tsm = new TSMmanager(offset, 70);
    this.tnm = new ToneNoteManager(this);
    this.gap = String.fromCodePoint(0x2004); // for diacriticals
  }

  /* Canvas size control */
  setCanvas(canvas, ccanvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext("2d");
    this.ctx.font = this.FontSize + "pt " + this.FontGlyph;
    this.ctx.strokeStyle = this.NormalColour;
    this.ctxfillStyle = this.NormalColour;
    this.ctx.lineWidth = this.LineWidth;
    this.ccanvas = ccanvas;
    this.cctx = ccanvas.getContext("2d");
    this.cctx.strokeStyle = this.CursorColour;
    this.cctx.fillStyle = this.RangeColour;
    this.cctx.lineWidth = this.CursorWidth;
    this.rect = ccanvas.getBoundingClientRect();
  }

  /* Cursor controls */
  // Stop cursor blinking (internal use)
  _hideBlinkingCursor() {
    clearInterval(this.intervalId);
    if (this.ptr == this.edge)
      this.cctx.clearRect(0, 0, this.width, this.height);
  }

  // draw vertical cursor (internal use)
  _drawVcursor() {
    let cPt = this.ctx.measureText(this.textdata.substr(0, this.ptr)).width + this.offset;
    this.cctx.beginPath();
    this.cctx.moveTo(cPt, 44);
    this.cctx.lineTo(cPt, 72);
    this.cctx.stroke();
  }

  // Draw cursor (semi-main)
  _drawCursor() {
    this.cctx.clearRect(0, 0, this.width, this.height);
    clearInterval(this.intervalId);
    let flag = true;
    if (this.ptr == this.edge) {    // in case of bar cursor
      this._drawVcursor();    // kickk in cursor when window got activated
      this.intervalId = setInterval(() => {
        if (flag == false) {
          flag = true;
          this._drawVcursor();
        } else {
          flag = false;
          this.cctx.clearRect(0, 0, this.width, this.height);
        }
      }, 500);
    } else {    // in case of range cursor
      let aPt = this.ctx.measureText(this.textdata.substr(0, this.ptr)).width + this.offset;
      let bPt = this.ctx.measureText(this.textdata.substr(0, this.edge)).width + this.offset;
      if (aPt < bPt)
        this.cctx.fillRect(aPt, 44, bPt - aPt, 28);
      else
        this.cctx.fillRect(bPt, 44, aPt - bPt, 28);
    }
  }

  /* Draw text string and cursor */
  // Draw two canvases (main)
  draw() {
    this.ctx.fillStyle = this.BackgroundColour;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.NormalColour;
    this.tnm.draw();
    this._drawBoundary();
    this.ctx.beginPath();
    this.ctx.fillText(this.textdata, this.offset, 70);
    this.ctx.stroke();
    this.tsm.draw(this.ctx, this.textdata);
    this._drawUnderline();
    this._drawCursor();
  }

  /* Draw components */
  // Draw boundary
  _drawBoundary() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.Margin, this.UpperLimit);
    this.ctx.lineTo(this.width - (this.Margin * 2), this.UpperLimit);
    this.ctx.moveTo(this.Margin, this.LowerLimit);
    this.ctx.lineTo(this.width - (this.Margin * 2), this.LowerLimit);
    this.ctx.stroke();
    //
    if (document.getElementById("centrelineCB").checked) {
      this.ctx.setLineDash([5, 2]);
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      let centreY = (this.UpperLimit + this.LowerLimit) / 2.0;
      this.ctx.moveTo(this.Margin, centreY);
      this.ctx.lineTo(this.width - (this.Margin * 2), centreY);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = this.LineWidth;
    }
    //
    this.ctx.fillStyle = this.BackgroundColour;
    this.ctx.fillRect(0, 0, this.width, this.UpperLimit - 1);
    this.ctx.fillRect(0, this.LowerLimit + 1, this.width, this.canvas.height - this.LowerLimit);
    this.ctx.fillStyle = this.NormalColour;
  }

  // Draw underlines
  _drawUnderline() {
    let aList = this._getUnderlinedList();
    this.ctx.beginPath();
    for(let i = 0; i < aList.length; i++) {
      let pair = aList[i];
      let startPx = this.ctx.measureText(this.textdata.substr(0, pair[0])).width;
      this.ctx.moveTo(startPx+this.offset, 72);
      let endPx = this.ctx.measureText(this.textdata.substr(0, pair[1]+1)).width;
      this.ctx.lineTo(endPx+this.offset, 72);
    }
    this.ctx.stroke();
  }

  /* Buffer contorls */
  // Clear entire buffer */
  clear() {
    this.textdata = "";
    this.ptr = 0;
    this.edge = 0;
    this.underline = new Set();
    this.tsm.clear();
    this.tnm.clear();
    this.draw();
  }

  /* Utility function(s) */
  // Return width for tone note
  getWidth4Note(ptr, ch) {
    let startPt = this.ctx.measureText(this.textdata.substr(0, ptr)).width;
    return startPt + (this.ctx.measureText(ch).width / 2.0);
  }

  // Return width for tone note
  getWidth4NoteFull(ptr, ch) {
    let startPt = this.ctx.measureText(this.textdata.substr(0, ptr)).width;
    startPt += this.ctx.measureText(this.textdata.substr(ptr, 1)).width / 2.0;
    return startPt + this.ctx.measureText(ch).width;
  }

  // Return width for a character
  getWidth4ch(ch) {
    return this.ctx.measureText(ch).width;
  }

  // Return height for tone note
  getHeight4Note(size, toneLevel) {
    let newSize;
    switch (this.DotDistribution) {
      case 0:
        newSize = size;
        break;
      case 1:
        newSize = stressedSize;
        break;
      case 2:
        if ((toneLevel == 0) || (toneLevel == this.MaxLevel - 1)) {
          newSize = size
        } else {
          newSize = stressedSize;
        }
        break;
      default:
        newSize = size;
    }
    let lower = this.LowerLimit - newSize - (this.LineWidth / 2.0);
    let upper = this.UpperLimit + newSize + (this.LineWidth / 2.0);
    let step = (lower - upper) / (this.MaxLevel - 1);
    return lower - (step * toneLevel);
  }

  // Erase specific (from ptr to edge) region (internal)
  _eraseRegion() {
    let range = this._getFromTo();
    for (let i = range[0]; i < range[1]; i++) {
      this.tnm.erase(range[0]);
      this.textdata = this.textdata.substr(0, range[0]) + this.textdata.substr(range[0]+1);
    }
    for (let i = range[0]; i < range[1]; i++) {
      this.underline.delete(i);
    }
    let result = [];
    let ar = Array.from(this.underline).sort();
    let chs = range[1] - range[0];
    for (let i = 0; i < ar.length; i++) {
      if (ar[i] > range[0]) {
        result.push(ar[i] - chs);
      } else {
        result.push(ar[i]);
      }
    }
    this.underline = new Set(result);
    this.tsm.eraseRegion(range[0], range[1]);
    this.ptr = this.edge = Math.min(this.ptr, this.edge);
  }

  /* Insert a character, ch */
  insert(ch) {
    let result = [];
    for (const elem of Array.from(this.underline).sort()) {
      if (this.ptr <= elem) {
        result.push(elem+1);
      } else {
        result.push(elem);
      }
    }
    this.underline = new Set(result);
    this.tsm.insertCh(this.ptr, 1);
    this.tnm.insert(this.ptr, ch);
    this.textdata = this.textdata.slice(0, this.ptr) + ch + this.textdata.substr(this.ptr);
    this.ptr += 1;
    this.edge = this.ptr;
  }

  /* Backspece key */
  backspace() {
    selPtr = iap = NotSelected;
    if (this.ptr != this.edge) {
      this._eraseRegion();
    } else {
      if (this.ptr == 0) return;
      let result = [];
      for (const elem of Array.from(this.underline).sort()) {
        if (this.ptr <= elem) {
          result.push(elem-1);
        } else {
          result.push(elem);
        }
      }
      this.underline = new Set(result);
      this.tsm.backspaceCh(this.ptr);
      this.tnm.erase(this.ptr-1);
      this.arrowLeft();
      this.textdata = this.textdata.slice(0, this.ptr) + this.textdata.substr(this.ptr+1);
    }
  }

  /* Delete key */
  delete() {
    selPtr = iap = NotSelected;
    if (this.ptr != this.edge) {
      this._eraseRegion();
    } else {
      if (this.ptr >= this.textdata.length) return;
      let result = [];
      for (const elem of Array.from(this.underline).sort()) {
        if (this.ptr <= elem) {
          result.push(elem-1);
        } else {
          result.push(elem);
        }
      }
      this.underline = new Set(result);
      this.tsm.deleteCh(this.ptr);
      this.tnm.erase(this.ptr);
      this.textdata = this.textdata.slice(0, this.ptr) + this.textdata.substr(this.ptr+1);
    }
  }

  /* Cursor controls */
  // ArrowLeft key
  arrowLeft() {
    if (this.ptr != this.edge)
      this.ptr = this.edge;
    this.ptr -= 1;
    if (this.ptr < 0)
      this.ptr = 0;
    this.edge = this.ptr;
  }

  // ArrowRight key
  arrowRight() {
    if (this.ptr != this.edge)
      this.ptr = this.edge;
    this.ptr += 1;
    if (this.ptr > this.textdata.length)
      this.ptr = this.textdata.length;
    this.edge = this.ptr;
  }

  // Shift+ArrowLeft key
  growLeft() {
    this.edge -= 1;
    if (this.edge < 0)
      this.edge = 0;
  }

  // Shift+ArrowRight key
  growRight() {
    this.edge+= 1;
    if (this.edge > this.textdata.length)
      this.edge = this.textdata.length;
  }

  // Meta+ArrowLeft key
  moveHead() {
    this.ptr = 0;
    this.edge = 0;
  }

  // Meta+ArrowRight key
  moveTail() {
    this.ptr = this.textdata.length;
    this.edge = this.ptr;
  }

  _createWordHeadList() {
    let whl = [-1];   // with sentinel
    let inWord = false;
    let text = this.textdata.split("");
    for (let i = 0; i < text.length; i++) {
      if (text[i] != " ") {
        if (inWord == false) {
          whl.push(i);
          inWord = true;
        }
      } else {    // " "
        inWord = false;
      }
    }
    whl.push(99999);    // sentinel
    return whl;
  }

  // Previous Word
  prevWord() {
    let whl = this._createWordHeadList();
    let i = whl.length - 1;
    while (whl[i] >= this.edge) {
      i -= 1;
    }
    if (i != 0)
      this.edge = whl[i];
    else
      this.edge = 0;
  }

  // Next Word
  nextWord() {
    let whl = this._createWordHeadList();
    let i = 1;
    while (this.edge >= whl[i]) {
      i += 1;
    }
    if (whl[i] != 99999)
      this.edge = whl[i];
    else
      this.edge = this.textdata.length
  }

  /* Special functions */
  // Copy function (also used internally)
  copyRange() {
    let selText = "";
    // Extra space for tone stress mark should be eliminated.
    let spaceArray = this.tsm.pickExtraSpace();
    let range = this._getFromTo();
    for (let i = range[0]; i < range[1]; i++) {
      if (i in spaceArray) {
      } else {
        selText += (this.textdata.substr(i, 1));
      }
    }
    if (selText != "") {
      this.innerClipboard = selText;
    }
//    navigator.clipboard.writeText(selText);
  }

  // Paste
  paste() {
    selPtr = iap = NotSelected;
    if (this.ptr != this.edge) {
      this._eraseRegion();
    }
    let chArray = this.innerClipboard.split("");
    for (let i = 0; i < chArray.length; i++) {
      this.insert(chArray[i]);
    }
    this.edge = this.ptr;
  }

  // Paste function (experimenting) ... All 'this's inside prom.function use 'cMgr' directly.
  specialPaste() {
    selPtr = iap = NotSelected;
    if (this.ptr != this.edge) {
      this._eraseRegion();
    }
    let prom = readFromClipboard();
    prom.then(function (text) {       // This section breaks the capsulisation!
      if (text == undefined)  return;
      let chArray = text.split("");
      for (let i = 0; i < chArray.length; i++) {
        cMgr.insert(chArray[i]);
      }
      cMgr.edge = cMgr.ptr;
    });
  }

  // Cut function
  cutRange() {
    selPtr = iap = NotSelected;
    if (this.ptr != this.edge) {
        this.copyRange();
        this._eraseRegion();
    }
  }

  // Select all
  selectAll() {
    this.ptr = 0;
    this.edge = this.textdata.length;
  }

  /* Tone Stress Mark - High-Rise */
  highRise() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "hr");
    this.draw();
  }

  /* Tone Stress Mark - Low-Rise */
  lowRise() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "lr");
    this.draw();
  }

  /* Tone Stress Mark - High-Fall */
  highFall() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "hf");
    this.draw();
  }

  /* Tone Stress Mark - Low-Fall */
  lowFall() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "lf");
    this.draw();
  }

  /* Tone Stress Mark - Rise-Fall */
  riseFall() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "rf");
    this.draw();
  }

  /* Tone Stress Mark - Fall-Rise */
  fallRise() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "fr");
    this.draw();
  }

  /* Tone Stress Mark - Mid-Level */
  midLevel() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "ml");
    this.draw();
  }

  /* Tone Stress Mark - High-1 */
  high1() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "h1");
    this.draw();
  }

  /* Tone Stress Mark - Low-1 */
  low1() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "l1");
    this.draw();
  }

  /* Tone Stress Mark - High-2 */
  high2() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "h2");
    this.draw();
  }

  /* Tone Stress Mark - Low-2 */
  low2() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "l2");
    this.draw();
  }

  /* Tone Stress Mark - High-3 */
  high3() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "h3");
    this.draw();
  }

  /* Tone Stress Mark - Low-3 */
  low3() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "l3");
    this.draw();
  }

  /* Tone Stress Mark - High-Prehead */
  highPrehead() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "hp");
    this.draw();
  }

  /* Tone Stress Mark - Low-Prehead */
  lowPrehead() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "lp");
    this.draw();
  }

  /* Intonation Phrase Separator */
  intonationP() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "ip");
    this.draw();
  }

  /* FullStop Separator */
  fullStop() {
    this.insert(this.gap);
    this.tsm.register(this.ptr-1, "fs");
    this.draw();
  }

  /* Extra Vowel */
  extraVowel() {
    this.insert("\u200b");   // Zero width space
    this.tsm.register(this.ptr-1, "aa");
    this.draw();
  }

  /* sort ptr and edge */
  _getFromTo() {
    let start;
    let end;
    if (this.ptr < this.edge) {
      start = this.ptr;
      end = this.edge;
    } else {
      start = this.edge;
      end = this.ptr;
    }
    return [start, end];
  }

  /* Set underline */
  setUnderline() {
    let a = this._getFromTo();
    for (let i = a[0]; i < a[1]; i++) {
      this.underline.add(i);
    }
    this.edge = this.ptr;
    this.draw();
  }

  /* Clear underline */
  clearUnderline() {
    let a = this._getFromTo();
    for (let i = a[0]; i < a[1]; i++) {
      this.underline.delete(i);
    }
    this.edge = this.ptr;
    this.draw();
  }

  /* Get underlined list */
  _getUnderlinedList() {
    let ar = Array.from(this.underline).sort();
    ar.push(99999);   // sentinel
    let brk = -2;       // another sentinel
    let aList = [];
    let st = 0;
    for (let i = 0; i < ar.length; i++) {
      if (brk+1 != ar[i]) {
        if (brk != -2) {
          aList.push([st, brk]);
        }
        st = ar[i];
      }
      brk = ar[i]
    }
    return aList;
  }

  redPaint() {
    this.ctx.strokeStyle = this.RedColour;
    this.ctx.fillStyle = this.RedColour;
  }

  blackPaint() {
    this.ctx.strokeStyle = this.NormalColour;
    this.ctx.fillStyle = this.NormalColour;
  }

  bluePaint() {
    this.ctx.strokeStyle = this.BlueColour;
    this.ctx.fillStyle = this.BlueColour;
  }

  incMagX() {
    if (selPtr == NotSelected)
      return;
    this.tnm.noteArray[selPtr].magX += 0.1;
  }

  decMagX() {
    if (selPtr == NotSelected)
      return;
    let x = this.tnm.noteArray[selPtr].magX - 0.1;
    this.tnm.noteArray[selPtr].magX = (x >= 0.1) ? x : 0.1;
  }

  incMagY() {
    if (selPtr == NotSelected)
      return;
    this.tnm.noteArray[selPtr].magY += 0.1;
  }

  decMagY() {
    if (selPtr == NotSelected)
      return;
    let y = this.tnm.noteArray[selPtr].magY - 0.1;
    this.tnm.noteArray[selPtr].magY = (y >= 0.1) ? y : 0.1;
  }

  incFinalY() {
    if (selPtr == NotSelected)
      return;
    this.tnm.noteArray[selPtr].finalY += 1;
  }

  decFinalY() {
    if (selPtr == NotSelected)
      return;
    this.tnm.noteArray[selPtr].finalY -= 1;
  }

  undoHook() {
    prevAvailableSyllable();
  }

  redoHook() {
    nextAvailableSyllable();
  }

  easterKey() {
    let val = prompt("The value should be between 97 and 199.  Current value is " + this.LowerLimit);
    if (isNumber(val)) {
      val = Number(val);
      if ((val > this.UpperLimit) && (val < 200)) {
        this.LowerLimit = val;
        if (val >= 170) {
          weakSize = 6;
          midSize = 9;
          stressedSize = 13;
          magFactor = 1.5;
        } else {
          weakSize = 4;
          midSize = 6;
          stressedSize = 8;
          magFactor = 1.0;
        }
        this.draw();
      }
    }
  }

  saveHalfImageHook() {
    document.getElementById("download2").click();
  }

  saveImageHook() {
    document.getElementById("download").click();
  }

}

// experimenting... (paste function)
async function readFromClipboard() {
  try {
    let text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.error("Failed", err);
  }
}

// supporting function for easter key
function isNumber(n) {
  if (typeof(n) === "string" && n.trim() !== "" && Number.isFinite(n - 0) ) {
    return true;
  }
  return false;
}
