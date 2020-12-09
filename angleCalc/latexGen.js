var latex = document.getElementById("submit");
var area = document.getElementById("contentArea");
var hiddenArea = document.getElementById("hiddenArea");

var planes1 = new Map();
var planes2 = new Map();

latex.onclick = function loadLatex() {
    var latexCode = createLatexAll();

    area.innerHTML = latexCode
    // render latex
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'contentArea']);
    
}

function createLatexAll(){ 
    var html_latex = ""
    for (var k1 in planes1){
        p1 = planes1[k1]
        for (var k2 in planes2){
            p2 = planes2[k2]
            latex = createLatexSingle(p1, p2)
            html_latex += `Planes : (${p1.toString()}) (${p2.toString()})`
            html_latex += latex
        }
    }
    return html_latex;
}


function createLatexSingle(p1 , p2){  
    var struc = document.getElementById("struct").value;
    if (struc == "hex"){
        try{
            var a = document.getElementById("a").value;
            var c = document.getElementById("c").value;
            a = parseFloat(a)
            c = parseFloat(c)
            console.log(a)
            // if ((isNaN(a)) || (isNan(c))){
            //     return "ERROR: Hexagonal lattice parameters are not real numbers"
            // }
        }catch{
            console.log("Error")
            return "ERROR: Hexagonal lattice parameters are not real numbers"
        }
        return hexCalc(p1, p2, a, c)
    }else if (struc == "tet"){
        try{
            var a = document.getElementById("a").value;
            var c = document.getElementById("c").value;
            a = parseFloat(a)
            c = parseFloat(c)
            console.log(a)
            // if ((isNaN(a)) || (isNan(c))){
            //     return "ERROR: Hexagonal lattice parameters are not real numbers"
            // }
        }catch{
            console.log("Error")
            return "ERROR: Tetragonal lattice parameters are not real numbers"
        }
        return tetragonalCalc(p1, p2, a, c)
    }else if (struc == "cub"){
        return cubicCalc(p1, p2);
    }else if (struc == "monob"){
        try{
            var a = document.getElementById("a").value;
            var b = document.getElementById("b").value;
            var c = document.getElementById("c").value;
            var beta = document.getElementById("beta").value;
            a = parseFloat(a)
            b = parseFloat(b)
            c = parseFloat(c)
            beta = parseFloat(beta)

        }catch{
            console.log("Error")
            return "ERROR: Tetragonal lattice parameters are not real numbers"
        }
        return monobCalc(p1, p2, a, b, c, beta)
    }else if (struc == "monog"){
        try{
            var a = document.getElementById("a").value;
            var b = document.getElementById("b").value;
            var c = document.getElementById("c").value;
            var gamma = document.getElementById("gamma").value;
            a = parseFloat(a)
            b = parseFloat(b)
            c = parseFloat(c)
            gamma = parseFloat(gamma)

        }catch{
            console.log("Error")
            return "ERROR: Tetragonal lattice parameters are not real numbers"
        }
        return monogCalc(p1, p2, a, b, c, gamma)
    }else{
        return "No Lattice Type"
    }
}

function getPlanes(){
    h1 = document.getElementById("h1").value
    k1 = document.getElementById("k1").value
    l1 = document.getElementById("l1").value

    h2 = document.getElementById("h2").value
    k2 = document.getElementById("k2").value
    l2 = document.getElementById("l2").value
    
    var buff1 = [h1,k1,l1]
    var buff2 = [h2,k2,l2]
    var plane1 = []
    var plane2 = []
    for (var i=0;i<buff1.length;i++){
        plane1.push(parseInt(buff1[i]))
        plane2.push(parseInt(buff2[i]))
    }
    
    return [plane1, plane2]
}


function addPlane(p) { 
    h2 = document.getElementById(`h${p}`).value
    k2 = document.getElementById(`k${p}`).value
    l2 = document.getElementById(`l${p}`).value

    var plane = [parseInt(h2), parseInt(k2), parseInt(l2)]
    if (p == 1){ 
        var name = `plane1${h2}${k2}${l2}`
    }else { 
        var name = `plane2${h2}${k2}${l2}`
    }
    // check if exists 
    while (true){ 
        var buff = document.getElementById(name)
        if (buff == null){ 
            break;
        }
        name = name + "1"
    }
    if (p == 1){ 
        planes1[name] = plane;
        
    }else{ 
        planes2[name] = plane;
    }
    var code = `<div id = '${name}'> (${plane.join(' ')}) <button onclick="removePlane('${name}')">Remove</  </div> `
    var buff = document.getElementById(`added_planes${p}`)
    buff.innerHTML = buff.innerHTML + code
}

