"use strict"
// var data = require('./bv.json')
var _ = require('lodash')

var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require("event-stream");

var lineNr = 1;

var s = fs.createReadStream('./bv.json')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        // s.pause();

        lineNr += 1;
        var o = JSON.parse(line)
        console.log(`${o.repo}/commit/${o.child_hash}`)

        // (function(){
        //
        //     // process line here and call s.resume() when rdy
        //     logMemoryUsage(lineNr);
        //
        //     // resume the readstream
        //     s.resume();
        //
        // })();
    })
    .on('error', function(){
        console.log('Error while reading file.');
    })
    .on('end', function(){
        console.log('Read entirefile.')
    })
);

// console.log(_.keys(data))
