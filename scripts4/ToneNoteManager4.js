class ToneNoteManager {
    constructor(cm) {
        this.canvasManager = cm;
        this.altArray;
        this.noteArray;
        this.separatorArray;
        this.clear();
        this.pattern = new RegExp(/^[aeiouy\u200bɨʉɯɪᵻᵿʊøɘɵɤəɛœɜɞʌɔæɐɶɑɒɚ]+$/i);
    }

    clear() {
        this.altArray = [-1, 99999];  // -1 and 99999 are sentinels
        this.noteArray = [];
        this.separatorArray = [];
    }

    erase(ptr) {
        let i = this._getNextChunkPtr(ptr);
        if (this.altArray[i] == 99999) { // last chunk?
            i -= 1;
            if (ptr == this.altArray[i]) {    // erase last chunk
                this.altArray.splice(i, 1);
                if ((i % 2) == 1) {
                    this.noteArray.splice(Math.trunc(i / 2), 1);
                }
            }
        } else {    // front/mid chunk        -1, 2v, 3c, 7v (ccVccccV) → -1, 6(ccccccV)
            let ii = i - 1;
            if ((ptr == this.altArray[ii]) && (ptr+1 == this.altArray[i])) {  // erase chunk
                this.altArray.splice(ii, 2);
                let notePtr = Math.trunc(ii / 2);
                this.noteArray.splice(notePtr, 1);
                let delSize =  this.canvasManager.getWidth4ch(G.aModel.textdata.substr(ptr, 1));
//                for (let n = notePtr; n < Math.trunc((this.altArray.length + 1) / 2) - 1; n++) {
//                    this.noteArray[n].width -= delSize;
//                }
                while (this.altArray[ii] != 99999) {
                    this.altArray[ii] -= 1;
                    ii += 1;
                }
            } else {  // simple shift
                while(this.altArray[i] != 99999) {
                    this.altArray[i] -= 1;
                    if ((i % 2) == 1) {
                    }
                    i += 1;
                }
            }
        }
    }

    _fixSeparator(ptr, deltaWidth) {
        //2->0, 3->1, 4->1, 5->2
        let wall = this.canvasManager.ctx.measureText(G.aModel.textdata.substr(0, ptr)).width;
        for (let i = Math.trunc((this.altArray.length+1) / 2) - 1; i < this.noteArray.length; i++) {
            if (this.noteArray[i].width >  wall) {
                this.noteArray[i].width += deltaWidth;
            }
        }
    }


    _getNextChunkPtr(ptr) {
        let i = 0;
        while (this.altArray[i] <= ptr) {
            i += 1;
        }
        return i;
    }

    isVowel(ch) {
        return ch.match(this.pattern);
    }

    insert(ptr, ch) {
        let i = this._getNextChunkPtr(ptr);
        if ((i % 2) != 0) {   // consonant chunk, since i points to the next chunk
            if (this.isVowel(ch)) {   // vowel in consonant chunk
                if (this.altArray[i-1] == ptr) {    // Top of chunk
                    i -= 1;
                } else if (this.altArray[i] == ptr) {     // Tail of chunk
                } else if (ptr == G.aModel.textdata.length) {
                    let insPt = Math.trunc(i / 2);
                    this.altArray.splice(i, 0, ptr);
                    i += 1;
                    this.noteArray.splice(insPt, 0, new ToneNote(0.0, 0, "S", 0));
                } else {
                    let insPt = Math.trunc(i / 2);
                    this.altArray.splice(i, 0, ptr, ptr+ch.length);
                    i += 2;
                    this.noteArray.splice(insPt, 0, new ToneNote(0.0, 0, "S", 0));
                }
            }
            while(this.altArray[i] != 99999) {
                this.altArray[i] += ch.length;
                i += 1;
            }
        } else {      // vowel chunk
            if (!this.isVowel(ch)) {    // consonant in vowel chunk
                if (this.altArray[i-1] == ptr) {    // Top of chunk
                    i -= 1;;
                } else if (this.altArray[i] == ptr) {     // Tail of chunk
                } else if (ptr == G.aModel.textdata.length) {
                    this.altArray.splice(i, 0, ptr);
                    i += 1;
                } else {
                    let insPt = Math.trunc(i / 2);
                    this.altArray.splice(i, 0, ptr, ptr+ch.length);
                    i += 2;
                    if (ptr != G.aModel.textdata.length) { // stop when VC
                        this.noteArray.splice(insPt, 0, new ToneNote(0.0, 0, "S", 0));
                    }
                }
            }
            while(this.altArray[i] != 99999) {
                this.altArray[i] += ch.length;
                i += 1;
            }
        }
    }

}
