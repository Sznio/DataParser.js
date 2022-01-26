const fs = require("fs");
const EventEmitter = require("events");
class DataParser extends EventEmitter {
      buf = "";
      words = new Array();
     
      streamWordsArray = () => {
            this.emit("data", this.words);
            this.words = [];
      };

      parseDataIntoWords = (data) => {
            data = this.buf + data;
            let splitData = data.split(/ |\n|\t/g);
            splitData = splitData.filter((n) => {
                  return n != "\n" && n != " " && n != "\t";
            });
            let processedData = splitData.slice(0, splitData.length - 1);

            this.words = this.words.concat(processedData);
            this.streamWordsArray();

            this.buf = splitData[splitData.length - 1];
      };

      parseLastData = () => {
            if (
                  this.buf.length &&
                  this.buf != " " &&
                  this.buf != "\n" &&
                  this.buf != "\t"
            ) {
                  this.words.push(this.buf);
            }
            this.emit("end", this.words);
      };

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
