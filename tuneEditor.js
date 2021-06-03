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

      var alternateArray = [0, 99999];   // with a sentinel
      var prevText = " ";   // with a sentinel

      var mouseDown = false;





class ToneMark {
  constructor(width) {
    this.width = width;
  }
  drawCircle(context) {
    context.beginPath();
    context.arc(margin+this.width+this.deltaX, 70+this.deltaY, 3, 0, Math.PI*2);
    context.stroke();
  }
  drawVerticalLine(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX, 70+this.deltaY+8.0);
    context.stroke();
  }
  drawHorizontalLine(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX+10.0, 70+this.deltaY);
    context.stroke();
  }
  drawAscendingBar(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX, 70+this.deltaY+8);
    context.lineTo(margin+this.width+this.deltaX+8, 70+this.deltaY);
    context.stroke();
  }
  drawAscendingArrowHead(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX+4, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX+8, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX+8, 70+this.deltaY+4);
    context.stroke();
  }
  drawDescendingBar(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX+8, 70+this.deltaY+8);
    context.stroke();
  }
  drawDescendingArrowHead(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX+4, 70+this.deltaY+8);
    context.lineTo(margin+this.width+this.deltaX+8, 70+this.deltaY+8);
    context.lineTo(margin+this.width+this.deltaX+8, 70+this.deltaY+4);
    context.stroke();
  }
  drawMountain(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX - 8.0, 70+this.deltaY + 4.0);
    context.lineTo(margin+this.width+this.deltaX - 4.0, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX, 70+this.deltaY+4.0);
    context.stroke();
  }
  drawValley(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX - 8.0, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX - 4.0, 70+this.deltaY+4.0);
    context.lineTo(margin+this.width+this.deltaX, 70+this.deltaY);
    context.stroke();
  }
  drawBendedLine(context) {
    context.beginPath();
    context.moveTo(margin+this.width+this.deltaX - 4.0, 70+this.deltaY);
    context.lineTo(margin+this.width+this.deltaX, 70+this.deltaY+4.0);
    context.lineTo(margin+this.width+this.deltaX-4.0, 70+this.deltaY+8.0);
    context.stroke();
  }
}

class LowRise extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 0.0;
    this.deltaY = -4.0;
  }
  draw(context) {
    super.drawAscendingBar(context);
  }
}

class HighRise extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 0.0;
    this.deltaY = -22.0;
  }
  draw(context) {
    super.drawAscendingBar(context);
  }
}

class LowFall extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 0.0;
    this.deltaY = -4.0;
  }
  draw(context) {
    super.drawDescendingBar(context);
  }
}

class HighFall extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 0.0;
    this.deltaY = -22.0;
  }
  draw(context) {
    super.drawDescendingBar(context);
  }
}

class RiseFall extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX =  8.0;
    this.deltaY =  -20.0;
  }
  draw(context) {
    super.drawMountain(context);
  }
}

class FallRise extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 8.0;
    this.deltaY = -20.0;
  }
  draw(context) {
    super.drawValley(context);
  }
}

class MidLevel extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 6.0;
    this.deltaY = -20.0;
  }
  draw(context) {
    super.drawBendedLine(context);
  }
}

class HighStressed1 extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 7.0;
    this.deltaY = -25.0;
  }
  draw(context) {
    super.drawVerticalLine(context);
  }
}

class HighStressed2 extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 5.0;
    this.deltaY = -22.0;
  }
  draw(context) {
    super.drawCircle(context);
  }
}

class HighStressed3 extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 0.0;
    this.deltaY = -25.0;
  }
  draw(context) {
    super.drawDescendingBar(context);
    super.drawDescendingArrowHead(context);
  }
}

class LowStressed1 extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 7.0;
    this.deltaY = -5.0;
  }
  draw(context) {
    super.drawVerticalLine(context);
  }
}

class LowStressed2 extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 5.0;
    this.deltaY = -2.0;
  }
  draw(context) {
    super.drawCircle(context);
  }
}

class LowStressed3 extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = 0.0;
    this.deltaY = -5.0;
  }
  draw(context) {
    super.drawAscendingBar(context);
    super.drawAscendingArrowHead(context);
  }
}

class HighPrehead extends ToneMark {
  constructor(width) {
    super(width);
    this.deltaX = -3.0;
    this.deltaY = -22.0;
  }
  draw(context) {
    super.drawHorizontalLine(context);
  }
}

