'use strict'

module.exports =
  {
    GetRelationList,
    GetContactList,
    InsertContact,
    UpdateContact,
    DeleteContact,

    TestWebAPI
  };

const cont     = require("./contacts" );
const prin     = require("./principal");
const jfactory = require("byu-jwt"    );
const express  = require("express"    );
const app      = express();
const jwt      = jfactory(); // parameters need to be added here

app.use(jwt.authenticateUAPIMiddleware);


function ShowItems(label, list)
{
  if(list == null) return;

  console.log(label);

  let i; let item;

  for(i = 0; i < list.length; ++i)
  {
    item = list[i];

    console.log(item);
  }
}


let test1 =
  {
    verifiedJWTs:
      {
        claims:
          {
            byuId   : "530347213",
            sortName: "Ellsworth, Mark G."
          }
      },
    params:
      {
        byu_id: "530347213", // THESE ARE FOUND ON THE URI PATH
        sequence_no: 0,
      },
    body:
      {
        byu_id       : "530347213",
        sequence_no  : 0,
        name         : "Lauren Frederiksen",
        relation_type: "Child",
        phone        : "(248)420-5820",
        email        : "laurenells1@gmail.com",
        address1     : "2944 Burnham",
        address2     : null,
        address3     : null,
        address4     : "89169",
        address5     : "USA"
      }
  };

let test2 =
  {
    verifiedJWTs:
      {
        claims:
          {
            byuId   : "530347213",
            sortName: "Ellsworth, Mark G."
          }
      },
    params:
      {
        byu_id: "530347213", // THESE ARE FOUND ON THE URI PATH
        sequence_no: 33,
      },
    body: // FOUND IN THE BODY!
      {
        byu_id       : "530347213",
        sequence_no  : 32,
        name         : "Lauren Frederiksen",
        relation_type: "Child",
        phone        : "(248)420-5820",
        email        : "laurenells1@gmail.com",
        address1     : "2944 Burnham",
        address2     : "LasVegas",
        address3     : "NV",
        address4     : "89169",
        address5     : "USA"
      }
  };


function GetRelationList(request, response)
{
  let
    tok = prin.CreateAccessToken(request.verifiedJWTs.claims);

  if(!tok.grant_scan)
  {
    if(response != null) response.status(500).send("Query refused.");

    return;
  }

  let list = prin.GetRelationList(tok);

  if(response == null)
  {
    ShowItems("RelationTypes", list);

    return;
  }

  if(list.length)
  {
    response.status(200).send(list);

    return;
  }

  response.status(500).send("Query failed.");
}





function GetContactList(request, response)
{
  let
    tok = prin.CreateAccessToken(request.verifiedJWTs.claims); // alternate use client instead of claims ?
  let
    list = cont.GetContactList(tok, request.params.byu_id);

  if(response == null)
  {
    ShowItems("Contacts", list);

    return;
  }

  if(list.length)
  {
    response.status(200).send(list);

    return;
  }

  response.status(500).send("Query failed.");
}





function InsertContact(request, response)
{
  let
    tok = prin.CreateAccessToken(request.verifiedJWTs.claims); // alternate use client instead of claims ?
  let
    cid = cont.CreateContact(tok, request.body);

  if(response == null)
  {
    console.log("Posted Identity: ", cid);

    if(cid) // this needs to be removed in production code
    {
      test2.params.sequence_no = cid;

      test2.body.sequence_no = cid;
    }

    return;
  }

  if(cid)
  {
    let reply =
      {
        byu_id     : tok.byu_id,
        sequence_no: cid
      };

    response.status(200).send(reply);

    return;
  }

  response.status(500).send("Insert failed.");
}





function UpdateContact(request, response)
{
  let
    tok = prin.CreateAccessToken(request.verifiedJWTs.claims); // alternate use client instead of claims ?
  let
    bool = cont.UpdateContact(tok, request.body);

  if(response == null)
  {
    if(bool) console.log("Put Suceeded");
    else     console.log("Put Failed"  );

    return;
  }

  // the sequence number should also appear in the body, why do it twice ?

  if(bool)
  {
    response.status(200).send("Update Succeeded");

    return;
  }

  response.status(500).send("Delete Failed");
}





function DeleteContact(request, response)
{
  let
    tok = prin.CreateAccessToken(request.verifiedJWTs.claims); // alternate use client instead of claims ?
  let
    bool = cont.DeleteContact(tok, request.params.byu_id, request.params.sequence_no);

  if(response == null)
  {
    console.log("Delete Result: ", bool);

    return;
  }

  if(result)
  {
    response.status(200).send("Delete Succeeded");

    return;
  }

  response.status(500).send("Delete Failed");
}




//    T E S T        T E S T        T E S T        T E S T        T E S T        T E S T        T E S T        T E S T

function TestWebGetRelations()
{
  GetRelationList(test1, null);
}

function TestWebGetContacts()
{
  GetContactList(test1, null);
}

function TestWebPostContact()
{
  UpdateContact(test1, null);

  GetContactList(test1, null);
}

function TestWebPutContact()
{
  UpdateContact(test2, null);
}

function TestWebDeleteContact()
{
  DeleteContact(test2, null);
}



function TestWebAPI()
{
  TestWebGetRelations();
  TestWebGetContacts();
//TestWebDeleteContact();
//TestWebPostContact();
//TestWebPutContact();
  TestWebDeleteContact();

//TestWebUpdateContact();
}