function removePlane(id) { 
    console.log(id);
    document.getElementById(id).remove()
    delete planes1[id]
    delete planes2[id]

}

function cubicCalc(p1, p2){
    // Header
    var code = "cos(\\theta) &= \\hspace{0.2cm}  \\frac{u_1 \\cdot v_2}{||u_1|| ||v_2||} \\\\"
    code += "&= \\hspace{0.2cm} \\frac{h_1 h_2 + k_1 k_2 + l_1 l_2}{\\sqrt{h_{1}^2 + k_{1}^2 + l_{1}^2} \\sqrt{h_{2}^2 + k_{2}^2 + l_{2}^2}}\\\\"
    // Full Eq.
    code += `&= \\hspace{0.2cm} \\frac{${p1[0]} \\cdot ${p2[0]} + ${p1[1]}\\cdot ${p2[1]} + ${p1[2]}\\cdot ${p2[2]}}{\\sqrt{${p1[0]}^2 + ${p1[1]}^2 + ${p1[2]}^2} \\sqrt{${p2[0]}^2 + ${p2[1]}^2 + ${p2[2]}^2}}\\\\`
    // Simplified Numerator and Denom
    var numer = dotProd(p1, p2);
    var p1InnerMag = dotProd(p1, p1)
    var p2InnerMag = dotProd(p2, p2)
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{\\sqrt{${p1InnerMag}}\\sqrt{${p2InnerMag}}}\\\\`
    //  Computed Full Fraction
    var denom = Math.sqrt(p1InnerMag) * Math.sqrt(p2InnerMag)
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{${denom.toFixed(8)}}\\\\`
    // final eq relation
    var rhs = numer/denom
    console.log(rhs)
    if ((rhs > 1) && (rhs < 1.0005)){
        // Rounding issues with calcs
        rhs = 1
    }else if (isNaN(rhs)){ // 0/0 situation
        rhs = 0
    }
    rhs = rhs.toFixed(5)
    code += `cos(\\theta) &= \\hspace{0.2cm} ${rhs}\\\\`
    // final 
    console.log(rhs);
    code += `\\theta &= \\hspace{0.2cm} ${Math.acos(rhs) * 360 / (2 * Math.PI)}^{\\circ} \\\\`
    return "\\begin{align*}\\\\" +code + "\\end{align*}";
}


function tetragonalCalc(p1, p2, a, c){
    // Header
    var code = "cos(\\theta) &= \\hspace{0.2cm} \\frac{\\frac{h_1 h_2 + k_1 k_2}{a^2} + \\frac{l_1 l_2}{c^2}}{\\sqrt{\\frac{h_{1}^2 + k_{1}^2}{a^2} + \\frac{l_{1}^2}{c^2}} \\sqrt{\\frac{h_{2}^2 + k_{2}^2}{a^2} + \\frac{l_{2}^2}{c^2}}}\\\\"
    // Full Eq.
    code += `&= \\hspace{0.2cm} \\frac{\\frac{${p1[0]} \\cdot ${p2[0]} + ${p1[1]}\\cdot ${p2[1]}}{${a}^2} + \\frac{${p1[2]}\\cdot ${p2[2]}}{${c}^2}}{\\sqrt{\\frac{${p1[0]}^2 + ${p1[1]}^2}{${a}^2} + \\frac{${p1[2]}^2}{${c}^2}} \\sqrt{\\frac{${p2[0]}^2 + ${p2[1]}^2}{${a}^2} + \\frac{${p2[2]}^2}{${c}^2}}}\\\\`
    // Simplified Numerator and Denom
    p1[0] = p1[0] / a
    p1[1] = p1[1] / a
    p1[2] = p1[2] / c
    p2[0] = p2[0] / a
    p2[1] = p2[1] / a
    p2[2] = p2[2] / c
    var numer = dotProd(p1, p2);
    var p1InnerMag = dotProd(p1, p1)
    var p2InnerMag = dotProd(p2, p2)
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{\\sqrt{${p1InnerMag}}\\sqrt{${p2InnerMag}}}\\\\`
    //  Computed Full Fraction
    var denom = Math.sqrt(p1InnerMag) * Math.sqrt(p2InnerMag)
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{${denom.toFixed(8)}}\\\\`
    // final eq relation
    var rhs = numer/denom
    console.log(rhs)
    if ((rhs > 1) && (rhs < 1.0005)){
        // Rounding issues with calcs
        rhs = 1
    }else if (isNaN(rhs)){ // 0/0 situation
        rhs = 0
    }
    rhs = rhs.toFixed(5)
    code += `cos(\\theta) &= \\hspace{0.2cm} ${rhs}\\\\`
    // final 
    console.log(rhs);
    code += `\\theta &= \\hspace{0.2cm} ${Math.acos(rhs) * 360 / (2 * Math.PI)}^{\\circ} \\\\`
    return "\\begin{align*}\\\\" +code + "\\end{align*}";
}



