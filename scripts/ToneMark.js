// this module needs margin

class ToneMark {
  constructor(margin, vmargin) {
    this.margin = margin;
    this.vmargin = vmargin;
  }
  drawCircle(context, width) {
    context.beginPath();
    context.arc(this.margin+width+this.deltaX, this.vmargin+this.deltaY, 3, 0, Math.PI*2);
    context.stroke();
  }
  drawVerticalLine(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY+8.0);
    context.stroke();
  }
  drawLargeVerticalLine(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY+30.0);
    context.stroke();
  }
  drawHorizontalLine(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX+10.0, this.vmargin+this.deltaY);
    context.stroke();
  }
  drawAscendingBar(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY+8);
    context.lineTo(this.margin+width+this.deltaX+8, this.vmargin+this.deltaY);
    context.stroke();
  }
  drawAscendingArrowHead(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX+4, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX+8, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX+8, this.vmargin+this.deltaY+4);
    context.stroke();
  }
  drawDescendingBar(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX+8, this.vmargin+this.deltaY+8);
    context.stroke();
  }
  drawDescendingArrowHead(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX+4, this.vmargin+this.deltaY+8);
    context.lineTo(this.margin+width+this.deltaX+8, this.vmargin+this.deltaY+8);
    context.lineTo(this.margin+width+this.deltaX+8, this.vmargin+this.deltaY+4);
    context.stroke();
  }
  drawMountain(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX - 8.0, this.vmargin+this.deltaY + 4.0);
    context.lineTo(this.margin+width+this.deltaX - 4.0, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY+4.0);
    context.stroke();
  }
  drawValley(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX - 8.0, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX - 4.0, this.vmargin+this.deltaY+4.0);
    context.lineTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY);
    context.stroke();
  }
  drawBendedLine(context, width) {
    context.beginPath();
    context.moveTo(this.margin+width+this.deltaX - 4.0, this.vmargin+this.deltaY);
    context.lineTo(this.margin+width+this.deltaX, this.vmargin+this.deltaY+4.0);
    context.lineTo(this.margin+width+this.deltaX-4.0, this.vmargin+this.deltaY+8.0);
    context.stroke();
  }
  size() {    // default value, override the value if necessary
    return 1;
  }
  getClassName() {
    return this.constructor.name;
  }
}

class LowRise extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 2.0;
    this.deltaY = -4.0;
  }
  draw(context, width) {
    super.drawAscendingBar(context, width);
  }
}

class HighRise extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 2.0;
    this.deltaY = -22.0;
  }
  draw(context, width) {
    super.drawAscendingBar(context, width);
  }
}

class LowFall extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 2.0;
    this.deltaY = -4.0;
  }
  draw(context, width) {
    super.drawDescendingBar(context, width);
  }
}

class HighFall extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 2.0;
    this.deltaY = -22.0;
  }
  draw(context, width) {
    super.drawDescendingBar(context, width);
  }
}

class RiseFall extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX =  10.0;
    this.deltaY =  -20.0;
  }
  draw(context, width) {
    super.drawMountain(context, width);
  }
}

class FallRise extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 10.0;
    this.deltaY = -20.0;
  }
  draw(context, width) {
    super.drawValley(context, width);
  }
}

class MidLevel extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 8.0;
    this.deltaY = -20.0;
  }
  draw(context, width) {
    super.drawBendedLine(context, width);
  }
}

class HighStressed1 extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 7.0;
    this.deltaY = -25.0;
  }
  draw(context, width) {
    super.drawVerticalLine(context, width);
  }
}

class HighStressed2 extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 5.0;
    this.deltaY = -22.0;
  }
  draw(context, width) {
    super.drawCircle(context, width);
  }
}

class HighStressed3 extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 0.0;
    this.deltaY = -25.0;
  }
  draw(context, width) {
    super.drawDescendingBar(context, width);
    super.drawDescendingArrowHead(context, width);
  }
}

class LowStressed1 extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 7.0;
    this.deltaY = -5.0;
  }
  draw(context, width) {
    super.drawVerticalLine(context, width);
  }
}

