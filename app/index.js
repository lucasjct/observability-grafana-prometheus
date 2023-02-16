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
    name: 'metric_name', 
    help: 'metric_help' 
});

// A cada vez que a página for chamada, as metricas do promethes
// também será executadas.

app.get('/', function(req,res){
    counter.labels("GET", "200").inc();
    gauge.set(100 * Math.random())
    res.send("Hello Word")
});

// create route
app.get('/metrics', async function(req, res) {

    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
})


app.listen(3000);