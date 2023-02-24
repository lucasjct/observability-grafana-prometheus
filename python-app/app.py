from flask import Response, Flask, request
import prometheus_client
from prometheus_client.core import CollectorRegistry
from prometheus_client import Summary, Counter, Histogram, Gauge
import time

app = Flask(__name__)

_INF = float('inf')

graphs = {}
graphs['c'] = Counter('python_requests_total', 'Total number for requests')
graphs['h'] = Histogram('python_requests_durantion', 'The latency time for request', buckets=(1,2,5,6,10, _INF))
graphs['g'] = Gauge('python_users_logged', 'Total number for users online')


@app.route('/')
def hello():
    start = time.time()
    graphs['c'].inc()

    time.sleep(0.600)
    end = time.time()
    graphs['h'].observe(end - start)
    graphs['g'].inc()
    return "<h1>Hello Guys</h1>"


@app.route('/metrics')
def requests_count():
    res = []
    for k,v in graphs.items():
        res.append(prometheus_client.generate_latest(v))
    return Response(res, mimetype='text/plain')
