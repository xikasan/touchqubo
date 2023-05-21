const apply_interval = 5;

var log_dragged_pos_x = [];
var log_dragged_pos_y = [];
var drag_step_counter = 0;

// qubo
const cw = Math.floor(document.body.clientWidth  / Nq);
const ch = cw;  // Math.floor(document.body.clientHeight / Nq);
const S = cw * ch;

// filter
var filter = [1.0, 0.0, 0.0, 1.0];

// fill pattern
var FP = [
    [
        [0, 0, 0, 1],
        [0, 0, 1, 2],
        [0, 0, 2, 0],
    ],
    [
        [0, 1, 0, 3],
        [1, 2, 3, 4],
        [2, 0, 4, 0],
    ],
    [
        [0, 3, 0, 0],
        [3, 4, 0, 0],
        [4, 0, 0, 0],
    ]
];

var elem_qubo = document.getElementById("qubo");
elem_qubo.addEventListener("mousedown", mdown);
elem_qubo.addEventListener("touchstart", mdown);

var elem_debug_span_1 = document.getElementById("debug-span-1");
var elem_debug_span_2 = document.getElementById("debug-span-2");

function mdown(e) {
    if (e.type == "mousedown") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }

    // reset log array
    log_dragged_pos_x = [];
    log_dragged_pos_y = [];
    drag_step_counter = 0;

    elem_qubo.addEventListener("mousemove", mmove);
    elem_qubo.addEventListener("touchmove", mmove);
    elem_qubo.addEventListener("mouseup",  mup);
    elem_qubo.addEventListener("touchend", mup);
}

function mmove(e) {
    if (e.type === "mousedown") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }
    e.preventDefault();
    let mouse_pos = get_mouse_pos(event);
    elem_debug_span_1.textContent = "(" + mouse_pos[0] + ", " + mouse_pos[1] + ")";
    if ((drag_step_counter % apply_interval) === 0) {
        let rates = compute_overwrap_rates(mouse_pos);
        let dq = zeros()
        let cpos = calc_current_cell(mouse_pos);
        let cx = cpos[0];
        let cy = cpos[1];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                let cx_ = cx + i - 1;
                let cy_ = cy + j - 1;
                if ((cx_ >= 0) && (cy_ >= 0) && (cx_ < Nq) && (cy_ < Nq)) {
                    dq[cy_][cx_] = calc_dval(i, j, rates);
                }
            }
        }
        update_qubo(dq);
    }
    drag_step_counter += 1;
}

function update_qubo(dq) {
    var url_ = "run/"
    for (let i = 0; i < Nq; i++) {
        for (let j = 0; j < Nq; j++) {
            qubo[i][j] += dq[i][j];
            let qij = Math.floor(qubo[i][j] * 100) / 100;
            let elem = document.getElementById("qubo-" + i + "-" + j);
            elem.textContent = qij;
            elem.style.backgroundColor = build_qubo_bgcolor(qij);
            url_ += qij + "+"
        }
    }
    url_ += "/"
    for (let k = 0; k < scores.length; k++) {
        url_ += scores[k] + "+"
    }
    document.getElementById("run-link").href = url_
}

function calc_dval(ix, iy, rates) {
    let fp = FP[ix][iy];
    var dval = 0;
    for (i = 0; i < 4; i++) {
        let idx = fp[i] - 1;
        if (idx < 0) {
            continue;
        }
        let fv = filter[idx];
        dval += fv * rates[i] * apply_interval / 100;
    }
    return dval;
}

function mup(e) {
    elem_qubo.removeEventListener("mousemove", mmove);
    elem_qubo.removeEventListener("touchmove", mmove);
}

function get_mouse_pos(e) {
    let qubo_rect = elem_qubo.getBoundingClientRect();
    let qubo_offset_x = qubo_rect.left;
    let qubo_offset_y = qubo_rect.top;

    let mouse_x = e.pageX - qubo_offset_x;
    let mouse_y = e.pageY - qubo_offset_y;

    return [mouse_x, mouse_y];
}

function compute_overwrap_rates(mouse_pos) {
    let px = mouse_pos[0];
    let py = mouse_pos[1];
    let cx = Math.floor(px / cw);
    let cy = Math.floor(py / ch);
    let px_ = px - cx * cw;
    let py_ = py - cy * ch;
    let pxr = cw - px_;
    let pyr = ch - py_;
    return rates = [
        px_ * py_ / S,
        pxr * py_ / S,
        px_ * pyr / S,
        pxr * pyr / S
    ];
}

function calc_current_cell(mouse_pos) {
    let px = mouse_pos[0];
    let py = mouse_pos[1];
    let cx = Math.floor(px / cw);
    let cy = Math.floor(py / ch);
    return [cx, cy]
}

function zeros() {
    let ret = new Array(Nq);
    for (i = 0; i < Nq; i++) {
        ret[i] = new Array(Nq).fill(0)
    }
    return ret
}

// send qubo for annealer
function run() {
    document.getElementById("debug-span-2").textContent = "Yeah"
    window.location.href("/run")
}
