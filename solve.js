var solve = {};
solve.findRoots = function(polynomial, min, max){
  var table = [];
  var bounderies = [];
  var tableStart = min;
  for(var i = 0; i<(max-min); i++){
    table[i] = polynomial.eval(i+min);
  }
  for(var i = 1; i<table.length-1; i++){
    if((table[i-1] >=0 && table[i] <=0)||(table[i-1] <=0 && table[i] >=0)){
      if(bounderies.indexOf(i-1)===-1){
        bounderies.push(min+i-1);
      }
    }
  }
  console.log(table);
  return bounderies;
}
solve.parsePolynomial = function(string){
  var polynomial = {};
  polynomial.eval = solve.eval;
  var negative = string.split("-")[0] ==="";
  if(negative){
    string = string.replace("-", "", 1);
  }
  var pluses = string.split("+");
  var splitBySing = [];
  polynomial.factors = [];
  for(var i = 0; i<pluses.length; i++){
    var split = pluses[i].split("-");
    splitBySing.push(split[0]);
    for(var k = 1; k<split.length; k++){
      splitBySing.push("-" + split[k]);
    }
  }
  for(var i = 0; i<splitBySing.length; i++){
    var factor = {};
    factor.negative = (splitBySing[i].split("-").length > 1);
    factor.power = parseInt(splitBySing[i].split("^")[1], 10);
    if((splitBySing[i].split("^")[1] === "") || (splitBySing[i].indexOf("^") === -1)){
      factor.power = 1;
    }
    if(splitBySing[i].indexOf("x") === -1){
      factor.power = 0;
    }
    console.log(splitBySing[i].indexOf("^"));
    factor.coeficent = parseInt(splitBySing[i].split("^")[0].replace("-", "").replace("x",""), 10);
    if(splitBySing[i].split("^")[0].replace("-", "").replace("x","")===""){
      factor.coeficent = 1;
    }
    polynomial.factors.push(factor);
  }
  if(negative){
    polynomial.factors[0].negative = true;
  }
  return polynomial;
}
solve.eval = function(x){
  var sum = 0;
  for(var i = 0; i<this.factors.length; i++){
    var factor = this.factors[i];
    if(factor.negative){
      sum += Math.pow(x, factor.power)*factor.coeficent*-1;
    } else {
      sum += Math.pow(x, factor.power)*factor.coeficent;
    }
  }
  return sum;
}
