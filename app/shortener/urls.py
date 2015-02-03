import os

DATA_FILE = os.path.dirname(__file__) + "/urls.txt"

DATA_ENCODING = "utf-8"

def load_urls():
    data_file = open(DATA_FILE, 'r', encoding=DATA_ENCODING)
    return eval(data_file.read())

reverse_urls, next_url = load_urls()

def add_url(old_url, new_url):
    global next_url
    if (new_url in reverse_urls and reverse_urls[new_url] != old_url):
        return None
    if (new_url == "" or new_url == str(next_url)):
        new_url = str(next_url)
        next_url += 1
    reverse_urls[new_url] = old_url
    save_urls()
    return new_url

def get_url(id):
    return reverse_urls[id]

def save_urls():
    data_file =  open(DATA_FILE, 'w', encoding=DATA_ENCODING)
    print(repr((reverse_urls, next_url)), file=data_file)
    data_file.close()