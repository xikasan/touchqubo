# -*- coding: utf-8 -*-

from flask import Flask, render_template
import numpy as np
from openjij import SQASampler


# Parameters
Nq = 5  # num of Qubit


class QuboMatrix:

    def __init__(
        self,
        size: int,
        random: bool = False
    ):
        assert size > 0, f"size is expected >0, but {size} is given."
        self.size: int = size
        self.qubo: np.ndarray = None
        if random:
            self.reset()

    def reset(self, qubo: np.ndarray = None) -> None:
        if qubo is None:
            qubo = np.random.normal(0., 1., (self.size, self.size))
        assert qubo.shape == (self.size, self.size), \
        f"QUBO shape is expected ({self.size}, {self.size}), but {qubo.shape} is given."
        self.qubo = qubo

    def tolist(self):
        return self.qubo.tolist()


def proc_index():
    qm = QuboMatrix(Nq)
    qm.reset()
    qubo = qm.tolist()
    return qubo


app = Flask(__name__)


@app.route("/")
def index():
    qubo = proc_index()
    scores = np.random.normal(0, 1, Nq).tolist()
    return render_template("index.html", qubo=qubo, scores=scores)


@app.route("/run/<qubostr>/<scorestr>")
def run(qubostr, scorestr):
    # retrieve qubo from url
    qubostr_ = qubostr[:-1]
    splitted_qubostrs = qubostr_.split("+")
    qs = [float(qstr) for qstr in splitted_qubostrs]
    qubo = np.reshape(qs, (Nq, Nq))

    # sample solution with qubo
    sampler = SQASampler()
    res = sampler.sample_qubo(qubo, )
    x = np.asarray(list(res.first.sample.values()))
    print(x)

    # compute score
    scorestr_ = scorestr[:-1]
    splitted_scorestrs = scorestr_.split("+")
    scores = np.array([float(sstr) for sstr in splitted_scorestrs])

    score = scores @ x
    print(score)
    return render_template("debug.html", score=score)


if __name__ == '__main__':
    app.run(debug=True)
