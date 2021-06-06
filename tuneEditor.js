      const cvPattern = new RegExp("^([^aeiouy]*)([aeiouy]+)(.*)", "i");

      const weakSize = 4;
      const midSize = 6;
      const stressedSize = 8;
      const lineWidth = 2;

      const maxLevel = 9;

      const margin = 20;
      const upperLimit = 96;
      const lowerLimit = 150;

      const toneCircle = 1;
      const separator = 2;
      const toneCircleAtTheShed = 11;
      const separatorAtTheShed = 12;

      var canvas;
      var ctx;
      var rect;

      var intonationArray = [];   // [type, size, width, tone, nucleusType]
      var iap = 0;

      var selectionSet = new Set();
      const NotSelected = -1;
      let selPtr = NotSelected;

      const ColourNormal = "rgb(0, 0, 0)";
      const ColourBackground = "rgb(255, 255, 255)";
      const ColourSelected = "rgb(255, 0, 0)";
      const ColourSummoned = "rgb(128, 128, 255)";

      var alternateArray = [0, 99999];   // with a sentinel
      var prevText = " ";   // with a sentinel

      var mouseDown = false;

      function initialise() {
        newCanvasWidth();
        var inputArea = document.getElementById("intext");
        inputArea.addEventListener('select', function() {
          this.selectionStart = this.selectionEnd;
          }, false);
        inputArea.value = "";
        inputArea.focus();
        drawBoundary();
        canvas.addEventListener("mousedown", function (evt) {
            mouseDown = true;
            var coordX = evt.clientX - rect.left;
            if (document.getElementById("separator1").checked) {
              document.getElementById("separator1").checked = false;
              intonationArray.push(new Separator(coordX));
            } else {
              if (intonationArray.length == 0)
                return;
              var delta = 99999;
              iap = 0;
              if (document.getElementById("summon").checked == false) {
                for (let i = 0; i < intonationArray.length; i++) {
                  if (intonationArray[i].visible == false)
                    continue;
                  tempDelta = Math.abs(intonationArray[i].width + margin - coordX);
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
                for (i = 0; i < intonationArray.length; i++) {
                  if (intonationArray[i].visible)
                    continue;
                  tempDelta = Math.abs(intonationArray[i].width + margin - coordX);
                  if (tempDelta < delta) {
                    iap = i;
                    delta = tempDelta;
                  }
                }
                intonationArray[iap].visible = true;
                selPtr = NotSelected;
              }
            }
            document.getElementById("summon").checked = false;
            redrawCanvas();
        });
        canvas.addEventListener("mouseup", function (evt) {
          mouseDown = false;
        });
        canvas.addEventListener("mousemove", function (evt) {
            if (!mouseDown || selPtr == NotSelected)
              return;
            var coordX = evt.clientX - rect.left;
            intonationArray[selPtr].width = coordX - margin;
            redrawCanvas();
        });
        canvas.oncontextmenu = function (evt) {
            mouseDown = false;
            selPtr = NotSelected;
            redrawCanvas();
            return false;
        };
        document.addEventListener("keydown", function (event) {
          if ((selPtr == NotSelected) || (intonationArray[selPtr] instanceof Separator))
            return;
          let keyName = event.key;
          if (event.shiftKey) {
            if (keyName == "ArrowRight") {
              intonationArray[selPtr].magX += 0.1;
            } else if (keyName == "ArrowUp") {
              intonationArray[selPtr].magY += 0.1;
            } else if (keyName == "ArrowLeft") {
              let x = intonationArray[selPtr].magX - 0.1;
              intonationArray[selPtr].magX = (x >= 0.1) ? x : 0.1;
            } else if (keyName == "ArrowDown") {
              let y = intonationArray[selPtr].magY - 0.1;
              intonationArray[selPtr].magY = (y >= 0.1) ? y : 0.1;
            }
            redrawCanvas();
          } else if (event.ctrlKey) {
          } else {
            if (keyName == "ArrowDown") {
              intonationArray[selPtr].finalY += 1;
            } else if (keyName == "ArrowUp") {
              intonationArray[selPtr].finalY -= 1;
            }
            redrawCanvas();
          }
        });
      }


      function getInsertionPoint(oldtext, newtext) {  // returns [chptr, clptr]
        var i = 0;
        while(i < oldtext.length) {
          if (oldtext.charAt(i) != newtext.charAt(i))
            break
          i += 1;
        }
        return i;
      }

      function getDeletedPoint(oldtext, newtext) {
        var i = 0;
        while (i < newtext.length) {
          if (oldtext.charAt(i) != newtext.charAt(i))
            break;
          i += 1;
        }
        return i;
      }

      function getCharType(ch) {
        if (ch.match(/[aeiouy]/i))
          return "V";
        else
          return "C";
      }

      function getAAptr(chp) {    // eg.  'this' : [0, 2, 3]
        var i = 0;
        while (chp >= alternateArray[i]) {
          i += 1;
        }
        return i - 1;
      }

      function shiftArray(ptr, width) {
//console.log("ShiftArray:" + ptr + "(" + width + ")");
        var leftEdge = 99999;
        while(alternateArray[ptr] != 99999) {
          alternateArray[ptr] += 1;
          if (((ptr % 2) == 1) && (leftEdge == 99999)) {   // means vowel
            var aaptr = Math.floor(ptr / 2);
            intonationArray[aaptr].width += width;
            leftEdge = intonationArray[aaptr].width;
          }
          ptr += 1;
        }
        for (i = 0; i < intonationArray.length; i++) {
          if (intonationArray[i].width > leftEdge) {
            intonationArray[i].width += width;
          }
        }
      }

      function shiftLeftArray(ptr, width) {
        var leftEdge = 99999;
        while(alternateArray[ptr] != 99999) {
          alternateArray[ptr] -= 1;
          if (((ptr % 2) == 1) && (leftEdge == 99999)) {   // means vowel
            var aaptr = Math.floor(ptr / 2);
            intonationArray[aaptr].width -= width;
            leftEdge = intonationArray[aaptr].width;
          }
          ptr += 1;
        }
        for (let i = 0; i < intonationArray.length; i++) {
          if (intonationArray[i].width > leftEdge) {
            intonationArray[i].width -= width;
          }
        }
      }

      function getRealWidth(str) {
        let tsmMgr = new TSMmanager(ctx, str);
        let textstruct = tsmMgr.analyse();
        return ctx.measureText(textstruct[0]).width;
      }

      function sentenceInput() {
        var text = " " + document.getElementById("intext").value;
//console.log("Prev|Current: " + prevText + "::" + text);
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoundary();

        if (prevText.length < text.length) {    // 文字が追加された
          var chptr = getInsertionPoint(prevText, text);
          var chtype = getCharType(text.charAt(chptr));
          var aaptr = getAAptr(chptr);
          var aafieldtype = ((aaptr % 2) == 1) ? "V" : "C";
//console.log("chp:" + chptr + "  chtyp:" + chtype + "  aap:" + aaptr + "  aatyp:" + aafieldtype);
          if (chtype == aafieldtype) {    // 同カテゴリー内の挿入である場合
//console.log("Path 1");
            shiftArray(aaptr+1, ctx.measureText(text.charAt(chptr)).width);   // 後続のAlternateArrayの開始文字をずらす
          } else {                                //  異カテゴリー内の挿入である場合
//console.log("Path 2");
            if (chptr == (text.length - 1)) {  // 最終文字として追加の場合（AAにchptrを追加）
//console.log("  Path 2 last");
              alternateArray.splice(aaptr+1, 0, chptr);   // chptr 追加
              if (chtype == "V") {          // 最終文字として追加、母音の場合にはintonationArrayを追加する
//console.log("  Path 2 last Vowel");
                var width = getRealWidth(text.substr(0, chptr))
                              + ctx.measureText(text.substr(chptr, 1)).width / 2.0;
                intonationArray.push(new ToneNote(width, getCircleHeight(weakSize, 0), weakSize, 0));
              }
            } else if (alternateArray[aaptr+1] == chptr) {  // 次のクラスターの先頭（＝現在のクラスターの末尾）の場合
//console.log("  Path 2 Next head");
              shiftArray(aaptr+2, ctx.measureText(text.charAt(chptr)).width);   // 以降のAlternateArrayの開始文字をずらす
            } else if (alternateArray[aaptr] == chptr) {    // 現在のクラスターの先頭の場合
//console.log("  Path 2 Current head");
//              alternateArray[aaptr] += 1;
              shiftArray(aaptr, ctx.measureText(text.charAt(chptr)).width); // 
            } else {                            // 現在のクラスターの中間にある場合
//console.log("Path 3");
              if (chtype == "V") {    // CVC
//console.log("  Path 3 CVC");
                alternateArray.splice(aaptr+1, 0, chptr);
                alternateArray.splice(aaptr+2, 0, chptr+1);
                var width = getRealWidth(text.substr(0, chptr))
                              + ctx.measureText(text.substr(chptr, 1)).width / 2.0;
                intonationArray.splice(Math.floor(aaptr/2), 0, new ToneNote(width, getCircleHeight(weakSize, 0), weakSize,0));
                shiftArray(aaptr+3, ctx.measureText(text.charAt(chptr)).width);
              } else {                    // VCV
//console.log("  Path 3 VCV");
                alternateArray.splice(aaptr+1, 0, chptr);
                alternateArray.splice(aaptr+2, 0, chptr+1);
                var width = getRealWidth(text.substr(0, chptr))
                              + ctx.measureText(text.substr(chptr, 1)).width / 2.0;
                var adj = intonationArray[Math.floor(aaptr/2)];
                var newObj = new ToneNote(width, adj.height, adj.size, adj.pattern);
                intonationArray.splice(Math.floor(aaptr/2)+1, 0, newObj);
                shiftArray(aaptr+3, ctx.measureText(text.charAt(chptr)).width);
              }
            }
          }
        } else if (prevText.length > text.length) {  // a character deleted
//console.log("Path Del");
          var chptr = getDeletedPoint(prevText, text);
          var chtype = getCharType(prevText.charAt(chptr));
          var aaptr = getAAptr(chptr);
          var aafieldtype = ((aaptr % 2) == 1) ? "V" : "C";
//console.log("chp:" + chptr + "  chtyp:" + chtype + "  aap:" + aaptr + "  aatyp:" + aafieldtype);
//console.log("chptr:" + chptr);
//console.log("aaarray:" + alternateArray[aaptr]);
          if (chptr == alternateArray[aaptr]) {         // クラスターの先頭を削除
//console.log("  Path Del same area");
            if ((chptr+1) == alternateArray[aaptr+1]) {         // 単文字クラスターか？
//console.log("    Path Del next head");
              alternateArray.splice(aaptr, 2);
              intonationArray.splice(Math.floor(aaptr/2), 1);
            } else if (alternateArray[aaptr+1] == 99999) {      // 最終クラスターか？
//console.log("    Path Del last");
              alternateArray.splice(aaptr, 1);
              if (aafieldtype == "V") {
                intonationArray.splice(Math.floor(aaptr/2), 1);
              }
            }
            shiftLeftArray(aaptr, ctx.measureText(prevText.charAt(chptr)).width);
          } else {        // クラスターの中程を削除
            shiftLeftArray(aaptr+1, ctx.measureText(prevText.charAt(chptr)).width);
          }
        } else {  // t's ridiculous
        }

//        console.log(alternateArray);
//        console.log(intonationArray);

        prevText = text;
        redrawCanvas();

      }

      function getCircleHeight(size, toneLevel) {               // level=9  upper=96 low=150
        var lower = lowerLimit - size - (lineWidth / 2.0);    // 145
        var upper = upperLimit + size + (lineWidth / 2.0);  // 101
        var step = (lower - upper) / (maxLevel - 1);          // 5.5
        return lower - (step * toneLevel);
      }


      function redrawCanvas() {
        ctx.fillStyle = ColourBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var text = " " + document.getElementById("intext").value;
        var summon = document.getElementById("summon").checked;
        for (let i=0; i < intonationArray.length; i++) {
          ctx.beginPath();
          if (selPtr == i) {
            ctx.strokeStyle = ColourSelected;
            ctx.fillStyle = ColourSelected;
          } else {
            ctx.strokeStyle = ColourNormal;
            ctx.fillStyle = ColourNormal;
          }
          let elem = intonationArray[i];
          if (summon) {
            if (elem.visible == false) {
              ctx.strokeStyle = ColourSummoned;
              ctx.fillStyle = ColourSummoned;
              elem.draw(ctx, margin);
            } else {
              elem.draw(ctx, margin);
            }
          } else {
            if (elem.visible == true) {
              elem.draw(ctx, margin);
            }
          }
          ctx.stroke();
        }
        drawBoundary();
        let tsmMgr = new TSMmanager(ctx, text);
        let textStruct = tsmMgr.analyse();
        tsmMgr.draw(textStruct);
      }

      function drawBoundary() {
        ctx.strokeStyle = ColourNormal;
        ctx.fillStyle = ColourBackground;
        ctx.beginPath();
        ctx.moveTo(margin, upperLimit);
        ctx.lineTo(canvas.width - (margin * 2), upperLimit);
        ctx.moveTo(margin, lowerLimit);
        ctx.lineTo(canvas.width - (margin * 2), lowerLimit);
        ctx.stroke();
        ctx.strokeStyle = ColourBackground;
        ctx.fillStyle = ColourBackground;
        ctx.fillRect(0, 0, canvas.width, upperLimit-1);
        ctx.fillRect(0, lowerLimit+1, canvas.width, canvas.height - lowerLimit);
      }

      function assignToneStress(tone, stress) {
        intonationArray[selPtr].size = stress;
        intonationArray[selPtr].height = getCircleHeight(stress, tone);
      }

      function sendToTheShed() {
        intonationArray[selPtr].visible = false;
        nextAvailableSyllable();
        redrawCanvas();
      }

      function nextAvailableSyllable() {
        if ((selPtr == NotSelected) || (selPtr == intonationArray.length-1)) {
          selPtr = NotSelected;
          return;
        }
        selPtr += 1;
        while (selPtr < intonationArray.length) {
          let element = intonationArray[selPtr];
          if ((element.visible == true) && (element instanceof ToneNote))
            return;
          selPtr += 1;
        }
        selPtr = NotSelected;
      }

      function prevAvailableSyllable() {
        if (selPtr == NotSelected)
          return;
        selPtr -= 1;
        while (selPtr >= 0) {
          let element = intonationArray[selPtr];
          if ((element.visible == true) && (element instanceof ToneNote))
            return;
          selPtr -= 1;
        }
        selPtr = NotSelected;
      }

      function assignNucleusPattern(pattern) {
        if (selPtr == NotSelected) {   // nasty patch up in case of nothing is selected
          selPtr = intonationArray.length;
        }
        if (iap != selPtr) {
          prevAvailableSyllable();
        }
        intonationArray[selPtr].pattern = pattern;
        nextAvailableSyllable();
        redrawCanvas();
      }

      function setToneStress(tone, stress) {
        if (selPtr == NotSelected)
          return;
        assignToneStress(tone, stress);
        nextAvailableSyllable();
        redrawCanvas();
      }

      function fall() {
        assignNucleusPattern(1);
        redrawCanvas();
      }

      function riseFall() {
        assignNucleusPattern(3);
        redrawCanvas();
      }

      function rise() {
        assignNucleusPattern(4);
        redrawCanvas();
      }

      function fallRise() {
        assignNucleusPattern(6);
        redrawCanvas();
      }

      function midLevel() {
        assignNucleusPattern(7);
        redrawCanvas();
      }

      function notNucleus() {
        assignNucleusPattern(0);
        redrawCanvas();
      }

      function retrieveFromTheShed() {
        document.getElementById("separator1").checked = false;
        selPtr = NotSelected;
        redrawCanvas();
      }

      function separatorClicked() {
        document.getElementById("summon").checked = false;
      }

      function clearfield() {
        var intext = document.getElementById("intext");
        intext.value = "";
        intonationArray = [];   // [type, size, width, tone, nucleusType]
        iap = 0;
        selPtr = NotSelected;
        alternateArray = [0, 99999];   // with a sentinel
        prevText = " ";   // with a sentinel
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoundary();
        intext.focus();
      }

      function saveImage() {
        selPtr = NotSelected;
        redrawCanvas();
        var base64 = canvas.toDataURL("image/jpeg");
        document.getElementById("download").href = base64;
      }

      function saveHalfImage() {
        selPtr = NotSelected;
        redrawCanvas();
        var half = document.getElementById("canvas2");
        half.width = canvas.width;
        half.height = 53
        var image = ctx.getImageData(0, 35, canvas.width, 53);
        half.getContext("2d").putImageData(image, 0, 0);
        var base64 = canvas2.toDataURL("image/jpeg");
        document.getElementById("download2").href = base64;
      }

      function newCanvasWidth() {
        canvas = document.getElementById("canvas");
        canvas.width = document.getElementById("canvaswidth").value;
        ctx = canvas.getContext("2d");
        rect = canvas.getBoundingClientRect();
        ctx.font = "24pt Arial";
        ctx.strokeStyle = ColourNormal;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = ColourNormal;
        redrawCanvas();
      }
