

var coordsInput = new Map();
var planesInput = new Map();
window.onload = function() {
    // var latex = document.getElementById("submit");

}

function createLatex() {
    /* submit button */
    var area = document.getElementById("contentArea");
    var hiddenArea = document.getElementById("hiddenArea");

    var coords = fetchCoords();
    var reflections = fetchReflections();

    var latexCode = createLatexString(coords, reflections);
    area.innerHTML = latexCode
    hiddenArea.innerHTML = latexCode
    // render latex
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'contentArea']);
    // Download link 
    a = document.getElementById("download");
    a.download = "latexcode.tex";
    a.href = "data:text/html," + latexCode;

}



function evaluateFraction(val) {
    /* Checking for fraction vs decimals, returns object
    obj.n = numerator
    obj.d = denominator
    */
    var frac = new Object();
    if (val.includes("/")) {
        var buff = val.split("/")
        frac.n = eval(buff[0]);
        frac.d = eval(buff[1]);
    } else {
        frac.n = eval(val);
        frac.d = 1;
    }
    return frac;
}

function fetchReflections() {
    /* 
    converts selection to list of tuples
    returns array
    */
    var refs  = []
    for (var idkey in planesInput){
        refs.push(planesInput[idkey])
    }
    return refs
}

function fetchCoords() {
    /* 
    converts coord map to useable map 
    key = element
    value = list of coords
    returns map
    */
    var map = new Map()

    for (var idkey in coordsInput){
        var buff = coordsInput[idkey]
        var ele = buff[0]
        var coord = buff.slice(1,4);
        if (map[ele] == undefined || map[ele] == null ) {
            map[ele] = new Array();
            map[ele].push(coord)
        }else{
            map[ele].push(coord)
        }
    }

    return map;
}

function createLatexString(coords, reflections) {
    var master_string = ""
    master_string += "\\begin{align*}"
    master_string += create_full_eq(coords) + "\\end{align*} "
    // Iterate over reflections to do one for each
    for (var i = 0; i < reflections.length; i++) {
        var ref = reflections[i]
        master_string += "\\begin{align*} \n"
        expanded = create_full_eq(coords, indicies = ref);
        var simplified = create_simplified_eq(coords, ref);
        var s1 = simplified[0]
        var s2 = simplified[1]
        var s3 = simplified[2]

        master_string += expanded
        master_string += s1 + s2 + s3
        master_string += "\\end{align*}"
    }
    return master_string;
}

function create_full_eq(data, indicies = ["h", "k", "l"]) {
    // Creates the full term with just variable names;
    // data should be a dictionary with key = element name and value = coordinates
    var new_line = " \\\\  & + "
    var eq = "F_{" + indicies.join("") + "} =& \\hspace{0.2cm} ";
    // Iterate over coordinates
    for (var k in data) {
        v = data[k]
        eq += create_term(k, v, indicies = indicies) + new_line
    }
    eq = eq.substr(0, eq.length - new_line.length) + "\\\\"
    return eq
}

function create_term(name, coords, indicies, simple = false) {
    // Generates term for overal list (full summation term)
    // coords is a list of coordinate, name should be element
    var term = ""
    cnt = 0
    // Iterate of coordinates and generates exponent for each. Appends together
    for (var i = 0; i < coords.length; i++) {
        c = coords[i]
        exp_term = exponentTermLatex(c, indicies = indicies, simple = simple)
        if (cnt == 4) {
            cnt = 0
            term += "\\\\  & \\hspace{0.2cm} "
        }
        if (i == 0) {
            term = exp_term
        }
        else {
            term += " + " + exp_term
        }
        cnt += 1
    }
    return `f_{${name}} (${term})`
}

function exponentTermLatex(coords, indicies = ["h", "k", "l"], simple = false) {
    //  exp term e^(2 pi i (h*a + k *b + l * c))
    // Fully Expanded
    // coords = tuple/array of size 3
    var buff = ""
    // iterating over coordinates and reflection; akin to zip(coord, reflect)
    for (var i = 0; i < coords.length; i++) {
        var coor = coords[i]
        var miller_idc = indicies[i]
        // Latex formating
        if (coor == 0) {
            if (simple) {
                var term = ""
            } else {
                term = "0"
            }
        } else if (coor == 1) {
            term = str(miller_idc)
        } else if (coor % 1 == 0) {
            term = `{${coor.n}} \\cdot {${miller_idc}}`
        } else {
            if (coor.n == 1) {
                term = `\\frac{${miller_idc}}{${coor.d}}`
            } else if (coor.d == 1) {
                term = `${coor.n} \\cdot ${miller_idc}`
            } else {
                term = `\\frac{${coor.n} \\cdot ${miller_idc}}{${coor.d}}`
            }
            if (buff == "") {
                buff = term
            } else if (term != "") {
                buff += " + " + term
            }
        }
    }
    if (buff == "") {
        buff = "0"
    }
    var exp_term = `e^{2 \\pi i(${buff})}`
    return exp_term
}

