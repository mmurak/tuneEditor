// Dispatcher -- should be instanciated AFTER CanvasManager object. 
class Dispatcher {
    /* Constructor
     *   dispatchTable: Dispatch table for functions
     *   menuTable: Dispatch table for menu functions
     *   canvasManager: CanvasManager object
     * -----
     *   menuOpened: Flag for slide in menu
     */
    constructor(model) {
        this.keyOpID = {    // Key: Parameter String, Value: Function entry point in Model
            "CursorLeft" : model.arrowLeft,
            "CursorRight" : model.arrowRight,
            "AnchorAndCursorLeft" : model.growLeft,
            "AnchoAndCursorRight" : model.growRight,
            "CursorUp" : model.arrowUp,
            "CursorDown" : model.arrowDown,
            "AnchorAndCursorUp" : model.growUp,
            "AnchoAndCursorDown" : model.growDown,
            "CursorHead" : model.moveHead,
            "CursorTail" : model.moveTail,
            "CursorTail2" : model.moveTail,
            "CursorTop" : model.top,
            "CursorBottom" : model.bottom,
            "CursorPrevWord" : model.prevWord,
            "CursorNextWord" : model.nextWord,
            "Backspace" : model.backspace,
            "DeleteChar" : model.delete,
            "CopyRegion" : model.copyRange,
            "CopyRegion2" : model.copyRange,
            "CutRegion" : model.cutRange,
            "CutRegion2" : model.cutRange,
            "Paste" : model.paste,
            "Paste2" : model.paste,
            "SelectAll" : model.selectAll,
            "SelectAll2" : model.selectAll,
            "MaintenanceHatch" : model.maintenanceHatch,
            "WiderToneTail" : model.incMagX,
            "WiderToneTail2" : model.incMagX,
            "NarrowerToneTail" : model.decMagX,
            "NarrowerToneTail2" : model.decMagX,
            "RaiseToneTail" : model.incMagY,
            "RaiseToneTail2" : model.incMagY,
            "LowerToneTail" : model.decMagY,
            "LowerToneTail2" : model.decMagY,
            "RaiseToneTailEnd" : model.decFinalY,
            "LowerToneTailEnd" : model.incFinalY,
            "NextTone" : model.redoHook,
            "NextTone2" : model.redoHook,
            "PrevTone" : model.undoHook,
            "PrevTone2" : model.undoHook,
        };
        this.dtable = {};
        for (let key in this.keyOpID) {
            this.dtable[getShortRep(key)] = this.keyOpID[key];  // getShortRep() is declared in ParameterManager4.js and change the key input to internal encoding.
        }
        this.mtable = {   // keyname should be specified in UPPERCASE
            "HR" : model.highRise,
            "LR" : model.lowRise,
            "HF" : model.highFall,
            "LF" : model.lowFall,
            "FR" : model.fallRise,
            "RF" : model.riseFall,
            "ML" : model.midLevel,
            "H1" : model.high1,
            "H2" : model.high2,
            "H3" : model.high3,
            "L1" : model.low1,
            "L2" : model.low2,
            "L3" : model.low3,
            "HP" : model.highPrehead,
            "LP" : model.lowPrehead,
            "FS" : model.fullStop,
            "F0" : model.fullStop0,
            "F1" : model.fullStop1,
            "F2" : model.fullStop2,
            "F3" : model.fullStop3,
            "IP" : model.intonationP,
            "I0" : model.intonationP0,
            "I1" : model.intonationP1,
            "I2" : model.intonationP2,
            "I3" : model.intonationP3,
            "S1" : model.intonationP,
            "S2" : model.fullStop,
            "S3" : model.solid3Line,
            "S4" : model.solid4Line,
            "D1" : model.dashed1Line,
            "D2" : model.dashed2Line,
            "D3" : model.dashed3Line,
            "D4" : model.dashed4Line,
            "SU" : model.setUnderline,
            "CU" : model.clearUnderline,
            "AA" : model.extraVowel,
            "SI" : model.saveImageHook,
            "SP" : model.saveInternalStruct,
        };
        this.model = model;
        this.menuOpened = false;
        this.menuBuffer = "";
    }

    /* Slide down menu */
    _menuOpen() {
        this.menuOpened = true;
        this.menuBuffer = "";
        G.miniDisplay.innerText = this.menuBuffer;
        document.body.classList.toggle('nav-open');
    }

    /* Slide up menu */
    _menuClose() {
        this.menuOpened = false;
        document.body.classList.remove('nav-open');
    }

    /* Dispatcher main logic */
    dispatch(evt) {
        let keyname = evt.key;
        if (this.menuOpened) {
            if (keyname == "Escape") {  // abort?
                this._menuClose();
            } else if (keyname.length == 1) {
                this.menuBuffer += keyname;
                G.miniDisplay.innerText = this.menuBuffer;
                if (this.menuBuffer.length >= 2) {
                    let command = this.menuBuffer.toUpperCase();
                    if (command in this.mtable) {
                        this.model.selPtr = G.iap = G.NotSelected;
                        this.mtable[command].apply(this.model);  // this is tricky... sort of.
                        this._menuClose();
                        G.patternTemplate.process(command);
                    } else {
                        alert("'" + this.menuBuffer + "' command not found.");
                        this.menuBuffer = "";
                        G.miniDisplay.innerText = "";
                    }
                }
            }
        } else {
            let ctrl = (evt.ctrlKey) ? "C" : "c";
            let meta = (evt.metaKey) ? "M" : "m";
            let shift = (evt.shiftKey) ? "S" : "s";
            let keyname = evt.key;
            let entry = ctrl + meta + shift + keyname.toUpperCase();
            if (entry in this.dtable) {
                this.dtable[entry].apply(this.model);   // this is tricky... sort of.
                if (document.activeElement != G.hotGate) {  // input event for HotGate sould be preserved.
                    evt.preventDefault();
                }
            } else {
                if (keyname.length == 1) {
                    this.model.selPtr = G.iap = G.NotSelected;
                    this.model.insert(keyname);
                } else if (keyname == "Escape") {
                    this._menuOpen();
                } else if (keyname == "Enter") {
                    this.model.selPtr = G.iap = G.NotSelected;
                    this.model.insert("\n");
                }
            }
            let flag = true;
            this.model.canvasMgr.draw(flag, this.model);
        }
    }
}
