class TSMsymbol {
    constructor() {
    }
    drawCircle(context, margin, vmargin, width) {
        context.beginPath();
        context.arc(margin+width+this.deltaX, vmargin+this.deltaY, 3, 0, Math.PI*2);
        context.stroke();
    }
    drawVerticalLine(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX, vmargin+this.deltaY+8.0);
        context.stroke();
    }
    drawLargeVerticalLine(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX, vmargin+this.deltaY+30.0);
        context.stroke();
    }
    drawHorizontalLine(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX+10.0, vmargin+this.deltaY);
        context.stroke();
    }
    drawAscendingBar(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX, vmargin+this.deltaY+8);
        context.lineTo(margin+width+this.deltaX+8, vmargin+this.deltaY);
        context.stroke();
    }
    drawAscendingArrowHead(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX+4, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX+8, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX+8, vmargin+this.deltaY+4);
        context.stroke();
    }
    drawDescendingBar(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX+8, vmargin+this.deltaY+8);
        context.stroke();
    }
    drawDescendingArrowHead(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX+4, vmargin+this.deltaY+8);
        context.lineTo(margin+width+this.deltaX+8, vmargin+this.deltaY+8);
        context.lineTo(margin+width+this.deltaX+8, vmargin+this.deltaY+4);
        context.stroke();
    }
    drawMountain(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX - 8.0, vmargin+this.deltaY + 4.0);
        context.lineTo(margin+width+this.deltaX - 4.0, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX, vmargin+this.deltaY+4.0);
        context.stroke();
    }
    drawValley(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX - 8.0, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX - 4.0, vmargin+this.deltaY+4.0);
        context.lineTo(margin+width+this.deltaX, vmargin+this.deltaY);
        context.stroke();
    }
    drawBendedLine(context, margin, vmargin, width) {
        context.beginPath();
        context.moveTo(margin+width+this.deltaX - 4.0, vmargin+this.deltaY);
        context.lineTo(margin+width+this.deltaX, vmargin+this.deltaY+4.0);
        context.lineTo(margin+width+this.deltaX-4.0, vmargin+this.deltaY+8.0);
        context.stroke();
    }
    size() {    // default value, override the value if necessary
        return 1;
    }
    getClassName() {
        return this.constructor.name;
    }
}

class LowRise extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 2.0;
        this.deltaY = -4.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawAscendingBar(context, margin, vmargin, width);
    }
}

class HighRise extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 2.0;
        this.deltaY = -22.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawAscendingBar(context, margin, vmargin, width);
    }
}

class LowFall extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 2.0;
        this.deltaY = -4.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawDescendingBar(context, margin, vmargin, width);
    }
}

class HighFall extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 2.0;
        this.deltaY = -22.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawDescendingBar(context, margin, vmargin, width);
    }
}

class RiseFall extends TSMsymbol {
    constructor() {
        super();
        this.deltaX =  10.0;
        this.deltaY =  -20.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawMountain(context, margin, vmargin, width);
    }
}

class FallRise extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 10.0;
        this.deltaY = -20.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawValley(context, margin, vmargin, width);
    }
}

class MidLevel extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 8.0;
        this.deltaY = -20.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawBendedLine(context, margin, vmargin, width);
    }
}

class HighStressed1 extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 7.0;
        this.deltaY = -25.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawVerticalLine(context, margin, vmargin, width);
    }
}

class HighStressed2 extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 5.0;
        this.deltaY = -22.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawCircle(context, margin, vmargin, width);
    }
}

class HighStressed3 extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 0.0;
        this.deltaY = -25.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawDescendingBar(context, margin, vmargin, width);
        super.drawDescendingArrowHead(context, margin, vmargin, width);
    }
}

class LowStressed1 extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 7.0;
        this.deltaY = -5.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawVerticalLine(context, margin, vmargin, width);
    }
}

class LowStressed2 extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 5.0;
        this.deltaY = -2.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawCircle(context, margin, vmargin, width);
    }
}

class LowStressed3 extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 0.0;
        this.deltaY = -5.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawAscendingBar(context, margin, vmargin, width);
        super.drawAscendingArrowHead(context, margin, vmargin, width);
    }
}

