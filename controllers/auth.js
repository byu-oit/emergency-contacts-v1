'use strict'

module.exports =
  {

    GrantScan, // you can always read your own stuff..
    GrantAdmin,

    WriteIsAuthorized,
    ReadIsAuthorized,

    MySqlReader,
    MySqlWriter,

    TestAuth
  };

let cred  = require('./cred');
let mysql = require('sync-mysql');

let reader = new mysql(cred.GetReading());
let writer = new mysql(cred.GetWriting());




function MySqlCommand(connection, sql, params)
{
  try
  {
    let result = connection.query(sql, params);

    return result;
  }
  catch(e)
  {
    reader = new mysql(cred.GetReading());
  }

  try
  {
    let result = connection.query(sql, params);

    return result;
  }
  catch(e)
  {
    let result =
      {
        length: 0,
        error: e.message
      };

    return result;
  }

}


function MySqlReader(sql, params)
{
  return MySqlCommand(reader, sql, params);
}


function MySqlWriter(sql, params)
{
  return MySqlCommand(writer, sql, params);
}



function GrantScan(tok)
{
  let asql = "select principal_id from econtact_users where byu_id = ?";

  let users = MySqlReader(asql, [tok.byu_id]);

  if(users.length) return true;

  return false;
}





function GrantAdmin(tok)
{
  let asql = "select principal_id from econtact_administrators where byu_id = ?";

  let admin = MySqlReader(asql, [ tok.byu_id ]);

  let n = admin.length;

  if(n) return true;

  return false;
}



function ReadIsAuthorized(tok, byu_id)
{
  if(tok == null) return false;

  if(tok.byu_id == byu_id || tok.grant_scan) return true;

  return false;
}




function WriteIsAuthorized(tok, byu_id)
{
  if(tok == null) return false

  if(tok.byu_id == byu_id) return true

  return false
}





function TestAuth(tok)
{
  return true;
}



