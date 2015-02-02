SERVER_URL = "http://127.0.0.1:5002/"

from flask import render_template, redirect, request

from .urls import get_url, add_url

from ..views import app


def make_normal(url):
    if (url[:7] == "http://" or url[:8] == "https://"):
        return url
    else:
        return "http://" + url

@app.route("/shortener")
def shortener_index():
    return render_template("shortener/add_url.html")

@app.route("/shortener/added/<url_id>")
def result(url_id):
    return render_template("shortener/result.html", url=SERVER_URL + "shortener/link/" + url_id)

@app.route("/shortener/new_url", methods=["POST"])
def new_url():
    url = add_url(make_normal(request.form['url']), request.form['short-url'])
    return redirect("/shortener/added/" + url)
    

@app.route("/shortener/link/<url_id>")
def return_url(url_id):
    return redirect(get_url(url_id))
