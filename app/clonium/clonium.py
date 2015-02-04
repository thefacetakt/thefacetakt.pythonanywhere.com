from flask import render_template, request, redirect, jsonify

from ..views import app

import os
from hashlib import md5

import json

DATA_FILE = os.path.dirname(__file__) + "/map.txt"


def load_data():
    data_file = open(DATA_FILE, 'r')
    return eval(data_file.read())

map, turn = load_data()

def save_data():
    global turn
    data_file =  open(DATA_FILE, 'w')
    print(repr((map, turn)), file=data_file)
    data_file.close()

def clear_data():
    global map, turn
    map = [[{'value' : '0', 'color' : 'rgb(255, 255, 255)'}] * 8 for i in range(8)]
    map[1][1] = {'value' : '3', 'color' : "rgb(255, 3, 62)"}
    map[6][6] = {'value' : '3', 'color' : "rgb(0, 165, 80)"}
    turn = 0
    save_data()

def hashedData():
    global map, turn
    string_data_prefix = ""
    string_data_suffix = ""
    for i in map:
        for j in i:
            string_data_prefix += str(j['value'])
            string_data_suffix += j['color'].replace(" ", "")
    return md5((string_data_prefix + str(turn) + string_data_suffix).encode("utf-8")).hexdigest()

@app.route("/clonium")
def clonium_index():
    global turn
    return render_template("clonium/field.html", map=map, turn=turn)

@app.route("/clonium/clear", methods=["POST"])
def clonium_clear():
    clear_data()
    return redirect("/clonium")

@app.route("/clonium/update_servers", methods=["POST"])
def clonium_update_servers():
    global map, turn
    map, turn = eval(request.form["map"]), eval(request.form["turn"])
    save_data()
    return redirect("/clonium")

@app.route("/clonium/update_clients", methods=["POST"])
def clonium_update_clients():
    global map, turn
    if (hashedData() != request.form["data"]):
        print("Reload")
        return jsonify({
            "differ" : True,
            "map" : map,
            "turn" : turn
            })
    else:
        return jsonify({
            "differ" : False
            })
