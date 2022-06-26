class Separator {
    constructor(lineNo, offset, visible) {
        this.lineNo = lineNo;
        this.offset = offset;
        this.visible = visible;
    }
    getYs(context) {
        let startY = GPD["CanvasTopMargin"] + (this.lineNo * (GPD["TSMHeight"] + GPD["DotsAreaHeight"])) + GPD["TSMHeight"] + GPD["TopLineOffset"];
        let endY = startY + GPD["BottomLineOffset"] - 9;
        return [startY, endY];
    }
    getClassName() {
        return this.constructor.name;
    }
}

class Separator1 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.moveTo(this.offset + GPD["CanvasLeftMargin"], yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"], yy[1]);
        context.stroke();
    }
}

class Separator2 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] - 2, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] - 2, yy[1]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] + 2, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] + 2, yy[1]);
        context.stroke();
    }
}

class Separator3 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[1]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"], yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"], yy[1]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] + 3, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] + 3, yy[1]);
        context.stroke();
    }
}

class Separator4 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[1]);
        let lineWidthSaver = context.lineWidth;
        context.stroke();
        context.beginPath();
        context.lineWidth = 5;
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] + 4, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] + 4, yy[1]);
        context.stroke();
        context.lineWidth = lineWidthSaver;
    }
}

class SeparatorDL1 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.setLineDash([3, 3]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"], yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"], yy[1]);
        context.stroke();
        context.setLineDash([]);
    }
}

class SeparatorDL2 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.setLineDash([3, 3]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] - 2, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] - 2, yy[1]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] + 2, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] + 2, yy[1]);
        context.stroke();
        context.setLineDash([]);
    }
}

class SeparatorDL3 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset, visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.setLineDash([3, 3]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[1]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"], yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"], yy[1]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] + 3, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] + 3, yy[1]);
        context.stroke();
        context.setLineDash([]);
    }
}

class SeparatorDL4 extends Separator {
    constructor(lineNo, offset, visible)  {
        super(lineNo, offset , visible) ;
    }
    draw(context) {
        let yy = super.getYs();
        context.beginPath();
        context.setLineDash([3, 3]);
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] - 3, yy[1]);
        let lineWidthSaver = context.lineWidth;
        context.stroke();
        context.setLineDash([]);
        context.beginPath();
        context.lineWidth = 5;
        context.moveTo(this.offset + GPD["CanvasLeftMargin"] + 4, yy[0]);
        context.lineTo(this.offset + GPD["CanvasLeftMargin"] + 4, yy[1]);
        context.stroke();
        context.lineWidth = lineWidthSaver;
    }
}
