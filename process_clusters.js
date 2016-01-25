"use strict"
// var data = require('./bv.json')
var _ = require('lodash')

var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require("event-stream");

var lineNr = 1;

var cluster_id = 0;

var MethodClusterIdMap = {}
var cluster = []
var clusters = []

var s = fs.createReadStream('./clusters.csv')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        // s.pause();

        lineNr += 1;
        // var o = JSON.parse(line)
        // console.log(`${o.repo}/commit/${o.child_hash}`)
        // console.log(line)
        let [method,weight] = line.split(',')
        if (!method){
          clusters.push(cluster)
          console.log(cluster_id++)
          cluster = []
        } else {

          MethodClusterIdMap[method] = {cluster_id, weight}

        }

        cluster.push({method, weight})
        // console.log(MethodClusterIdMap)

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
        // console.log('Read entirefile.')
        console.log(_.sortBy(clusters[157], 'weight'))
        console.log(MethodClusterIdMap['setTag'])


        var clusterData = {
          methods: MethodClusterIdMap,
          clusters
        }
        fs.writeFileSync('clusters.json', JSON.stringify(clusterData))
    })
);

// console.log(_.keys(data))