function monobCalc(p1, p2, a, b, c, beta){
    // Header
    var code = "cos(\\theta) &= \\hspace{0.2cm} \\frac{\\frac{h_1 h_2}{a^2} + \\frac{k_1 k_2 sin^2(\\beta)}{b^2} + \\frac{l_1 l_2}{c^2} - \\frac{(h_1 l_2 + h_2 l_1) cos(\\beta)}{a c}}{\\sqrt{ \\frac{h_1^2}{a^2} + \\frac{k_1^2 sin^2(\\beta)}{b^2} + \\frac{l_1 ^2}{c^2} - \\frac{2 h_1 l_1  cos(\\beta)}{a c} } \\sqrt{\\frac{h_2^2}{a^2} + \\frac{k_2^2 sin^2(\\beta)}{b^2} + \\frac{l_2 ^2}{c^2} - \\frac{2 h_2 l_2  cos(\\beta)}{a c}}}\\\\"
    // Full Eq.
    code += `&= \\hspace{0.2cm}   \\frac{\\frac{${p1[0]}  \\cdot${p2[0]}}{${a}^2} + \\frac{${p1[1]} \\cdot ${p2[1]} sin^2(${beta})}{${b}^2} + \\frac{${p1[2]} \\cdot ${p2[2]}}{${c}^2} - \\frac{(${p1[0]} \\cdot ${p2[2]} + ${p2[0]}  \\cdot${p1[2]}) cos(${beta})}{${a} \\cdot ${c}}}{\\sqrt{ \\frac{${p1[0]}^2}{${a}^2} + \\frac{${p1[1]}^2 sin^2(${beta})}{${b}^2} + \\frac{${p1[2]} ^2}{${c}^2} - \\frac{2 \\cdot ${p1[0]}  \\cdot ${p1[2]}   \\cdot cos(${beta})}{${a}\\cdot ${c}} } \\sqrt{\\frac{${p2[0]}^2}{${a}^2} + \\frac{${p2[1]}^2 sin^2(${beta})}{${b}^2} + \\frac{${p2[2]} ^2}{${c}^2} - \\frac{2 \\cdot ${p2[0]} \\cdot ${p2[2]}  \\cdot cos(${beta})}{${a} \\cdot ${c}}}}\\\\`
    // Simplified Numerator and Denom
    var rad = beta / 360 * 2 * Math.PI ;
    var numer = p1[0] * p2[0] / a ** 2 + p1[1] * p2[1] * Math.sin(rad) ** 2  / b ** 2 + p1[2] * p2[2] / c ** 2 - ((p1[0] * p2[2] + p2[0] * p1[2]) * Math.cos(rad)  / (a * c))
    var p1InnerMag = p1[0] **2 / a ** 2 + p1[1] **2  * Math.sin(rad) ** 2  / b ** 2 + p1[2]**2 / c ** 2 - ((p1[0] * p1[2] + p1[0] * p1[2]) * Math.cos(rad) / (a * c))
    var p2InnerMag = p2[0] **2 / a ** 2 + p2[1] **2  * Math.sin(rad) ** 2  / b ** 2 + p2[2]**2 / c ** 2 - ((p2[0] * p2[2] + p2[0] * p2[2]) * Math.cos(rad) / (a * c))
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{\\sqrt{${p1InnerMag}}\\sqrt{${p2InnerMag}}}\\\\`
    //  Computed Full Fraction
    var denom = Math.sqrt(p1InnerMag) * Math.sqrt(p2InnerMag)
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{${denom.toFixed(8)}}\\\\`
    // final eq relation
    var rhs = numer/denom
    console.log(rhs)
    if ((rhs > 1) && (rhs < 1.0005)){
        // Rounding issues with calcs
        rhs = 1
    }else if (isNaN(rhs)){ // 0/0 situation
        rhs = 0
    }
    rhs = rhs.toFixed(5)
    code += `cos(\\theta) &= \\hspace{0.2cm} ${rhs}\\\\`
    // final 
    console.log(rhs);
    code += `\\theta &= \\hspace{0.2cm} ${Math.acos(rhs) * 360 / (2 * Math.PI)}^{\\circ} \\\\`
    return "\\begin{align*}\\\\" +code + "\\end{align*}";
}

