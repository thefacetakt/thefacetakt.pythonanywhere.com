from flask import render_template, redirect, request

from .urls import get_url, add_url

from ..views import app

from .config import SERVER_URL

form_data = {'url' : '', 'short_url' : ''}
wrong_form = False

def make_normal(url):
    if (url[:7] == "http://" or url[:8] == "https://"):
        return url
    else:
        return "http://" + url

@app.route("/shortener")
def shortener_index():
    global form_data, wrong_form
    to_return = render_template("shortener/add_url.html", wrong_form=wrong_form, url=form_data['url'], short_url=form_data['short_url'])
    form_data = {'url' : '', 'short_url' : ''}
    wrong_form = False
    return to_return

@app.route("/shortener/added/<url_id>")
def result(url_id):
    return render_template("shortener/result.html", url=SERVER_URL + "shortener/link/" + url_id)

@app.route("/shortener/new_url", methods=["POST"])
def new_url():
    global form_data, wrong_form
    url = add_url(make_normal(request.form['url']), request.form['short-url'])
    if (url is None):
        wrong_form = True
        form_data['url'], form_data['short_url'] = request.form['url'], request.form['short-url']
        return redirect("/shortener")
    return redirect("/shortener/added/" + url)
    

@app.route("/shortener/link/<url_id>")
def return_url(url_id):
    return redirect(get_url(url_id))
