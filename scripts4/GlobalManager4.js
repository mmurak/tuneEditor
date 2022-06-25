class GlobalManager {
    constructor() {
        this.miniDisplay = document.getElementById("MiniDisplay");
        this.clearButton = document.getElementById("ClearButton");
        this.download = document.getElementById("Download");
        this.download2 = document.getElementById("Download2");
        this.canvasWidth = document.getElementById("CanvasWidth");
        this.graphicsCheckBox = document.getElementById("GraphicsCheckBox");
        this.centrelineCheckBox = document.getElementById("CentrelineCheckBox");
        this.separator1 = document.getElementById("Separator1");
        this.separator2 = document.getElementById("Separator2");
        this.summon = document.getElementById("Summon");
        this.wrap = document.getElementById("Wrap");
        this.scrollCanvas = document.getElementById("ScrollCanvas");
        this.textCanvas = document.getElementById("TextCanvas");
        this.cursorCanvas = document.getElementById("CursorCanvas");
        this.hotGate = document.getElementById("HotGate");
        this.projInput = document.getElementById("ProjInput");
        this.specifiedCanvasWidth = 800;  // for Canvas shrinker
        this.scrollAreaWidth = 800;
        this.scrollAreaHeight = 200;
        this.mouseDown = false;
        this.iap = 0;
        this.NotSelected = -1;
        this.textClick = false;
        this.coldColour = "rgb(224, 255, 255);"
        this.hotColour = "rgb(255, 192, 203);"
        this.coldGateStyle = "background-color:" + this.coldColour + "caret-color:" + this.coldColour + "font-size:100%;font-color:rgb(255,0,0);text-align:center;resize: none;";
        this.hotGateStyle = "background-color:" + this.hotColour + "caret-color:" + this.hotColour + "font-size:100%;font-color:rgb(255,0,0);text-align:center;resize: none;";
        this.hotGate.style = this.coldGateStyle;
    }
}
