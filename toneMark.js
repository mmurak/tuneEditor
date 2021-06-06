// this module needs margin

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
    this.context.strokeStyle = ColourNormal;
    this.context.fillStyle = ColourNormal;
    this.context.fillText(textstruct[0], margin, 70);
    textstruct[1].forEach(elem => {
      elem.draw(this.context);
    });
    textstruct[2].forEach(elem => {
      elem.draw(this.context);
    });
    this.context.stroke();
  }
}