function monogCalc(p1, p2, a, b, c, gamma){
    // Header
    var code = "cos(\\theta) &= \\hspace{0.2cm} \\frac{\\frac{h_1 h_2}{a^2} + \\frac{k_1 k_2 }{b^2} + \\frac{l_1 l_2 sin^2(\\gamma)}{c^2} - \\frac{(h_1 k_2 + h_2 k_1) cos(\\gamma)}{a b}}{\\sqrt{ \\frac{h_1^2}{a^2} + \\frac{k_1^2 }{b^2} + \\frac{l_1 ^2 sin^2(\\gamma)}{c^2} - \\frac{2 h_1 k_1  cos(\\gamma)}{a b} } \\sqrt{\\frac{h_2^2}{a^2} + \\frac{k_2^2 }{b^2} + \\frac{l_2^2 sin^2(\\gamma)}{c^2} - \\frac{2 h_2 k_2  cos(\\gamma)}{a b}}}\\\\"
    // Full Eq.
    code += `&= \\hspace{0.2cm}   \\frac{\\frac{${p1[0]}  \\cdot${p2[0]}}{${a}^2} + \\frac{${p1[1]} \\cdot ${p2[1]}}{${b}^2} + \\frac{${p1[2]} \\cdot ${p2[2]} \\cdot  sin^2(${gamma})}{${c}^2} - \\frac{(${p1[0]} \\cdot ${p2[1]} + ${p2[0]}  \\cdot${p1[1]}) cos(${gamma})}{${a} \\cdot ${b}}}{\\sqrt{ \\frac{${p1[0]}^2}{${a}^2} + \\frac{${p1[1]}^2 }{${b}^2} + \\frac{${p1[2]} ^2 sin^2(${gamma})}{${c}^2} - \\frac{2 \\cdot ${p1[0]}  \\cdot ${p1[1]}   \\cdot cos(${gamma})}{${a}\\cdot ${b}} } \\sqrt{\\frac{${p2[0]}^2}{${a}^2} + \\frac{${p2[1]}^2 }{${b}^2} + \\frac{${p2[2]} ^2 sin^2(${gamma})}{${c}^2} - \\frac{2 \\cdot ${p2[0]} \\cdot ${p2[1]}  \\cdot cos(${gamma})}{${a} \\cdot ${b}}}}\\\\`
    // Simplified Numerator and Denom
    var rad = gamma / 360 * 2 * Math.PI ;
    var numer = p1[0] * p2[0] / a ** 2 + p1[1] * p2[1]  / b ** 2 + p1[2] * p2[2] * Math.sin(rad) ** 2/ c ** 2 - ((p1[0] * p2[1] + p2[0] * p1[1]) * Math.cos(rad)  / (a * b))
    var p1InnerMag = p1[0] **2 / a ** 2 + p1[1] **2    / b ** 2 + p1[2]**2 * Math.sin(rad) ** 2/ c ** 2 - ((p1[0] * p1[1] + p1[0] * p1[1]) * Math.cos(rad) / (a * b))
    var p2InnerMag = p2[0] **2 / a ** 2 + p2[1] **2   / b ** 2 + p2[2]**2 * Math.sin(rad) ** 2/ c ** 2 - ((p2[0] * p2[1] + p2[0] * p2[1]) * Math.cos(rad) / (a * b))
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{\\sqrt{${p1InnerMag}}\\sqrt{${p2InnerMag}}}\\\\`
    //  Computed Full Fraction
    var denom = Math.sqrt(p1InnerMag) * Math.sqrt(p2InnerMag)
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{${denom.toFixed(8)}}\\\\`
    // final eq relation
    var rhs = numer/denom
    console.log(rhs)
    if ((rhs > 1) && (rhs < 1.0005)){
        // Rounding issues with calcs
        rhs = 1
    }else if (isNaN(rhs)){ // 0/0 situation
        rhs = 0
    }
    rhs = rhs.toFixed(5)
    code += `cos(\\theta) &= \\hspace{0.2cm} ${rhs}\\\\`
    // final 
    console.log(rhs);
    code += `\\theta &= \\hspace{0.2cm} ${Math.acos(rhs) * 360 / (2 * Math.PI)}^{\\circ} \\\\`
    return "\\begin{align*}\\\\" +code + "\\end{align*}";
}

