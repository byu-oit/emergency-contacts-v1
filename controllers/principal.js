'use strict'


module.exports =
  {
    CreateAccessToken, // embeds the principal_id of the person logged in

    GetRelationList,
    GetRelationID,
    GetPrincipalID,
    GetPrincipal,

    TestPrincipal,
  };

let auth  = require('./auth');


let relations = null;

let empty_result =
  {
    "length" : 0
  };





function GetRelationList(tok)
{
  if(auth.ReadIsAuthorized(tok))
  {
    if(relations == null)
    {
      let gsql = "select relation_type_enum_id as relation_id, relation_type from relation_type_enum order by 1";

      relations = auth.MySqlReader(gsql);
    }

    return relations;
  }

  return empty_result;
}





function GetRelationID(tok, rtype)
{
  let result = GetRelationList(tok);

  let n = result.length;

  for(let i = 0; i < n; ++i)
  {
    if(result[i].relation_type == rtype) return result[i].relation_id;
  }

  return 0;
}






function GetPrincipal(byu_id)
{
  let qsql = "select byu_id, principal_id, name as principal_name from principals where byu_id = ?";

  let principals = auth.MySqlReader(qsql, [ byu_id ] );

  return principals;
}





function iInsertPrincipal(byu_id, name) // insert only gets calls when count is 0
{
  let isql = "insert into principals(byu_id, name) values(?,?)";

  let result = auth.MySqlWriter(isql, [ byu_id, name] );

  return result.insertId;
}





function GetPrincipalID(byu_id, name) // not exported, used in access token constructor
{
  let result = GetPrincipal(byu_id);

  if(result.length < 1)
  {
    let pid = iInsertPrincipal(byu_id, name);

    return pid;
  }

  return result[0].principal_id;
}





function CreateAccessToken(claims) // jwt claims
{
  let tok =
    {
      byu_id      : claims.byuId,     // whoever is logged in, most of time self serve, rarely police dept employee
      sort_name   : claims.sortName,  // their name
      principal_id: 0,                // derived from byu_id of whoever is logged in
      grant_scan  : false             // self scan always authorized, others scan restricted
    };

  let pid = GetPrincipalID(tok.byu_id, tok.sort_name);

  if(pid != 0)
  {
    tok.principal_id = pid;

    tok.grant_scan   = auth.GrantScan(tok);
  }

  return tok;
}



//    T E S T        T E S T        T E S T        T E S T        T E S T        T E S T        T E S T        T E S T


function TestGetRelationList(tok)
{
  let rels = GetRelationList(tok);

  let n = rels.length;

  for(let i = 0; i < n; ++i)
  {
    let relation = rels[i];

    console.log(JSON.stringify(relation));
  }
}



function TestGetRelationID(tok)
{
  let result = GetRelationID(tok, "Parent");

  console.log("Relation: ", result);
}





function TestPrincipal(tok)
{
  TestGetRelationList(tok);

  TestGetRelationID(tok);
}