class HighPrehead extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = -3.0;
        this.deltaY = -22.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawHorizontalLine(context, margin, vmargin, width);
    }
}

class LowPrehead extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = -3.0;
        this.deltaY = 0.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawHorizontalLine(context, margin, vmargin, width);
    }
}

class IP extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawLargeVerticalLine(context, margin, vmargin, width+2);
    }
    drawSuperScript(context, margin, vmargin, width, ch) {
        let fontSaver = context.font;
        let strokeSaver = context.strokeStyle;
        let fillSaver = context.fillStyle;
        context.font = "15pt \"Courier\"";
        context.strokeStyle = "#f00";
        context.fillStyle = "#f00";
        context.fillText(ch, margin + width, vmargin - 35);
        context.font = fontSaver;
        context.strokeStyle = strokeSaver;
        context.fillStyle = fillSaver;
    }
}

class IP0 extends IP {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "0");
    }
}

class IP1 extends IP {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "1");
    }
}

class IP2 extends IP {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "2");
    }
}

class IP3 extends IP {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "3");
    }
}

class FullStop extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawLargeVerticalLine(context, margin, vmargin, width);
        super.drawLargeVerticalLine(context, margin, vmargin, width+4);
    }
    drawSuperScript(context, margin, vmargin, width, ch) {
        let fontSaver = context.font;
        let strokeSaver = context.strokeStyle;
        let fillSaver = context.fillStyle;
        context.font = "15pt \"Courier\"";
        context.strokeStyle = "#f00";
        context.fillStyle = "#f00";
        context.fillText(ch, margin + width, vmargin - 35);
        context.font = fontSaver;
        context.strokeStyle = strokeSaver;
        context.fillStyle = fillSaver;
    }
}

class FullStop0 extends FullStop {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "0");
    }
}

class FullStop1 extends FullStop {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "1");
    }
}

class FullStop2 extends FullStop {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "2");
    }
}

class FullStop3 extends FullStop {
    constructor() {
        super();
    }
    draw(context, margin, vmargin, width) {
        super.draw(context, margin, vmargin, width);
        super.drawSuperScript(context, margin, vmargin, width,  "3");
    }
}

// Solid 3 lines
class Solid3Line extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawLargeVerticalLine(context, margin, vmargin, width-2);
        super.drawLargeVerticalLine(context, margin, vmargin, width+2);
        super.drawLargeVerticalLine(context, margin, vmargin, width+6);
    }
}

// Solid 4 lines
class Solid4Line extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        super.drawLargeVerticalLine(context, margin, vmargin, width);
        let lineWidthSaver = context.lineWidth;
        context.lineWidth = 4;
        super.drawLargeVerticalLine(context, margin, vmargin, width+5);
        context.lineWidth = lineWidthSaver;
    }
}

// Dashed lines
class Dashed1Line extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        context.setLineDash([2, 2]);
        super.drawLargeVerticalLine(context, margin, vmargin, width+2);
        context.setLineDash([]);
    }
}

class Dashed2Line extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        context.setLineDash([2, 2]);
        super.drawLargeVerticalLine(context, margin, vmargin, width);
        super.drawLargeVerticalLine(context, margin, vmargin, width+4);
        context.setLineDash([]);
    }
}

class Dashed3Line extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        context.setLineDash([2, 2]);
        super.drawLargeVerticalLine(context, margin, vmargin, width-2);
        super.drawLargeVerticalLine(context, margin, vmargin, width+2);
        super.drawLargeVerticalLine(context, margin, vmargin, width+6);
        context.setLineDash([]);
    }
}

class Dashed4Line extends TSMsymbol {
    constructor() {
        super();
        this.deltaX = 4.0;
        this.deltaY = -28.0;
    }
    draw(context, margin, vmargin, width) {
        context.setLineDash([2, 2]);
        super.drawLargeVerticalLine(context, margin, vmargin, width);
        context.setLineDash([]);
        let lineWidthSaver = context.lineWidth;
        context.lineWidth = 4;
        super.drawLargeVerticalLine(context, margin, vmargin, width+5);
        context.lineWidth = lineWidthSaver;
    }
}

class SyllabicConsonant extends TSMsymbol {
    constructor() {
        super();
    }
    draw(context, width) {
    }
    size() {
        return 0;
    }
}