function create_simplified_eq(data, reflection) {
    /* 
    Creatings lines 3-5
    3: simplified hkl values
    4: computed exponents to complex numbers
    5: most simplified version
    */
    var main_func = ""
    var comp = ""
    var simp_comp = ""
    for (var k in data) {
        var v = data[k]
        var simplifiedTerm = create_simplified_term(k, v, reflection)
        var main = simplifiedTerm[0]
        var computed = simplifiedTerm[1]
        var simplified_computed = simplifiedTerm[2]

        // Latex formating
        if (main_func == "") {
            main_func = main
        } else {
            main_func += "\\\\& + \\hspace{0.2cm}" + main
        }
        if (comp == "") {
            comp = computed
        } else {
            comp += "\\\\& + \\hspace{0.2cm}" + computed
        }
        if (simp_comp == "") {
            simp_comp = simplified_computed
        } else {
            if (simplified_computed.trim() != "") {
                simp_comp += simplified_computed
            }
        }
    }
    // If the value is empty, it means that nothing was computed so
    // it is a forbidden reflection
    if (simp_comp.trim() == "") {
        simp_comp = "0 (Forbidden Reflection) \\\\"
    }
    simp_comp = simp_comp.replace(new RegExp("^[\+]+|[\+]+$g"), "");
    // Formating
    main_func = `=& \\hspace{0.2cm}${main_func} \\\\`
    comp = `=& \\hspace{0.2cm}${comp} \\\\`

    simp_comp = `=& \\hspace{0.2cm}${simp_comp} \\\\`
    return [main_func, comp, simp_comp]
}

function create_simplified_term(name, coords, reflection) {
    /*
    Creates lines 3-5: 
    3: exponents with added hkl fraction
    4: exponents computed to complex numbers
    5: simplified terms (final form)
    */
    var buff = ""
    var buff_computed = ""
    var simplified_computed = ""
    var real = 0
    var imag = 0
    var cnt = 0
    var cnt_imag = 0
    // Iterate over coordinates b/c of summation
    for (var j = 0; j < coords.length; j++) {
        var c = coords[j]
        // Computed the exponent value
        exp_term = tuple_dot(evalFrac(c), reflection)
        // exponent for line 3
        term = `e^{{2  \\pi i(${exp_term.toFixed(5)})}}`
        // value for line 4, returns complex number in tuple form
        var expbuff = compute_exp(exp_term);
        var r = expbuff[0]
        var i = expbuff[1]
        real += r
        imag += i

        // this is for formating latex (latex doesnt wrap by default)
        if (cnt_imag >= 2) {
            cnt_imag = 0
            buff_computed += "\\\\  & \\hspace{0.2cm}"
        }
        // Checking if the imag or real part is 0, drops if it is
        // Creating line 4
        if ((r == 0) && (i == 0)) {
            var computed_term = "0";
        } else if ((r == 0) && (i != 0)) {
            computed_term = `${i.toFixed(5)}i`
            cnt_imag += .5
        } else if ((r != 0) && (i == 0)) {
            computed_term = `${r.toFixed(5)}`
            cnt_imag += .5
        } else {
            computed_term = `[${r.toFixed(5)} + ${i.toFixed(5)}i]`
            cnt_imag += 1
        }
        // More  latex formating
        if (buff_computed == "") {
            buff_computed = computed_term
        } else {
            buff_computed += " + " + computed_term
        }
        if (cnt == 4) {
            cnt = 0
            buff += "\\\\&"
        }
        if (buff == "") {
            buff = term
        } else {
            buff += " + " + term + ""
        }
        cnt += 1  // Counter for new line
    }


    // Final forms, line 5
    var cutoff = document.getElementById("forbidden").value
    try{ 
        cutoff = eval(cutoff)
    }catch (error){
        cutoff = 1e-10
    }
    if (Math.abs(real) < cutoff) {
        real = 0
    }
    if (Math.abs(imag) < cutoff) {
        imag = 0
    }
    // Checking for 0 parts, drop if real or imag = 0
    if ((real == 0) && (imag == 0)) {
        simplified_computed = ""
    } else if ((real == 0) && (imag != 0)) {
        simplified_computed = `{${Math.abs(imag.toFixed(10))}}i f_{${name}}`
        if (imag > 0) {
            simplified_computed = "+ " + simplified_computed
        }
        else {
            simplified_computed = "- " + simplified_computed
        }
    } else if ((real != 0) && (imag == 0)) {
        simplified_computed = `{${Math.abs(real.toFixed(10))}} f_{${name}}`
        if (real > 0) {
            simplified_computed = "+ " + simplified_computed
        }
        else {
            simplified_computed = "- " + simplified_computed
        }
    } else {
        simplified_computed = `+ (${real.toFixed(10)} + ${imag.toFixed(10)}i)f_{${name}}`
    }
    var main = `f_{${name}}(${buff})`
    var computed = `f_{${name}}(${buff_computed})`
    // returns the 3 terms.
    return [main, computed, simplified_computed]
}

