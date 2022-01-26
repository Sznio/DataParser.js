# DataParser.js
Node-js class that reads files and streams whitespace separated data through events.

# Usage:
1. Import the module
2. Call the constructor (params: 1. path (path to file), 2. options (js object with possible keys of chunkSize that will be used as highWaterMark when reading file, and encoding that will be used as encoding when processing the file.)
3. Add on("data"), and on("end") events (they will pass you an array of read words, remember that the "end" event may do it as well)
4. That's it!