class SyllabicConsonant extends ToneMark {
  constructor(width) {
    super(width);
  }
  draw(context) {
  }
}

class Underline extends ToneMark {
  constructor(start, width) {
    super(width);
    this.start = start;
    this.deltaY = 2.0;
  }
  draw(context) {
    context.beginPath();
    context.moveTo(margin+this.start, 70+this.deltaY);
    context.lineTo(margin+this.width, 70+this.deltaY);
    context.stroke();
  }
}



class TSMmanager {
  constructor(context, intext) {
    this.context = context;
    this.intext = intext;
  }

  getWidth(str) {
    return this.context.measureText(str).width;
  }

  analyse() {
    const prefix = "''";    // double single quotes
    const regexp = new RegExp(prefix);
    const dict = new Map([["lr", LowRise], ["hr", HighRise], ["lf", LowFall], ["hf", HighFall],
                                    ["rf", RiseFall], ["fr", FallRise], ["ml", MidLevel],
                                    ["h1", HighStressed1], ["h2", HighStressed2], ["h3", HighStressed3],
                                    ["l1", LowStressed1], ["l2", LowStressed2], ["l3", LowStressed3],
                                    ["hh", HighPrehead], ["aa", SyllabicConsonant]]);
    let chunks = this.intext.split(regexp);
    let outtext = "";
    let tsmArray = [];
    let ulArray = [];
    let underlineStart = 0;
    chunks.forEach(elem => {
      let ctrlCh = elem.substr(0, 2);
      let rest = elem.substr(2);
      if (dict.has(ctrlCh)) {
        tsmArray.push(new (dict.get(ctrlCh))(this.getWidth(outtext)));
        if (ctrlCh == "aa") {   // ad hoc patch up
          outtext += rest;
        } else {
          outtext += " " + rest;    // put filler + characters
        }
      } else if (ctrlCh == "bs") {    // start-marker for underline
        underlineStart = this.getWidth(outtext);
        outtext += rest;
      } else if (ctrlCh == "bf") {    // end-marker for underline
        ulArray.push(new Underline(underlineStart, this.getWidth(outtext)));
        outtext += rest;
      } else {
        outtext += (outtext == "") ? elem : prefix + elem;    // put prefix except 1st chunk
      }
    });
    return [outtext, tsmArray, ulArray];
  }

