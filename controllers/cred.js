module.exports =
  {
    GetReading,
    GetWriting,
  };

let AWS = require('aws-sdk'        );
let PS  = require('aws-param-store');

let region_descriptor = { region: 'us-west-2'};

AWS.config.update(region_descriptor);


let
  result = PS.getParameterSync('/byu/econtacts/credentials', region_descriptor);
let
  credentials = JSON.parse(result.Value);


function GetReading() { return credentials[1]; }
function GetWriting() { return credentials[2]; }
