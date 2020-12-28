// elements for obtaining vals
var val1El = "#0000ff"
var val2El = "#ff3300"
var stepsEl = "5"

//return a workable RGB int array [r,g,b] from hex representation
function processHEX(val) {
  //does the hex contain extra char?
  var hex = (val.length > 6) ? val.substr(1, val.length - 1) : val;
  // is it a six character hex?
  if (hex.length > 3) {

    //scrape out the numerics
    var r = hex.substr(0, 2);
    var g = hex.substr(2, 2);
    var b = hex.substr(4, 2);

    // if not six character hex,
    // then work as if its a three character hex
  } else {

    // just concat the pieces with themselves
    var r = hex.substr(0, 1) + hex.substr(0, 1);
    var g = hex.substr(1, 1) + hex.substr(1, 1);
    var b = hex.substr(2, 1) + hex.substr(2, 1);

  }
  // return our clean values
  return [
    parseInt(r, 16),
    parseInt(g, 16),
    parseInt(b, 16)
  ]
}

function genGradient(color1, color2, stepsInt) {
  //attach start value
  var hasSpun = 0;

  var val1RGB = processHEX(color1);
  var val2RGB = processHEX(color2);
  var colors = [];

  //the percentage representation of the step
  var stepsPerc = 100 / (stepsInt + 1);

  // diffs between two values 
  var valClampRGB = [
    val2RGB[0] - val1RGB[0],
    val2RGB[1] - val1RGB[1],
    val2RGB[2] - val1RGB[2]
  ];

  // build the color array out with color steps
  for (var i = 0; i < stepsInt; i++) {
    var clampedR = (valClampRGB[0] > 0)
      ? pad((Math.round(valClampRGB[0] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((val1RGB[0] + (valClampRGB[0]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    var clampedG = (valClampRGB[1] > 0)
      ? pad((Math.round(valClampRGB[1] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((val1RGB[1] + (valClampRGB[1]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    var clampedB = (valClampRGB[2] > 0)
      ? pad((Math.round(valClampRGB[2] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((val1RGB[2] + (valClampRGB[2]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);
    colors[i] = [
      '#',
      clampedR,
      clampedG,
      clampedB
    ].join('');
  }
  return colors
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
