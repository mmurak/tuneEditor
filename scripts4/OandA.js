class PatternTemplate {
    constructor() {
        this.nuclei = {
            "LF" : document.getElementById("LFimg"),
            "HF" : document.getElementById("HFimg"),
            "RF" : document.getElementById("RFimg"),
            "LR" : document.getElementById("LRimg"),
            "HR" : document.getElementById("HRimg"),
            "FR" : document.getElementById("FRimg"),
            "ML" : document.getElementById("MLimg"),
        };
        this.heads = {
            "H1" : document.getElementById("HHimg"),
            "H3" : document.getElementById("FHimg"),
            "L1" : document.getElementById("LHimg"),
            "L3" : document.getElementById("RHimg"),
        };
        this.delimiters = new Set(["HP", "LP", "FS", "F0", "F1", "F2", "F3", "IP", "I0", "I1", "I2", "I3", 
                                            "S1", "S2", "S3", "S4", "D1", "D2", "D3", "D4"]);
    }
    clearAll() {
        for (let key in this.nuclei) {
            this.nuclei[key].style = "border: 1px solid white;";
        }
        for (let key in this.heads) {
            this.heads[key].style = "border: 1px solid white;";
        }
    }
    emphasize(tsm) {
        if (tsm in this.nuclei) {
            this.nuclei[tsm].style = "border: 1px solid red;";
        } else {
            this.heads[tsm].style = "border: 1px solid blue";
        }
    }
}

class OandA extends PatternTemplate {
    constructor() {
        super();
        this.template = {
            "H1" : ["HR", "HF", "RF", "ML", "LR", "LF", "ML"],
            "L1" : ["LR"],
            "H3" : ["FR"],
            "L3" : ["HF"],
        };
    }

    process(str) {
        if (str == "HF") {
            this.clearAll();
            this.emphasize("LR");
            return;
        }
        if (str in this.template) {
            this.clearAll();
            this.emphasize(str);
            for(let elem of this.template[str]) {
                this.emphasize(elem);
            }
        } else if ((this.delimiters.has(str)) || (str in this.nuclei)) {
            this.clearAll();
        }
    }
}
