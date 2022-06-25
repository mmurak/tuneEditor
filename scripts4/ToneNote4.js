function getStandardPath(pattern) {  // This function acts as class variables for ToneNote
    const pcoord = [
        [],         // Not nucleus
        [[0, 0], [20, 10], [20, 60]],  // 1. Fall
        [],         // N/A
        [[0, 0], [8, -10], [12, -10], [20, 0], [20, 40]],         // 3. Rise Fall
        [[0, 0], [20, 0], [20, -15]],         // 4. RiseN/A
        [],         // N/A
        [[0, 0], [10, 0], [10, 36], [10, 48], [15, 50], [17, 50], [20, 48], [22, 42], [25, 30]],   // 6. Fall Rise
        [[0, 0], [25, 0]],         // 7. Mid-Level
    ];
    return pcoord[pattern].map(x => [x[0] * GPD["DotLSize"] / 12.0, x[1]]);
}

class ToneNote {
    constructor(width, height, size, pattern) {
        this.width = width;
        this.height = height;
        this.size = size;
        this.pattern = 0;
        this.magX = 1.0;
        this.magY = 1.0;
        this.finalY = 0;
        this.visible = true;
    }
    setPattern(pattern) {
        this.pattern = pattern
        this.magX = 1.0;
        this.magY = 1.0;
        this.finalY = 0;
    }
    getMax(path) {
        let maxvalue = 0;
        for (let i = 0; i < path.length; i++) {
            maxvalue = (maxvalue < path[i][1]) ? path[i][1] : maxvalue;
        }
        return maxvalue;
    }
    getPath(parmY, parmX) {
        let spath = getStandardPath(this.pattern);
        let modifiedPath = [];
        if (spath.length > 0) {
            let maxdev = this.getMax(spath);
            let magnifier = 1.0
            if (maxdev != 0) {
                magnifier = (GPD["BottomLineOffset"] - G.aView.getHeight4Note(this.getRadius(this.size), this.height) ) / maxdev;
            }
            for(let i = 0; i < spath.length; i++) {
                let x = parmX + GPD["CanvasLeftMargin"] + (spath[i][0] * this.magX);
                let y = GPD["CanvasTopMargin"] + parmY * (GPD["TSMHeight"] + GPD["DotsAreaHeight"]) + GPD["TSMHeight"] + G.aView.getHeight4Note(this.getRadius(this.size), this.height) + (spath[i][1] * magnifier * this.magY);
                modifiedPath.push([x, y]);
            }
            if (this.pattern != 7) {
                modifiedPath[modifiedPath.length-1][1] += this.finalY;
            }
        }
        return modifiedPath;
    }

    getRadius(size) {
        let radius;
        switch (size) {
            case "L" :
                radius = GPD["DotLSize"];
                break;
            case "M" :
                radius = GPD["DotMSize"];
                break;
            default :
                radius = GPD["DotSSize"];
        }
        return radius;
    }

    draw(context, coord) {
        context.beginPath();
        let radius = this.getRadius(this.size);
        context.arc(coord[1] + this.width + GPD["CanvasLeftMargin"], GPD["CanvasTopMargin"] + coord[0] * (GPD["TSMHeight"] + GPD["DotsAreaHeight"]) + GPD["TSMHeight"] + G.aView.getHeight4Note(radius, this.height), radius, 0, Math.PI * 2, true);
        context.fill();
        let dotsAreaOffset = GPD["CanvasTopMargin"] + (coord[0] * (GPD["TSMHeight"] + GPD["DotsAreaHeight"])) + GPD["TSMHeight"];
        let upperLimit = dotsAreaOffset + GPD["TopLineOffset"];
        let lowerLimit = dotsAreaOffset + GPD["BottomLineOffset"];
        let aPath = this.getPath(coord[0], coord[1] + this.width);
        if (aPath.length > 0) {
            let bspline = new BSpline(aPath, 5, true);
            let oldx, oldy, x, y;
            oldx = bspline.calcAt(0)[0];
            oldy = bspline.calcAt(0)[1];
            for(let t = 0;t <= 1;t+=0.001) {
                context.moveTo(oldx,oldy);
                let interpol = bspline.calcAt(t);
                x = interpol[0];
                y = interpol[1];
                if (y < upperLimit) {
                    y = upperLimit;
                    context.lineTo(x,y);
                    break;
                } else if (y > lowerLimit) {
                    y = lowerLimit;
                    context.lineTo(x,y);
                    break;
                }
                context.lineTo(x,y);
                oldx = x;
                oldy = y;
            }
        }
        context.stroke();
    }

    getClassName() {
        return this.constructor.name;
    }
}

