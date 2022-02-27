import flask
from flask import request
import time

app = flask.Flask(__name__)

@app.route('/')
def main():
    return flask.render_template('mainpg.html')


@app.route('/be')
def backend():
    print(request.headers.get('test-header'))
    return {"H":[str(int(time.time()))]}
@app.route('/be2')
def backend2():
    return str(time.asctime(time.localtime(time.time())))
@app.route('/static/liveUpdate')
def serveStatic():
    #return flask.send_from_directory('static','main.js')
    return "console.log('hi')"
app.run(port="80")