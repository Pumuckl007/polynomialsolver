var solve = {};
solve.findRoots = function(polynomial, min, max, incrimentFactor){
  var table = [];
  var bounderies = [];
  var roots = [];
  var tableStart = min;
  for(var i = 0; i<(max-min)/incrimentFactor; i++){
    table[i] = polynomial.eval(i*incrimentFactor+min);
  }
  for(var i = 1; i<table.length-1; i++){
    if((table[i-1] >0 && table[i] <0)||(table[i-1] <0 && table[i] >0)){
      if(bounderies.indexOf(i-1)===-1){
        bounderies.push(min+i*incrimentFactor-1*incrimentFactor);
      }
    }
    if(Math.round(table[i]*1000) === 0){
      roots.push(min+i*incrimentFactor);
    }
  }
  return [bounderies,roots];
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
solve.solve = function(polynomial, min, max, debth, incrimentFactor){
  var data = solve.findRoots(polynomial, min, max, incrimentFactor);
  var bounderies = data[0];
  var roots = data[1];
  for(var i = 0; i< bounderies.length; i++){
    roots.push(solve.solveRecursivly(polynomial, bounderies[i], bounderies[i]+incrimentFactor, debth));
  }
  return roots;
}
solve.solveRecursivly = function(polynomial, min, max, debth){
  if(debth === 0){
    return (min+max)/2;
  }
  var xValue = (min+max)/2;
  var yValue = polynomial.eval(xValue);
  var minY = polynomial.eval(min);
  var maxY = polynomial.eval(max);
  var minPositive = minY > 0;
  if(yValue === 0){
    return xValue;
  }
  if(yValue < 0){
    if(minPositive){
      return solve.solveRecursivly(polynomial, min, xValue, debth-1);
    } else {
      return solve.solveRecursivly(polynomial, xValue, max, debth-1);
    }
  }
  if(yValue > 0) {
    if(minPositive){
      return solve.solveRecursivly(polynomial, xValue, max, debth-1);
    } else {
      return solve.solveRecursivly(polynomial, min, xValue, debth-1);
    }
  }
}
solve.solveButton = function(){
  var polynomialText = document.getElementById("polynomial").value;
  var polynomial = solve.parsePolynomial(polynomialText);
  var min = parseFloat(document.getElementById("min").value);
  var max = parseFloat(document.getElementById("max").value);
  var increment = parseFloat(document.getElementById("increment").value);
  var percision = parseFloat(document.getElementById("percision").value);
  var roots = solve.solve(polynomial, min, max, percision, increment);
  var answers = document.getElementById("answers");
  while(answers.firstChild){
    answers.removeChild(answers.firstChild);
  }
  for(var i = 0; i<roots.length; i++){
    var div = document.createElement("div");
    div.innerText = "X" + (i+1) + " = " + roots[i].toString();
    answers.appendChild(div);
  }
}
