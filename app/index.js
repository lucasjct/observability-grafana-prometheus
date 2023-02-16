var express = require('express');
var promClient = require('prom-client');
const register = promClient.register;

var app = express();

// Instrumentando a aplicação com prom-client,

const counter = new promClient.Counter({
    name: "aula_request_total",
    help: "Contador de requests",
    labelNames: ["statusCode"]

});

const gauge = new promClient.Gauge({ 
    name: 'aula_free_bytes', 
    help: 'exemplo de gauge' 
});

const histogram = new promClient.Histogram({
  name: 'aula_request_time_seconds',
  help: 'Tempo de resposta da API',
  buckets: [0.1, 5, 15, 50, 100, 500]
});



const summary = new promClient.Summary({
  name: 'aula_request_time_seconds_summary',
  help: 'Tempo de resposta da API',
  percentiles: [0.5, 0.9, 0.99]
});

// A cada vez que tiver uma requisição na página, as metricas do promethes
// também serão executadas.

app.get('/', function(req,res){
    
    counter.labels("200").inc();
    counter.labels("300").inc();
    gauge.set(100*Math.random());
    const responseTime = Math.random();
    histogram.observe(responseTime);
    summary.observe(responseTime);

    res.send("Hello Word");
});

// create route
app.get('/metrics', async function(req, res) {

    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});


app.listen(3000);