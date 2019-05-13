const path = require('path');
const SansServer = require('sans-server');
const SansServerSwagger = require('sans-server-swagger');
const expressTranslator = require('sans-server-express');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/xhealth',function(req,res){res.send('Excellent')});

const api = SansServer();

const swagjson = 
{
  controllers: path.resolve(__dirname, './controllers'),
  swagger: path.resolve(__dirname, './swagger.json'),
  development: true,
  ignoreBasePath: false
};

api.use(SansServerSwagger(swagjson));

app.use(expressTranslator(api));

let port = process.env.PORT || 9072;

function listen_report()
{
  console.log('Beginning Emergency Contact Service');
  console.log('   [INFO] port: ' + port);
  console.log('   [INFO] ctrl: ' + path.resolve(__dirname, './controllers') );
  console.log('   [INFO] swag: ' + path.resolve(__dirname, './swagger.json'));
}

app.listen(port, listen_report);