function hexCalc(p1, p2, a, c){
    var code = "cos(\\theta) &= \\hspace{0.2cm} \\frac{h_1 h_2 + k_1 k_2 + \\frac{h_1 k_2 + h_2 k_1}{2} + \\frac{3a^2}{3c^2} l_1 l_2}"
    code += "{\\sqrt{h_{1}^2 + k_{1}^2  + h_1 k_1 + \\frac{3a^2}{4 c^2} l_{1}^2} \\sqrt{h_{2}^2 + k_{2}^2  + h_2 k_2 + \\frac{3a^2}{4 c^2} l_{2}^2} }\\\\"
    // Pluging in numerator values
    code += `&= \\hspace{0.2cm} \\frac{${p1[0]} \\cdot ${p2[0]} + ${p1[1]}\\cdot ${p2[1]} + \\frac{${p1[0]} \\cdot${p2[1]} + ${p2[0]} \\cdot${p1[1]}}{2} + \\frac{3 \\cdot${a}^2}{3 \\cdot ${c}^2} ${p1[2]} \\cdot${p2[2]}}`
    // denom values 
    code += `{\\sqrt{${p1[0]}^2 + ${p1[1]}^2  + ${p1[0]} \\cdot${p1[1]} + \\frac{3 \\cdot${a}^2}{4 \\cdot${c}^2} ${p1[2]}^2}`
    code += `\\sqrt{ ${p2[0]}^2 +  ${p2[1]}^2  +  ${p2[0]} \\cdot ${p2[1]} + \\frac{3\\cdot ${a}^2}{4 \\cdot${c}^2}  ${p2[2]}^2} }\\\\`
    // Computeing inner terms 
    var buff  = 3 * a *a / (4 * c * c)
    var numer = p1[0]* p2[0] + p1[1] * p2[1] + (p1[0] *p2[1] +p1[1]* p2[0]) /2  + buff * p1[2] * p2[2];
    var p1root = p1[0] ** 2 + p1[1] ** 2 + p1[1] * p1[0] + buff * p1[2] ** 2
    var p2root = p2[0] ** 2 + p2[1] ** 2 + p2[1] * p2[0] + buff * p2[2] ** 2
    code += `&= \\hspace{0.2cm} \\frac{${numer}}{\\sqrt{${p1root}} \\sqrt{${p2root}}} \\\\`
    // Compute RHS
    var rhs = numer / (Math.sqrt(p1root) * Math.sqrt(p2root));
    if ((rhs > 1) && (rhs < 1.0005)){
        // Rounding issues with calcs
        rhs = 1
    }else if (isNaN(rhs)){ // 0/0 situation
        rhs = 0
    }
    rhs = rhs.toFixed(5)
    code += `cos(\\theta) &= \\hspace{0.2cm} ${rhs} \\\\`
    code += `\\theta  &= \\hspace{0.2cm} ${Math.acos(rhs) * 360 / (2 * Math.PI)} \\\\`
    return "\\begin{align*}\\\\" +code + "\\end{align*}";
}

function dotProd(p1, p2){
    var tot = 0
    for (var i=0; i<p1.length; i++){
        tot += p1[i] * p2[i]
    }
    return tot;
}