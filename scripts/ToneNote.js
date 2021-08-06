let magFactor = 1.0;

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
  return pcoord[pattern].map(x => [x[0] * magFactor, x[1]]);
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
  getPath() {
    let spath = getStandardPath(this.pattern);
    let modifiedPath = [];
    if (spath.length > 0) {
      let maxdev = this.getMax(spath);
      let magnifier = 1.0
      if (maxdev != 0) {
        magnifier = (cMgr.LowerLimit - this.height) / maxdev;
      }
      for(let i = 0; i < spath.length; i++) {
        let x = this.width + 30 + (spath[i][0] * this.magX);
        let y = this.height + (spath[i][1] * magnifier * this.magY);
        modifiedPath.push([x, y]);
      }
      if (this.pattern != 7) {
        modifiedPath[modifiedPath.length-1][1] += this.finalY;
      }
    }
    return modifiedPath;
  }
  draw(context, margin) {
    context.beginPath();
    context.arc(this.width+margin, this.height, this.size, 0, Math.PI * 2, true);
    context.fill();
    let aPath = this.getPath();
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

class Separator {   // could be subclass of sth... like Element
  constructor(width) {
    this.width = width;
    this.visible = true;
  }
  draw(context, margin) {
    context.beginPath();
    context.moveTo(this.width+margin, cMgr.UpperLimit);
    context.lineTo(this.width+margin, cMgr.LowerLimit);
    context.stroke();
  }
  getClassName() {
    return this.constructor.name;
  }
}
