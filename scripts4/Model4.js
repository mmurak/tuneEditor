class Model {
    /* Constructor
     *   ptr: cursor position (insersion pointer)
     *   edge: region edge pointer
     *   underline: Underline set
     *   tsm: Tone Stress Mark Manager object
     *   tnm: Tone Note Manager object
     */
    constructor(canvasMgr) {
        this.textdata = "";
        this.ptr = 0;
        this.edge = 0;
        this.underline = new Set();
        this.tsm = new TSMmanager();
        this.tnm = new ToneNoteManager(canvasMgr);
        this.gap = String.fromCodePoint(0x2004); // for diacriticals
        this.canvasMgr = canvasMgr;
        this.selPtr = G.NotSelected;
        this.separatorPtr  = G.NotSelected;
        this.innerClipboard = "";
    }

    setView(canvasMgr) {
        this.canvasMgr = canvasMgr;
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
        this.canvasMgr.draw();
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

    getTextLines() {
        return this.textdata.split(/\n/);
    }

    getPointerCoord() {
        return this.getLCCoord(this.ptr);
    }

    getLCCoord(x) {
        let partialText = this.textdata.substr(0, x);
        let ar = partialText.split(/\n/);
        let n = ar.length;
        return [n, ar.pop()];
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
        this.selPtr = G.iap = G.NotSelected;
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
        this.selPtr = G.iap = G.NotSelected;
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
        let info = this.getPointerCoord();
        this.ptr -= info[1].length;
        this.edge = this.ptr;
    }

    // Meta+ArrowRight key
    moveTail() {
        let info = this.getPointerCoord();
        let lines = this.getTextLines();
        this.ptr += (lines[info[0]-1].length - info[1].length);
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

    arrowDown() {
        let cInfo = this.getPointerCoord();
        let tLines = this.getTextLines();
        if (cInfo[0] >= tLines.length) return;
        let sumCh = Math.min(cInfo[1].length, tLines[cInfo[0]].length);
        for (let i = 0; i < cInfo[0]; i++) {
            sumCh += tLines[i].length + 1;
        }
        this.ptr = sumCh;
        this.edge = this.ptr;
    }

    arrowUp() {
        let cInfo = this.getPointerCoord();
        let tLines = this.getTextLines();
        if (cInfo[0] <= 1) return;
        let sumCh = Math.min(cInfo[1].length, tLines[cInfo[0]-2].length);
        for (let i = 0; i < cInfo[0]-2; i++) {
            sumCh += tLines[i].length + 1;
        }
        this.ptr = sumCh;
        this.edge = this.ptr;
    }

    growUp() {
        let eInfo = this.getLCCoord(this.edge);
        if (eInfo[0] <= 1) return;
        let clLength = eInfo[1].length;
        let plLength = this.getTextLines()[eInfo[0]-2].length;
        if (plLength >= clLength) {
            this.edge -= (clLength + (plLength - clLength) + 1);
        } else {
            this.edge -= (clLength + 1);
        }
    }

    growDown() {
        let eInfo = this.getLCCoord(this.edge);
        let lines = this.getTextLines();
        if (eInfo[0] >= lines.length) return;
        let clLength = eInfo[1].length;
        let tailLength = lines[eInfo[0]-1].length - clLength;
        let nxLength = lines[eInfo[0]].length;
        if (nxLength >= clLength) {
            this.edge += (tailLength + clLength + 1);
        } else {
            this.edge += (tailLength + nxLength + 1);
        }
    }

    top() {
        this.ptr = 0;
        this.edge = this.ptr;
    }

    bottom() {
        this.ptr = this.textdata.length;
        this.edge = this.ptr;
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
        this.selPtr = G.iap = G.NotSelected;
        if (this.ptr != this.edge) {
            this._eraseRegion();
        }
        let chArray = this.innerClipboard.split("");
        for (let i = 0; i < chArray.length; i++) {
            this.insert(chArray[i]);
        }
        this.edge = this.ptr;
    }


    // Cut function
    cutRange() {
        this.selPtr = G.iap = G.NotSelected;
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
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Low-Rise */
    lowRise() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "lr");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - High-Fall */
    highFall() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "hf");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Low-Fall */
    lowFall() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "lf");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Rise-Fall */
    riseFall() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "rf");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Fall-Rise */
    fallRise() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "fr");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Mid-Level */
    midLevel() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "ml");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - High-1 */
    high1() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "h1");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Low-1 */
    low1() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "l1");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - High-2 */
    high2() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "h2");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Low-2 */
    low2() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "l2");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - High-3 */
    high3() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "h3");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Low-3 */
    low3() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "l3");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - High-Prehead */
    highPrehead() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "hp");
        this.canvasMgr.draw();
    }

    /* Tone Stress Mark - Low-Prehead */
    lowPrehead() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "lp");
        this.canvasMgr.draw();
    }

    /* Intonation Phrase Separator */
    intonationP() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "ip");
        this.canvasMgr.draw();
    }

    intonationP0() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "ip0");
        this.canvasMgr.draw();
    }

    intonationP1() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "ip1");
        this.canvasMgr.draw();
    }

    intonationP2() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "ip2");
        this.canvasMgr.draw();
    }

    intonationP3() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "ip3");
        this.canvasMgr.draw();
    }

    /* FullStop Separator */
    fullStop() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "fs");
        this.canvasMgr.draw();
    }

    fullStop0() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "fs0");
        this.canvasMgr.draw();
    }

    fullStop1() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "fs1");
        this.canvasMgr.draw();
    }

    fullStop2() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "fs2");
        this.canvasMgr.draw();
    }

    fullStop3() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "fs3");
        this.canvasMgr.draw();
    }


    /* Solid Vertical-line extension */
    solid3Line() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "s3l");
        this.canvasMgr.draw();
    }

    solid4Line() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "s4l");
        this.canvasMgr.draw();
    }

    /* Dashed Vertical-line extension */
    dashed1Line() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "d1l");
        this.canvasMgr.draw();
    }

    dashed2Line() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "d2l");
        this.canvasMgr.draw();
    }

    dashed3Line() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "d3l");
        this.canvasMgr.draw();
    }

    dashed4Line() {
        this.insert(this.gap);
        this.tsm.register(this.ptr-1, "d4l");
        this.canvasMgr.draw();
    }

    /* Extra Vowel */
    extraVowel() {
        this.insert("\u200b");   // Zero width space
        this.tsm.register(this.ptr-1, "aa");
        this.canvasMgr.draw();
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
        this.canvasMgr.draw();
    }

    /* Clear underline */
    clearUnderline() {
        let a = this._getFromTo();
        for (let i = a[0]; i < a[1]; i++) {
            this.underline.delete(i);
        }
        this.edge = this.ptr;
        this.canvasMgr.draw();
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


    incMagX() {
        if (this.selPtr == G.NotSelected)
            return;
        this.tnm.noteArray[this.selPtr].magX += 0.1;
    }

    decMagX() {
        if (this.selPtr == G.NotSelected)
            return;
        let x = this.tnm.noteArray[this.selPtr].magX - 0.1;
        this.tnm.noteArray[this.selPtr].magX = (x >= 0.1) ? x : 0.1;
    }

    incMagY() {
        if (this.selPtr == G.NotSelected)
            return;
        this.tnm.noteArray[this.selPtr].magY += 0.1;
    }

    decMagY() {
        if (this.selPtr == G.NotSelected)
            return;
        let y = this.tnm.noteArray[this.selPtr].magY - 0.1;
        this.tnm.noteArray[this.selPtr].magY = (y >= 0.1) ? y : 0.1;
    }

    incFinalY() {
        if (this.selPtr == G.NotSelected)
            return;
        this.tnm.noteArray[this.selPtr].finalY += 1;
    }

    decFinalY() {
        if (this.selPtr == G.NotSelected)
            return;
        this.tnm.noteArray[this.selPtr].finalY -= 1;
    }

    undoHook() {
        prevAvailableSyllable();
    }

    redoHook() {
        nextAvailableSyllable();
    }

    saveHalfImageHook() {
        G.download2.click();
    }

    saveImageHook() {
        G.download.click();
    }

    saveInternalStruct() {
        G.download2.click();
    }

    loadInternalStruct() {
        loadInternalStructure();
    }

    maintenanceHatch() {
        let overrideValue = prompt("Enter override parameter (key=value format): ");
        if (overrideValue != null) {
            override(overrideValue);
            G.aView._hideBlinkingCursor();
            G.aView = new CanvasManager(G.textCanvas, G.cursorCanvas, 30);
            G.aModel.setView(G.aView);
            G.aDispatcher = new Dispatcher(G.aModel);
        }
    }

}
