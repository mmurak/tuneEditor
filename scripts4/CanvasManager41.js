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
        this.LineWidth = 2;
        this.CursorWidth = 3;
        this.UpperLimit = 96;
        this.LowerLimit = 150;
        this.Margin = 20;
        this.MaxLevel = -1001;
        // Initialise canvas info.
        this.setCanvas(canvas, ccanvas);
        // display offset
        this.offset = offset;
        // miscellaneous
        this.intervalId;
        this.innerClipboard = ""
        this.underline = new Set();
        this.gap = String.fromCodePoint(0x2004); // for diacriticals
    }

    // Canvas size control
    setCanvas(canvas, ccanvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext("2d");
        this.ctx.font = GPD["FontSize"] + "pt " + GPD["FontName"];
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

fitScrollCanvas2Window() {
    G.scrollCanvas.style.height = window.innerHeight - G.wrap.offsetHeight - (G.scrollCanvas.offsetHeight - G.scrollCanvas.clientHeight) - 1;
    let oh = G.scrollCanvas.clientHeight - (G.scrollCanvas.offsetHeight - G.scrollCanvas.clientHeight) - 1;
    let ow =  G.scrollCanvas.clientWidth - (G.scrollCanvas.offsetWidth - G.scrollCanvas.clientWidth) - 1;
}

    // Cursor controls 
    // Stop cursor blinking (internal use)
    _hideBlinkingCursor() {
        clearInterval(this.intervalId);
        if (G.aModel.ptr == G.aModel.edge)
            this.cctx.clearRect(0, 0, this.width, this.height);
    }

    // draw vertical cursor (internal use)
    _drawVcursor() {
        let pc = G.aModel.getPointerCoord();
        let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
        let cPt = this.ctx.measureText(pc[1]).width + GPD["CanvasLeftMargin"];
        let c1 = GPD["CanvasTopMargin"] + (pc[0]-1) * (GPD["TSMHeight"] + dah) + GPD["TSMBaseLineOffset"];
        this.cctx.beginPath();
        this.cctx.moveTo(cPt, c1);
        this.cctx.lineTo(cPt, c1- GPD["FontSize"] - 1);
        this.cctx.stroke();
    }

    // Draw cursor (semi-main)
    _drawCursor() {
        this.cctx.clearRect(0, 0, this.width, this.height);
        clearInterval(this.intervalId);
        let flag = true;    // for alternate bar cursor
        if (G.aModel.ptr == G.aModel.edge) {    // in case of bar cursor
            this._drawVcursor();    // kick in cursor when window got activated
            this.intervalId = setInterval(() => {
                if (flag == false) {
                    flag = true;
                    this._drawVcursor();
                } else {
                    flag = false;
                    this.cctx.clearRect(0, 0, this.width, this.height);
                }
            }, 500);
        } else {    // range selection
            let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
            let fromPt = G.aModel.ptr;
            let toPt = G.aModel.edge;
            if (fromPt > toPt) {
                let wk = toPt;
                toPt = fromPt;
                fromPt = wk;
            }
            let startInfo = G.aModel.getLCCoord(fromPt);
            let endInfo = G.aModel.getLCCoord(toPt);
            if (startInfo[0] == endInfo[0]) {   // same line
                let aMt = this.ctx.measureText(startInfo[1]);
                let aPt = aMt.width;
                let bPt = this.ctx.measureText(endInfo[1]).width;
                let c1 = GPD["CanvasTopMargin"] + (startInfo[0]-1) * (GPD["TSMHeight"] + dah) + GPD["TSMBaseLineOffset"] - aMt.fontBoundingBoxAscent;
                this.cctx.fillRect(aPt + GPD["CanvasLeftMargin"], c1, bPt - aPt, aMt.fontBoundingBoxAscent);
            } else {
                let lines = G.aModel.getTextLines();
                let aMt = this.ctx.measureText(startInfo[1]);
                let aPt = aMt.width;
                let bPt = this.ctx.measureText(lines[startInfo[0]-1]).width;
                let c1 = GPD["CanvasTopMargin"] + (startInfo[0]-1) * (GPD["TSMHeight"] + dah) + GPD["TSMBaseLineOffset"] - aMt.fontBoundingBoxAscent;
                this.cctx.fillRect(aPt + GPD["CanvasLeftMargin"], c1, bPt - aPt, aMt.fontBoundingBoxAscent);
                for (let ll = startInfo[0]+1; ll < endInfo[0]; ll++) {
                    let cPt = this.ctx.measureText(lines[ll-1]).width
                    c1 = GPD["CanvasTopMargin"] + (ll - 1) * (GPD["TSMHeight"] + dah) + GPD["TSMBaseLineOffset"] - aMt.fontBoundingBoxAscent;;
                    this.cctx.fillRect(GPD["CanvasLeftMargin"], c1, cPt, aMt.fontBoundingBoxAscent);
                }
                c1 = GPD["CanvasTopMargin"] + (endInfo[0] - 1) * (GPD["TSMHeight"] + dah) + GPD["TSMBaseLineOffset"] - aMt.fontBoundingBoxAscent;;
                let zPt = this.ctx.measureText(endInfo[1]).width;
                this.cctx.fillRect(GPD["CanvasLeftMargin"], c1, zPt, aMt.fontBoundingBoxAscent);
            }
        }
    }

    getXcoordinate(str) {
        return this.ctx.measureText(str).width + GPD["CanvasLeftMargin"];
    }

    _getMaximumNecessaryWidth() {
        let textLines = G.aModel.getTextLines();
        let lmargin = GPD["CanvasLeftMargin"];
        let rmargin = GPD["CanvasRightMargin"];
        let result = 0;
        for (let i = 0; i < textLines.length; i++) {
            let aWidth = this.ctx.measureText(textLines[i]).width + lmargin + rmargin;
            result = (aWidth > result) ? aWidth : result;
        }
        return result;
    }

    _getMaximumNecessaryHeight() {
        let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
        return GPD["CanvasTopMargin"] + ((G.aModel.getTextLines().length) * (GPD["TSMHeight"] + dah)) + GPD["CanvasBottomMargin"];
    }

    _drawTSMLines() {
        let textLines = G.aModel.getTextLines();
        let bloffset = GPD["TSMBaseLineOffset"];
        let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
        let tsmDotsHeight = GPD["TSMHeight"] + dah;
        let lmargin = GPD["CanvasLeftMargin"];
        //
        let blPtr = GPD["CanvasTopMargin"];
        this.ctx.beginPath();
        for (let line = 0; line < textLines.length; line++) {
            this.ctx.fillText(textLines[line], lmargin, blPtr + bloffset);
            blPtr += tsmDotsHeight;
        }
        this.ctx.stroke();
    }

    _drawTSMSymbols() {
        let blPtr = GPD["CanvasTopMargin"];
        let bloffset = GPD["TSMBaseLineOffset"];
        let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
        let tsmDotsHeight = GPD["TSMHeight"] + dah;
        let lmargin = GPD["CanvasLeftMargin"];
        for(let i = 0; i < G.aModel.tsm.tsmArray.length; i++) {
            let pair = G.aModel.tsm.tsmArray[i];
            let coordInfo = G.aModel.getLCCoord(pair[0]);
            let height = blPtr + (coordInfo[0] - 1) * tsmDotsHeight + bloffset;
            let width = this.ctx.measureText(coordInfo[1]).width;
            pair[1].draw(this.ctx, lmargin, height, width);
        }
    }

    draw(scroll2cursor) {
        let canvas = G.textCanvas;
        let ccanvas = G.cursorCanvas;
        let necessaryWidth = this._getMaximumNecessaryWidth();
        let minWidth = GPD["CanvasMinWidth"];
        if (canvas.width < necessaryWidth) {
            canvas.width = necessaryWidth;
            ccanvas.width = necessaryWidth;
            this.setCanvas(canvas, ccanvas);
        } else if (minWidth > necessaryWidth) {
            if (canvas.width != minWidth) {
                canvas.width = minWidth;
                ccanvas.width = minWidth;
                this.setCanvas(canvas, ccanvas);
            }
        } else {
            canvas.width = necessaryWidth;
            ccanvas.width = necessaryWidth;
            this.setCanvas(canvas, ccanvas);
        }
//
        let necessaryHeight = this._getMaximumNecessaryHeight();
        let minHeight = GPD["CanvasMinHeight"];
        if (canvas.height < necessaryHeight) {
            canvas.height = necessaryHeight;
            ccanvas.height = necessaryHeight;
            this.setCanvas(canvas, ccanvas);
        } else if (minHeight > necessaryHeight) {
            if (canvas.height != minHeight) {
                canvas.height = minHeight;
                ccanvas.height = minHeight;
                this.setCanvas(canvas, ccanvas);
            }
        } else {
            canvas.height = necessaryHeight;
            ccanvas.height = necessaryHeight;
            this.setCanvas(canvas, ccanvas);
        }
//
        this.ctx.fillStyle = this.BackgroundColour;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.NormalColour;
        if (GPD["DotsSwitch"] == 1) {
            this._drawNotes();
            this._drawBoundary();
        }
        this._drawTSMLines();
        this._drawTSMSymbols();
        this._drawUnderline();
        this._drawCursor();
        if (scroll2cursor) {
            let currentOffsetH = G.scrollCanvas.scrollLeft;
            let currentOffsetV = G.scrollCanvas.scrollTop;
            let info = G.aModel.getLCCoord(G.aModel.edge);
            let cPtH = Math.floor(this.getXcoordinate(info[1]));
            if (cPtH < currentOffsetH) {
                G.scrollCanvas.scrollLeft = cPtH - GPD["CanvasLeftMargin"];
            } else if (cPtH > (currentOffsetH + G.scrollAreaWidth)) {
                G.scrollCanvas.scrollLeft = cPtH + GPD["CanvasRightMargin"] - G.scrollAreaWidth;
            }
//
            let topline = G.aModel.getLCCoord(G.aModel.edge);
            let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
            let cPtVupper = GPD["CanvasTopMargin"] + ((topline[0] - 1) * (GPD["TSMHeight"] + dah));
            let bottomline = G.aModel.getLCCoord(G.aModel.edge);
            let cPtVlower = GPD["CanvasTopMargin"] + ((bottomline[0] - 1) * (GPD["TSMHeight"] + dah));
            if (cPtVupper < currentOffsetV) {
                G.scrollCanvas.scrollTop = cPtVupper - GPD["CanvasTopMargin"];
            } else if (cPtVlower > (currentOffsetV + G.scrollAreaHeight)) {
                G.scrollCanvas.scrollTop = cPtVlower + GPD["CanvasBottomMargin"] - G.scrollAreaHeight;
            }
        }
    }

    _getCoordInfo(noteArrayIdx) {
        let altArrayIdx = noteArrayIdx * 2 + 1;
        let text = G.aModel.textdata.substr(0, G.aModel.tnm.altArray[altArrayIdx]);
        let textArray = text.split(/\n/);
        return [textArray.length - 1, this.ctx.measureText(textArray[textArray.length-1]).width + this.ctx.measureText(G.aModel.textdata.substr(G.aModel.tnm.altArray[altArrayIdx], 1)).width / 2.0];
    }

    _drawNotes() {
        if (G.summon.checked) {
            G.aModel.selPtr = G.NotSelected;
            for (let i = 0; i < G.aModel.tnm.noteArray.length; i++) {
                if (G.aModel.tnm.noteArray[i].visible == false) {
                    this.bluePaint();
                }
                let coord = this._getCoordInfo(i);
                G.aModel.tnm.noteArray[i].draw(this.ctx, coord);
                this.blackPaint();
            }
            for (let i = 0; i < G.aModel.tnm.separatorArray.length; i++) {
                if (G.aModel.tnm.separatorArray[i].visible == false) {
                    this.bluePaint();
                }
                G.aModel.tnm.separatorArray[i].draw(this.ctx);
                this.blackPaint();
            }
        } else {
            for (let i = 0; i < G.aModel.tnm.noteArray.length; i++) {
                if (G.aModel.tnm.noteArray[i].visible == false)
                    continue;
                if (i == G.aModel.selPtr) {
                    this.redPaint();
                }
                let coord = this._getCoordInfo(i);
                G.aModel.tnm.noteArray[i].draw(this.ctx, coord);
                this.blackPaint();
            }
            for (let i = 0; i < G.aModel.tnm.separatorArray.length; i++) {
                if (G.aModel.tnm.separatorArray[i].visible == false) {
                    continue;
                }
                if (i == G.aModel.separatorPtr) {
                    this.redPaint();
                }
                G.aModel.tnm.separatorArray[i].draw(this.ctx);
                this.blackPaint();
            }
        }
    }

    _draw1Boundary(left, linePtr, upper, lower, ll, centreline, areaHeight) {
        if (GPD["sf"] > ll) return;
        this.ctx.beginPath();
        this.ctx.moveTo(left + GPD["sf"], linePtr + upper);
        this.ctx.lineTo(left + ll, linePtr + upper);
        this.ctx.moveTo(left + GPD["sf"], linePtr + lower);
        this.ctx.lineTo(left + ll, linePtr + lower);
        this.ctx.stroke();
        if (centreline) {
            this.ctx.beginPath();
            this.ctx.setLineDash([5, 2]);
            this.ctx.lineWidth = 2;
            let centreY = (upper + lower) / 2.0;
            this.ctx.moveTo(left + GPD["sf"], linePtr + centreY);
            this.ctx.lineTo(left + ll, linePtr + centreY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.lineWidth = 2;
        }
    }

    _drawBoundary() {
        let tsmHeight = GPD["TSMHeight"];
        let areaHeight = GPD["DotsAreaHeight"];
        let centreline = (GPD["CentrelineSwitch"] == "1") ? true : false;
        let upper = GPD["TopLineOffset"];
        let lower = GPD["BottomLineOffset"];
        let left = GPD["CanvasLeftMargin"];
        let right = GPD["CanvasRightMargin"];
        let linePtr = GPD["CanvasTopMargin"] + tsmHeight;
        let delta = areaHeight + tsmHeight;
        let lineNo = G.aModel.getTextLines().length;
        let ll = this.canvas.width - left - right;      // the value might be overwritten later when FullBaseline is '0'
        let lineInfo = G.aModel.getTextLines();
        for (let idx = 0; idx < lineNo; idx++) {
            if (GPD["FullBaseline"] == "0") {
                ll = left + this.ctx.measureText(lineInfo[idx]).width - right;
            }
            this._draw1Boundary(left, linePtr, upper, lower, ll, centreline, areaHeight);
            linePtr += delta;
//            lineNo--;
        }
    }


    _checkOverlap(startP, ll) {
        let result = [];
        let endP = startP + ll;
        let uList = G.aModel._getUnderlinedList();
        for (let a = 0; a < uList.length; a++) {
            if ((uList[a][1] < startP) || (endP < uList[a][0])) continue;
            let uStart = uList[a][0] - startP;
            if (uStart < 0)  uStart = 0;
            let uEnd = uList[a][1] - startP;
            if (uEnd > ll)  uEnd = ll;
            result.push([uStart, uEnd]);
        }
        return result;
    }

    // Draw underlines
    _drawUnderline() {
        let lines = G.aModel.getTextLines();
        let verticalOffset = GPD["CanvasTopMargin"] + GPD["TSMBaseLineOffset"] + 3;
        let startP = 0;
        this.ctx.beginPath();
        for (let lp = 0; lp < lines.length; lp++) {
            let rangeArray = this._checkOverlap(startP, lines[lp].length);
            for (let up = 0; up < rangeArray.length; up++) {
                let startPx = this.ctx.measureText(lines[lp].substr(0, rangeArray[up][0])).width;
                this.ctx.moveTo(GPD["CanvasLeftMargin"] + startPx, verticalOffset);
                let endPx = this.ctx.measureText(lines[lp].substr(0, rangeArray[up][1]+1)).width;
                this.ctx.lineTo(GPD["CanvasLeftMargin"] + endPx, verticalOffset);
            }
            let dah = (GPD["DotsSwitch"] == 1) ? GPD["DotsAreaHeight"] : 0;
            verticalOffset += (GPD["TSMHeight"] + dah);
            startP += (lines[lp].length + 1);
        }
        this.ctx.stroke();
    }

    // Buffer contorls
    // Clear entire buffer
    clear() {
        G.aModel.textdata = "";
        G.aModel.ptr = 0;
        G.aModel.edge = 0;
        this.underline = new Set();
        G.aModel.tsm.clear();
        G.aModel.tnm.clear();
        this.draw();
    }

    // Utility function(s)
    // Return width for tone note
    getWidth4Note(ptr, ch) {
        let startPt = this.ctx.measureText(G.aModel.textdata.substr(0, ptr)).width;
        return startPt + (this.ctx.measureText(ch).width / 2.0);
    }

    // Return width for tone note
    getWidth4NoteFull(ptr, ch) {
        let startPt = this.ctx.measureText(G.aModel.textdata.substr(0, ptr)).width;
        startPt += this.ctx.measureText(G.aModel.textdata.substr(ptr, 1)).width / 2.0;
        return startPt + this.ctx.measureText(ch).width;
    }

    // Return width for a character
    getWidth4ch(ch) {
        return this.ctx.measureText(ch).width;
    }

    // Return height for tone note
    getHeight4Note(size, toneLevel) {
        let newSize;
        switch (GPD["DotDistributionPattern"]) {
            case 0:
                newSize = size;
                break;
            case 1:
                newSize = GPD["DotLSize"];
                break;
            case 2:
                if ((toneLevel == -1) || (toneLevel == this.MaxLevel)) {
                    newSize = size
                } else {
                    newSize = GPD["DotLSize"];
                }
                break;
            default:
                newSize = size;
        }
        let lower = GPD["BottomLineOffset"] - newSize - (this.LineWidth / 2.0);
        let upper = GPD["TopLineOffset"] + newSize + (this.LineWidth / 2.0);
        let step = (lower - upper) / (this.MaxLevel);
        return lower - Math.round(step * toneLevel);
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

}
