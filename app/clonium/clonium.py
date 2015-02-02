from flask import render_template

from ..views import app

@app.route("/clonium")
def clonium_index():
    return render_template("clonium/field.html")