var map = require('googlemaps');
console.log(map.directions);
map.directions('(40.3472894,-74.657003)', '(40.3528412,-74.6541169)', function(err, result) {
  //err ? console.log(err) : console.log(result);
  console.log(result.routes[0].legs[0].steps);
}, false, 'walking');