  draw(textstruct) {
    this.context.fillText(textstruct[0], margin, 70);
    textstruct[1].forEach(elem => {
      elem.draw(this.context);
    });
    textstruct[2].forEach(elem => {
      elem.draw(this.context);
    });
  }
}





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
              intonationArray.push([separator, 0, coordX, 0, 0]);
            } else {
              if (intonationArray.length == 0)
                return;
              var delta = 99999;
              iap = 0;
              if (document.getElementById("summon").checked == false) {
                for (i = 0; i < intonationArray.length; i++) {
                  if (intonationArray[i][0] >= 10)
                    continue;
                  tempDelta = Math.abs(intonationArray[i][2] + margin - coordX);
                  if (tempDelta < delta) {
                    iap = i;
                    delta = tempDelta;
                  }
                }
                if (selectionSet.has(iap)) {
                  selectionSet.clear();
                } else {
                  selectionSet.clear();
                  selectionSet.add(iap);
                }
              } else {    // summon process
                for (i = 0; i < intonationArray.length; i++) {
                  if (intonationArray[i][0] < 10)
                    continue;
                  tempDelta = Math.abs(intonationArray[i][2] + margin - coordX);
                  if (tempDelta < delta) {
                    iap = i;
                    delta = tempDelta;
                  }
                }
                switch (intonationArray[iap][0]) {
                  case toneCircleAtTheShed:
                    intonationArray[iap][0] = toneCircle;
                    break;
                  case separatorAtTheShed:
                    intonationArray[iap][0] = separator;
                    break;
                  default:
                }
                selectionSet.clear();
              }
            }
            document.getElementById("summon").checked = false;
            redrawCanvas();
        });
        canvas.addEventListener("mouseup", function (evt) {
          mouseDown = false;
        });
        canvas.addEventListener("mousemove", function (evt) {
            if (!mouseDown || selectionSet.size == 0)
              return;
            var coordX = evt.clientX - rect.left;
            var idx;
            for (idx of selectionSet.values()) {};
            intonationArray[idx][2] = coordX - margin;
            redrawCanvas();
        });
        canvas.oncontextmenu = function (evt) {
            mouseDown = false;
            selectionSet.clear();
            redrawCanvas();
            return false;
        };
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
            intonationArray[aaptr][2] += width;
            leftEdge = intonationArray[aaptr][2];
          }
          ptr += 1;
        }
        for (i = 0; i < intonationArray.length; i++) {
          if (intonationArray[i][2] > leftEdge) {
            intonationArray[i][2] += width;
          }
        }
      }

      function shiftLeftArray(ptr, width) {
        var leftEdge = 99999;
        while(alternateArray[ptr] != 99999) {
          alternateArray[ptr] -= 1;
          if (((ptr % 2) == 1) && (leftEdge == 99999)) {   // means vowel
            var aaptr = Math.floor(ptr / 2);
            intonationArray[aaptr][2] -= width;
            leftEdge = intonationArray[aaptr][2];
          }
          ptr += 1;
        }
        for (i = 0; i < intonationArray.length; i++) {
          if (intonationArray[i][2] > leftEdge) {
            intonationArray[i][2] -= width;
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
                intonationArray.push([toneCircle, weakSize, width, 0, 0]);
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
                intonationArray.splice(Math.floor(aaptr/2), 0, [toneCircle, weakSize, width, 0, 0]);
                shiftArray(aaptr+3, ctx.measureText(text.charAt(chptr)).width);
              } else {                    // VCV
//console.log("  Path 3 VCV");
                alternateArray.splice(aaptr+1, 0, chptr);
                alternateArray.splice(aaptr+2, 0, chptr+1);
                var width = getRealWidth(text.substr(0, chptr))
                              + ctx.measureText(text.substr(chptr, 1)).width / 2.0;
                var adj = intonationArray[Math.floor(aaptr/2)];
                intonationArray.splice(Math.floor(aaptr/2)+1, 0,
                  [adj[0], adj[1], width, adj[3], adj[4]]);
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

      function getCircleHeight(size, toneLevel) {
        var lower = lowerLimit - size - (lineWidth / 2.0);
        var upper = upperLimit + size + (lineWidth / 2.0);
        var step = (lower - upper) / (maxLevel - 1);
        return lower - (step * toneLevel);
      }

      function drawCircle(size, width, toneLevel, nucleusType) {
        var h = getCircleHeight(size, toneLevel)
        ctx.beginPath();
        ctx.arc(width, h, size, 0, Math.PI * 2, true);
        ctx.fill();
        switch (nucleusType) {
          case 1 :  // Low/High-Fall
            ctx.moveTo(width, h);
            ctx.bezierCurveTo(width + (size * 1.5), lowerLimit - (lowerLimit - h) / 2.0, width + (size * 2), lowerLimit - (lowerLimit - h) / 2.0, width + (size * 2), lowerLimit);
            break;
          case 3 :  // Rise-Fall
            ctx.moveTo(width, h);
            var cy = Math.max(upperLimit, h - (size * 2));
            ctx.bezierCurveTo(width + size, cy - size, width + (size * 2), cy, width + (size * 2), lowerLimit);
            break;
          case 4 :  // Low/High-Rise
            ctx.moveTo(width, h);
            var endPoint = (h - upperLimit) * 0.5 + upperLimit; //    Math.max(upperLimit, h - (size * 2));
            ctx.bezierCurveTo(width + (stressedSize * 1.5), h, width + (stressedSize * 2.0), h - (h - endPoint) * 0.5, width + (stressedSize*2.0), endPoint);
            break;
          case 6 :  // Fall-Rise
            ctx.moveTo(width + size, h);
            var endPoint = Math.max(upperLimit, h - (size * 2));
            var hpu = lowerLimit - (lowerLimit - h) * 0.75;
            var hpm = lowerLimit - (lowerLimit - h) * 0.5;
            var hpml = lowerLimit - (lowerLimit - h) * 0.375;
            var hpl = lowerLimit - (lowerLimit - h) * 0.25;
            ctx.bezierCurveTo(
              width + (size*1.5), h,
              width + (size*1.5), hpu,
              width + (size*1.5), hpm);
            ctx.bezierCurveTo(
              width + (size * 1.5), lowerLimit+(stressedSize*(toneLevel/10.0)),
              width + (size * 3.0), lowerLimit+(stressedSize*(toneLevel/10.0)),
              width + (size * 3.0), hpml);
            break;
          case 7 :  // Mid-Level
            ctx.moveTo(width, h);
            ctx.lineTo(width + (size * 3), h);
            break;
        }
        ctx.stroke();
      }


      function redrawCanvas() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(0, 0, 0)";
        var text = " " + document.getElementById("intext").value;

        let tsmMgr = new TSMmanager(ctx, text);
        let textStruct = tsmMgr.analyse();
        tsmMgr.draw(textStruct);

        drawBoundary();
        var summon = document.getElementById("summon").checked;
        for (i = 0; i < intonationArray.length; i++) {
          var color = (selectionSet.has(i)) ? "rgb(255, 0, 0)" : "rgb(0, 0, 0)";
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          switch (intonationArray[i][0]) {
            case toneCircle :
              drawCircle(intonationArray[i][1], intonationArray[i][2]+margin, intonationArray[i][3], intonationArray[i][4]);
              break;
            case separator :
              ctx.beginPath();
              ctx.moveTo(intonationArray[i][2], upperLimit);
              ctx.lineTo(intonationArray[i][2], lowerLimit);
              ctx.stroke();
              break;
            case toneCircleAtTheShed :
              if (summon) {
                color = "rgb(128, 128, 255)";
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                drawCircle(intonationArray[i][1], intonationArray[i][2]+margin, intonationArray[i][3], intonationArray[i][4]);
              }
              break;
            case separatorAtTheShed :
              if (summon) {
                color = "rgb(128, 128, 255)";
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(intonationArray[i][2], upperLimit);
                ctx.lineTo(intonationArray[i][2], lowerLimit);
                ctx.stroke();
              }
              break;
            default:
          }
          ctx.strokeStyle = "rgb(0, 0, 0)";
          ctx.fillStyle = "rgb(0, 0, 0)";
        }
      }

      function drawBoundary() {
        ctx.moveTo(margin, upperLimit);
        ctx.lineTo(canvas.width - (margin * 2), upperLimit);
        ctx.moveTo(margin, lowerLimit);
        ctx.lineTo(canvas.width - (margin * 2), lowerLimit);
        ctx.stroke();
      }

      function assignToneStress(tone, stress) {
        for (let item of selectionSet.values()) {
          intonationArray[item][1] = stress;
          intonationArray[item][3] = tone;
        }
      }

      function sendToTheShed() {
        for (let item of selectionSet.values()) {
          var currentType = intonationArray[item][0];
          switch (currentType) {
            case toneCircle:
              intonationArray[item][0] = toneCircleAtTheShed;
              break;
            case separator:
              intonationArray[item][0] = separatorAtTheShed;
              break;
            default:
          }
        }
        nextAvailableSyllable();
        redrawCanvas();
      }

      function nextAvailableSyllable() {
        var idx;
        for (idx of selectionSet.values()) {};
        idx += 1;
        selectionSet.clear();
        while((idx < intonationArray.length) && (intonationArray[idx][0] >= 10)) {
          idx += 1;
        }
        if (intonationArray.length > idx) {
          selectionSet.add(idx);
        }
      }

      function prevAvailableSyllable() {
        var idx;
        for (idx of selectionSet.values()) {};
        if (idx == iap) return;   // It's for direct pattern modification.
        idx -= 1;
        selectionSet.clear();
        while((idx >= 0) && (intonationArray[idx][0] >= 10)) {
          idx -= 1;
        }
        if (idx >= 0) {
          selectionSet.add(idx);
        }
      }

      function assignNucleusPattern(pattern) {
        prevAvailableSyllable();
        if (selectionSet.size == 0) {   // nasty patch up in case of nothing is selected
          var j = intonationArray.length - 1;
          while (intonationArray[j][0] != toneCircle) {
            j -= 1;
          }
          selectionSet.add(j);
        }
        for (let item of selectionSet.values()) {
          intonationArray[item][4] = pattern;
        }
        nextAvailableSyllable();
        redrawCanvas();
      }

      function setToneStress(tone, stress) {
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
        selectionSet = new Set();
        alternateArray = [0, 99999];   // with a sentinel
        prevText = " ";   // with a sentinel
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoundary();
        intext.focus();
      }

      function saveImage() {
        selectionSet = new Set();
        redrawCanvas();
        var base64 = canvas.toDataURL("image/jpeg");
        document.getElementById("download").href = base64;
      }

      function saveHalfImage() {
        selectionSet = new Set();
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
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = "rgb(0, 0, 0)";
        redrawCanvas();
      }