class LowStressed2 extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 5.0;
    this.deltaY = -2.0;
  }
  draw(context, width) {
    super.drawCircle(context, width);
  }
}

class LowStressed3 extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 0.0;
    this.deltaY = -5.0;
  }
  draw(context, width) {
    super.drawAscendingBar(context, width);
    super.drawAscendingArrowHead(context, width);
  }
}

class HighPrehead extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = -3.0;
    this.deltaY = -22.0;
  }
  draw(context, width) {
    super.drawHorizontalLine(context, width);
  }
}

class LowPrehead extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = -3.0;
    this.deltaY = 0.0;
  }
  draw(context, width) {
    super.drawHorizontalLine(context, width);
  }
}

class IP extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    super.drawLargeVerticalLine(context, width+2);
  }
  drawSuperScript(context, width, ch) {
    let fontSaver = context.font;
    let strokeSaver = context.strokeStyle;
    let fillSaver = context.fillStyle;
    context.font = "15pt \"Courier\"";
    context.strokeStyle = "#f00";
    context.fillStyle = "#f00";
    context.fillText(ch, this.margin + width, this.vmargin - 35);
    context.font = fontSaver;
    context.strokeStyle = strokeSaver;
    context.fillStyle = fillSaver;
  }
}

class IP0 extends IP {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "0");
  }
}

class IP1 extends IP {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "1");
  }
}

class IP2 extends IP {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "2");
  }
}

class IP3 extends IP {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "3");
  }
}

class FullStop extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    super.drawLargeVerticalLine(context, width);
    super.drawLargeVerticalLine(context, width+4);
  }
  drawSuperScript(context, width, ch) {
    let fontSaver = context.font;
    let strokeSaver = context.strokeStyle;
    let fillSaver = context.fillStyle;
    context.font = "15pt \"Courier\"";
    context.strokeStyle = "#f00";
    context.fillStyle = "#f00";
    context.fillText(ch, this.margin + width, this.vmargin - 35);
    context.font = fontSaver;
    context.strokeStyle = strokeSaver;
    context.fillStyle = fillSaver;
  }
}

class FullStop0 extends FullStop {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "0");
  }
}

class FullStop1 extends FullStop {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "1");
  }
}

class FullStop2 extends FullStop {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "2");
  }
}

class FullStop3 extends FullStop {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
    super.draw(context, width);
    super.drawSuperScript(context, width,  "3");
  }
}

// Solid 3 lines
class Solid3Line extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    super.drawLargeVerticalLine(context, width-2);
    super.drawLargeVerticalLine(context, width+2);
    super.drawLargeVerticalLine(context, width+6);
  }
}

// Solid 4 lines
class Solid4Line extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    super.drawLargeVerticalLine(context, width);
    let lineWidthSaver = context.lineWidth;
    context.lineWidth = 4;
    super.drawLargeVerticalLine(context, width+5);
    context.lineWidth = lineWidthSaver;
  }
}

// Dashed lines
class Dashed1Line extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    context.setLineDash([2, 2]);
    super.drawLargeVerticalLine(context, width+2);
    context.setLineDash([]);
  }
}

class Dashed2Line extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    context.setLineDash([2, 2]);
    super.drawLargeVerticalLine(context, width);
    super.drawLargeVerticalLine(context, width+4);
    context.setLineDash([]);
  }
}

class Dashed3Line extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    context.setLineDash([2, 2]);
    super.drawLargeVerticalLine(context, width-2);
    super.drawLargeVerticalLine(context, width+2);
    super.drawLargeVerticalLine(context, width+6);
    context.setLineDash([]);
  }
}

class Dashed4Line extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
    this.deltaX = 4.0;
    this.deltaY = -28.0;
  }
  draw(context, width) {
    context.setLineDash([2, 2]);
    super.drawLargeVerticalLine(context, width);
    context.setLineDash([]);
    let lineWidthSaver = context.lineWidth;
    context.lineWidth = 4;
    super.drawLargeVerticalLine(context, width+5);
    context.lineWidth = lineWidthSaver;
  }
}

