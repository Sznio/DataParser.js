const fs = require("fs");
const EventEmitter = require("events");
class DataParser extends EventEmitter {
      buf = "";
      words = new Array();

      streamWordsArray() {
            this.emit("data", this.words);
            this.words = [];
      }

      parseDataIntoWords(data) {
            data = this.buf + data;
            //split by whitespace, remove whitespace elements unless they are last in the split
            let splitData = data
                  .split(/ +|\t+|\n+|\r+/)
                  .map((el, index, arr) => {
                        if (index != arr.length - 1) {
                              return el.trim();
                        }
                        return el;
                  })
                  .filter((el, index, arr) => {
                        if (index != arr.length - 1) {
                              return arr.length;
                        }
                        return true;
                  });
            //wihtout the last one as it will be assigned to this.buf
            let processedData = splitData.slice(0, splitData.length - 1);

            //add new words
            this.words = this.words.concat(processedData);

            this.streamWordsArray();

            this.buf = splitData[splitData.length - 1];
      }

      parseLastData() {
            if (this.buf.length && this.buf.trim().length) {
                  this.words.push(this.buf.trim());
            }
            this.emit("end", this.words);
      }

      constructor(path, options) {
            super();
            const readStr = fs.createReadStream(path, {
                  encoding: options.encoding || "utf8",
                  highWaterMark: options.chunkSize || 65536,
            });
            readStr.on("data", (chunk) => {
                  this.parseDataIntoWords(chunk);
            });
            readStr.on("end", () => {
                  this.parseLastData();
            });
      }
}
module.exports = DataParser;
