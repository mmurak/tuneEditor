class TSMmanager {
    constructor() {
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
        this.tsmArray.push([ptr, new (this.dict.get(mkStr))()]);
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
