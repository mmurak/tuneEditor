// disable "prev-page" function of the browser
window.addEventListener("popstate", function (evt) {
    history.pushState(null, null, null);
    return;
});

/* Main REP loop */
document.addEventListener("keydown", function (evt) {
    let keyname = evt.key;
    dispatcher.dispatch(evt);
});

window.addEventListener("blur", function (evt) {
    aView._hideBlinkingCursor();
});

window.addEventListener("focus", function (evt) {
    aView.draw(false);
});

window.addEventListener('keydown', function(evt){
    let kc = event.keyCode;
    switch (kc) {
        case 37:    // ←
        case 39:    // →
            evt.preventDefault();
    }
}, true);

aView.ccanvas.addEventListener("mousedown", function(evt) {
    G.mouseDown = true;
    let xFixed = (aView.rect.left >= 0) ? aView.rect.left : 0;
//  let coordX = evt.pageX - xFixed - 30;
    let coordX = evt.layerX - 30;
    let coordY = evt.pageY - aView.rect.top;
    if (coordY < aView.UpperLimit) {   // text area
        G.textClick = true;
        let chp = 0;
        while((chp < aView.model.textdata.length) && (aView.ctx.measureText(aView.model.textdata.substr(0, chp+1)).width < coordX)) {
            chp += 1;
        }
        if (evt.shiftKey) {
            aView.edge = chp;
        } else {
            aView.ptr = aView.edge = chp;
        }
        aView.draw(true);
    } else if (G.separator1.checked) {   // put a separator 
        G.separator1.checked = false;
        if (evt.shiftKey && evt.altKey) {
            aView.model.tnm.noteArray.push(new Separator4(coordX));
        } else if (evt.shiftKey) {
            aView.model.tnm.noteArray.push(new Separator2(coordX));
        } else if (evt.altKey) {
            aView.model.tnm.noteArray.push(new Separator3(coordX));
        } else {
            aView.model.tnm.noteArray.push(new Separator1(coordX));
        }
        aView.model.selPtr = G.NotSelected;
    } else if (G.separator2.checked) {   // put a Dashed separator 
        G.separator2.checked = false;
        if (evt.shiftKey && evt.altKey) {
            aView.model.tnm.noteArray.push(new SeparatorDL4(coordX));
        } else if (evt.shiftKey) {
            aView.model.tnm.noteArray.push(new SeparatorDL2(coordX));
        } else if (evt.altKey) {
            aView.model.tnm.noteArray.push(new SeparatorDL3(coordX));
        } else {
            aView.model.tnm.noteArray.push(new SeparatorDL1(coordX));
        }
        aView.model.selPtr = G.NotSelected;
    } else {    // tone process
        if (aView.model.tnm.noteArray.length == 0)
            return;
        let delta = 99999;
        G.iap = 0;
        if (G.summon.checked == false) {
            for (let i = 0; i < aView.model.tnm.noteArray.length; i++) {
                if (aView.model.tnm.noteArray[i].visible == false)
                    continue;
                tempDelta = Math.abs(aView.model.tnm.noteArray[i].width - coordX);
                if (tempDelta < delta) {
                    G.iap = i;
                    delta = tempDelta;
                }
            }
            if (aView.model.selPtr == G.iap) {
                aView.model.selPtr = G.NotSelected;
            } else {
                aView.model.selPtr = G.iap;
            }
        } else {    // summon process
            for (i = 0; i < aView.model.tnm.noteArray.length; i++) {
                if (aView.model.tnm.noteArray[i].visible)
                    continue;
                tempDelta = Math.abs(aView.model.tnm.noteArray[i].width - coordX);
                if (tempDelta < delta) {
                    G.iap = i;
                    delta = tempDelta;
                }
            }
            aView.model.tnm.noteArray[G.iap].visible = true;
            aView.model.selPtr = G.NotSelected;
        }
    }
    G.summon.checked = false;
    aView.draw(false);
});

aView.ccanvas.addEventListener("contextmenu", function(evt) {
    evt.preventDefault();
}, true);

aView.ccanvas.addEventListener("mouseup", function (evt) {
    G.mouseDown = false;
    G.textClick = false;
});

aView.ccanvas.addEventListener("mousemove", function (evt) {
    if (G.textClick) {    // text area
        if (!G.mouseDown)
            return;
        let xFixed = (aView.rect.left >= 0) ? aView.rect.left : 0;
//        let coordX = evt.pageX - xFixed - 30;
        let coordX = evt.layerX - 30;
        let coordY = evt.pageY - aView.rect.top;
        let chp = 0;
        while((chp < aView.textdata.length) && (aView.ctx.measureText(aView.textdata.substr(0, chp+1)).width < coordX)) {
            chp += 1;
        }
        aView.edge = chp;
        aView.draw(true);
    } else {
        if (!G.mouseDown || aView.model.selPtr == G.NotSelected) 
            return;
        let xFixed = (aView.rect.left >= 0) ? aView.rect.left : 0;
//        let coordX = evt.pageX - xFixed;
        let coordX = evt.layerX;
        aView.model.tnm.noteArray[aView.model.selPtr].width = coordX - 30;
        aView.draw(false);
    }
});

aView.canvas.oncontextmenu = function (evt) {
    G.mouseDown = false;
    aView.model.selPtr = G.NotSelected;
    aView.draw(false);
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
        aView.insert(ch);
    }
    aView.draw(true);
});
G.projInput.addEventListener("click", evt => {G.projInput.value=null;}, false);
G.projInput.addEventListener("focus", evt => {G.projInput.blur();}, false);
G.projInput.addEventListener("change", loadInternalStructure, false);

