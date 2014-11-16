// 'use strict';
// (require('rootpath')());
// var Myo = require('myo');


var myMyo = Myo.create(1);
myMyo.on('fingers_spread', function(edge){
    if(!edge) return;
    alert('Hello Myo!');
    myMyo.vibrate();
});