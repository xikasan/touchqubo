var disp_x = document.body.clientWidth;
var disp_y = document.body.clientHeight;
var cell_size = Math.floor(disp_x / Nq);

let qubo_font_size = Math.floor(cell_size / 3) + "px";
for (let i = 0; i < Nq; i++) {
    for (let j = 0; j < Nq; j++) {
        let elem = document.getElementById("qubo-" + i + "-" + j);
        elem.style.backgroundColor = build_qubo_bgcolor(qubo[i][j]);
        elem.style.width  = cell_size + "px";
        elem.style.height = cell_size + "px";
        elem.style.fontSize = qubo_font_size;
    }
}


document.write("TEST")// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// scores
for (let i = 0; i < Nq; i++) {
    // document.write("score-"+i)
    // document.getElementById("debug-span-2").textContent += i
    let elem = document.getElementById("score-" + i);
    document.write(elem)
    elem.style.backgroundColor = "#cccccc";
    elem.style.width = cell_size + "px";
    elem.style.height = Math.floor(cell_size / 2) + "px"
    elem.style.fontSize = Math.floor(cell_size / 4) + "px"
}

function get_red_val(q) {
    return 100 - Math.floor((q + 1) / 2 * 50);
}

function build_qubo_bgcolor(q) {
    let red_val = get_red_val(q);
    return "hsl(0, 100%, " + red_val + "%)";
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dragger
let qubo_table_width  = document.getElementById("qubo").clientWidth;
let qubo_table_height = document.getElementById("qubo").clientHeight;
// dragger <div> container setting
let elem = document.getElementById("dragger");
elem.style.width  = qubo_table_width  + "px";
elem.style.height = qubo_table_height + "px";
elem.style.marginTop = -qubo_table_height + "px";
// dragger <a> setting
let elem_a = document.getElementById("dragger-a");
elem_a.style.width  = qubo_table_width + "px";
elem_a.style.height = qubo_table_height + "px";