function evalFrac(x) {
    /*
    evaluating the values of fractions (fractions used for formating)
    */
    var buff = [];
    for (var i = 0; i < x.length; i++) {
        buff.push(x[i].n / x[i].d)
    }
    return buff
}


function tuple_dot(v1, v2) {
    /* 
    dot product for 2 tuples (lacks size check)
    */
    var tot = 0
    for (var i = 0; i < v1.length; i++) {
        tot += v1[i] * v2[i]
    }
    return tot
}

function compute_exp(x) {
    /*
    Uses Eurler formula for imag and real terms
    */
    var real = Math.cos(2 * Math.PI * x)
    var imag = Math.sin(2 * Math.PI * x)
    if (Math.abs(real) < 1e-10) {
        real = 0
    }
    if (Math.abs(imag) < 1e-10) {
        imag = 0;
    }
    return [real, imag]

}


// Adding data
function addAtom() { 
    ele = document.getElementById("ele").value.trim()
    x = document.getElementById(`x`).value
    y = document.getElementById(`y`).value
    z = document.getElementById(`z`).value

    var data = [ele, evaluateFraction(x), evaluateFraction(y), evaluateFraction(z)]
    var name = `${ele}${x}${y}${z}`
    coordsInput[name] = data;
        

    var code = `
    <div id = '${name}'> 
        <div class="row"> 
            <div class="col">  
                ${data[0]}: (${x},${y},${z}) 
            </div>
            <div class="col">
                <button onclick="removeAtom('${name}')">Remove</button>
            </div> 
        </div>
    </div>`
    var buff = document.getElementById(`added_atoms`)
    buff.innerHTML = buff.innerHTML + code
}

function removeAtom(id) { 
    document.getElementById(id).remove()
    delete coordsInput[id]
}



function addPlane() { 
    h2 = document.getElementById(`h`).value
    k2 = document.getElementById(`k`).value
    l2 = document.getElementById(`l`).value

    var plane = [parseInt(h2), parseInt(k2), parseInt(l2)]
    var name = `plane${h2}${k2}${l2}`

    planesInput[name] = plane

    var code = `
    <div id = '${name}'> 
        <div class="row"> 
            <div class="col">  
                (${plane.join(',')}) 
            </div>
            <div class="col">
                <button onclick="removePlane('${name}')">Remove</ button> 
            </div> 
        </div>
    </div>`
    var buff = document.getElementById(`added_planes`)
    buff.innerHTML = buff.innerHTML + code
}

function removePlane(id) { 
    document.getElementById(id).remove()
    delete planesInput[id]

}

function example(){
    excoord = {
        "Co": [['1/3', '2/3', '1/6'], [1,1,'1/2'], ['2/3', '1/3', '5/6']], 
        "O": [[0, 0, 0.23958700], ['2/3','1/3', 0.09374633], ['2/3', '1/3', 0.57292033], ['1/3', '2/3', 0.42707967],['1/3', '2/3', 0.90625367], [0,0,0.76041300]],
        "Li": [[0,0,0], ['2/3', '1/3', '1/3'], ['1/3','2/3', '2/3']]
    }
    exref = [[1,0,4], [-2, 1,0], [0, 0, 1], [0, 0, 2], [0, 0, 3], [0, 0, 4], [1, 0, 0], [1, 0, 1]]
    for (var key in excoord){
        document.getElementById("ele").value = key;
        var points = excoord[key];
        for (var i=0; i<points.length; i++){
            var buff = points[i]
            document.getElementById("x").value = buff[0];
            document.getElementById("y").value = buff[1];
            document.getElementById("z").value = buff[2];
            addAtom()
        }
    }
    for (var i=0; i<exref.length; i++){
        var buff = exref[i];
        document.getElementById("h").value = buff[0];
        document.getElementById("k").value = buff[1];
        document.getElementById("l").value = buff[2];
        addPlane();
    }
    createLatex();
    
}