// Dispatch table for Dispatcher -- should be declared AFTER CanvasManager object.
let KeyDispatcher = {   // keyname should be specified in UPPERCASE (considering CAPS LOCK)
  "cmsBACKSPACE" : cMgr.backspace,
  "cmsDELETE" : cMgr.delete,
  "cmsARROWLEFT" : cMgr.arrowLeft,
  "cmsARROWRIGHT" : cMgr.arrowRight,
  "cmSARROWLEFT" : cMgr.growLeft,
  "cmSARROWRIGHT" : cMgr.growRight,
  "cMSARROWLEFT" : cMgr.decMagX,
  "cMSARROWRIGHT" : cMgr.incMagX,
  "cMSARROWUP" : cMgr.incMagY,
  "cMSARROWDOWN" : cMgr.decMagY,
  "cmsARROWUP" : cMgr.decFinalY,
  "cmsARROWDOWN" : cMgr.incFinalY,
  "CmSARROWLEFT" : cMgr.prevWord,
  "CmSARROWRIGHT" : cMgr.nextWord,
  "CmsC" : cMgr.copyRange,
  "cMsC" : cMgr.copyRange,
  "CmsV" : cMgr.paste,
  "cMsV" : cMgr.paste,
//  "cMSV" : cMgr.specialPaste,
  "CmsX" : cMgr.cutRange,
  "cMsX" : cMgr.cutRange,
  "CmsA" : cMgr.selectAll,
  "cMsA" : cMgr.selectAll,
  "cMsARROWLEFT" : cMgr.moveHead,
  "cMsARROWRIGHT" : cMgr.moveTail,
  "CmsZ" : cMgr.undoHook,
  "cMsZ" : cMgr.undoHook,
  "CmSZ" : cMgr.redoHook,
  "cMSZ" : cMgr.redoHook,
};

// Menu Dispatch table for Dispatcher -- should be declared AFTER CanvasManager object.
let MenuDispatcher = {   // keyname should be specified in UPPERCASE (considering CAPS LOCK)
  "HR" : cMgr.highRise,
  "LR" : cMgr.lowRise,
  "HF" : cMgr.highFall,
  "LF" : cMgr.lowFall,
  "FR" : cMgr.fallRise,
  "RF" : cMgr.riseFall,
  "ML" : cMgr.midLevel,
  "H1" : cMgr.high1,
  "H2" : cMgr.high2,
  "H3" : cMgr.high3,
  "L1" : cMgr.low1,
  "L2" : cMgr.low2,
  "L3" : cMgr.low3,
  "HP" : cMgr.highPrehead,
  "LP" : cMgr.lowPrehead,
  "FS" : cMgr.fullStop,
  "IP" : cMgr.intonationP,
  "SU" : cMgr.setUnderline,
  "CU" : cMgr.clearUnderline,
  "AA" : cMgr.extraVowel,
};


class Dispatcher {
  /* Constructor
   *   dispatchTable: Dispatch table for functions
   *   menuTable: Dispatch table for menu functions
   *   canvasManager: CanvasManager object
   * -----
   *   menuOpened: Flag for slide in menu
   */
  constructor(dispatchTable, menuTable, canvasManager) {
    this.dtable = dispatchTable;
    this.mtable = menuTable;
    this.cMgr = canvasManager;
    this.menuOpened = false;
    this.menuBuffer = "";
  }

  /* Slide down menu */
  _menuOpen() {
    this.menuOpened = true;
    this.menuBuffer = "";
    document.getElementById("minidisplay").innerText = this.menuBuffer;
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
        document.getElementById("minidisplay").innerText = this.menuBuffer;
        if (this.menuBuffer.length >= 2) {
          let command = this.menuBuffer.toUpperCase();
          if (command in this.mtable) {
            selPtr = iap = NotSelected;
            this.mtable[command].apply(this.cMgr);  // this is tricky... sort of.
          }
          this._menuClose();
        }
      }
    } else {
      let ctrl = (evt.ctrlKey) ? "C" : "c";
      let meta = (evt.metaKey) ? "M" : "m";
      let shift = (evt.shiftKey) ? "S" : "s";
      let keyname = evt.key;
      let entry = ctrl + meta + shift + keyname.toUpperCase();
      if (entry in this.dtable) {
        this.dtable[entry].apply(this.cMgr);   // this is tricky... sort of.
      } else {
        if (keyname.length == 1) {
          selPtr = iap = NotSelected;
          this.cMgr.insert(keyname);
        } else if (keyname == "Escape") {
          this._menuOpen();
        }
      }
      this.cMgr.draw();
    }
  }
}