// Syllabic Consonant
class SyllabicConsonant extends ToneMark {
  constructor(margin, vmargin) {
    super(margin, vmargin);
  }
  draw(context, width) {
  }
  size() {
    return 0;
  }
}





class TSMmanager {
  constructor(margin, vmargin) {
    this.margin = margin;
    this.vmargin = vmargin;
    this.tsmArray = [];
    this.dict = new Map([["lr", LowRise], ["hr", HighRise], ["lf", LowFall], ["hf", HighFall],
                                    ["rf", RiseFall], ["fr", FallRise], ["ml", MidLevel],
                                    ["h1", HighStressed1], ["h2", HighStressed2], ["h3", HighStressed3],
                                    ["l1", LowStressed1], ["l2", LowStressed2], ["l3", LowStressed3],
                                    ["hp", HighPrehead], ["lp", LowPrehead],
                                    ["aa", SyllabicConsonant],
                                    ["fs", FullStop],
                                    ["fs0", FullStop0],
                                    ["fs1", FullStop1],
                                    ["fs2", FullStop2],
                                    ["fs3", FullStop3],
                                    ["ip", IP],
                                    ["ip0", IP0],
                                    ["ip1", IP1],
                                    ["ip2", IP2],
                                    ["ip3", IP3],
                                    ["s3l", Solid3Line],
                                    ["s4l", Solid4Line],
                                    ["d1l", Dashed1Line],
                                    ["d2l", Dashed2Line],
                                    ["d3l", Dashed3Line],
                                    ["d4l", Dashed4Line],
                                    ]);
  }

  register(ptr, mkStr) {
    this.tsmArray.push([ptr, new (this.dict.get(mkStr))(this.margin, this.vmargin)]);
  }

  eraseRegion(start, finish) {
    let newArray = [];
    let chs = finish - start;
    for (let i = 0; i < this.tsmArray.length; i++) {
      let pair = this.tsmArray[i];
      if ((start <= pair[0]+1) && (pair[0]+1 <= finish)) {
        // nop delete
      } else if (start < pair[0]+1) {   // shift position
        newArray.push([pair[0] - chs, pair[1]]);
      } else {
        newArray.push(pair);
      }
    }
    this.tsmArray = newArray;
  }

  insertCh(ptr, len) {
    let newArray = [];
    for (let i = 0; i < this.tsmArray.length; i++) {
      let pair = this.tsmArray[i];
      if (ptr <= pair[0]) {
        newArray.push([pair[0]+len, pair[1]]);
      } else {
        newArray.push(pair);
      }
    }
    this.tsmArray = newArray;
  }

  backspaceCh(ptr) {
    let newArray = [];
    for (let i = 0; i < this.tsmArray.length; i++) {
      let pair = this.tsmArray[i];
      if (ptr < pair[0]+1) {
        newArray.push([pair[0]-1, pair[1]]);
      } else if (ptr == pair[0]+1) {
        // nop
      } else {
        newArray.push(pair);
      }
    }
    this.tsmArray = newArray;
  }

  deleteCh(ptr) {
    let newArray = [];
    for (let i = 0; i < this.tsmArray.length; i++) {
      let pair = this.tsmArray[i];
      if (ptr < pair[0]) {
        newArray.push([pair[0]-1, pair[1]]);
      } else if (ptr == pair[0]) {
        // nop
      } else {
        newArray.push(pair);
      }
    }
    this.tsmArray = newArray;
  }

  clear() {
    this.tsmArray = [];
  }

  draw(context, textdata) {
    for (let i = 0; i < this.tsmArray.length; i++) {
      let pair = this.tsmArray[i];
      let width = context.measureText(textdata.substr(0, pair[0])).width;
      pair[1].draw(context, width);
    }
  }

  pickExtraSpace() {
    let spaceArray = {};
    for(let i = 0; i < this.tsmArray.length; i++) {
      if (this.tsmArray[i][1].size() == 1) {
        spaceArray[this.tsmArray[i][0]] = true;
      }
    }
    return spaceArray;
  }
}
