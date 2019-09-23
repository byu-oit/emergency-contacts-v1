'use strict'

module.exports =
  {
    GetContactList,

    CreateContact,
    UpdateContact,
    DeleteContact,

    TestContact,
  };

let auth  = require('./auth');
let prin  = require('./principal');


let empty_response =
  {
    "length": 0,
  };





function GetContactList(tok, byu_id)
{
  if(!auth.ReadIsAuthorized(tok,byu_id)) return empty_response;

  let p = prin.GetPrincipal(byu_id)

  if(p.length < 1) return empty_response;

  let qsql = "select principal_id, sequence_no, relation_type, name, phone, email, address1, address2, address3, address4, address5 " +
    "from join_contacts "   +
    "where principal_id = ?";

  let pid = p[0].principal_id;

  let result = auth.MySqlReader(qsql, [ pid ] );

  return result;
}





function iGetContactID(sequence_no)
{
  if(sequence_no == 0) return 0;

  let csql = "select count(*) as contact_count from contacts where contact_id = ?";

  let result = auth.MySqlReader(csql, [ sequence_no ] );

  if(result.contact_count == 0) return 0;

  return sequence_no;
}





function iHasValue(field)
{
  if(field == null   ) return false;
  if(field.length < 1) return false;

  return true;
}





function iCountMeansOfCommunication(tok, contact)
{
  let result =
    {
      principal_id : tok.principal_id,
      contact_id   : 0,

      relation_id  : 0,
      name         : contact.name,
      phone        : contact.phone,
      email        : contact.email,
      address1     : contact.address1,
      address2     : contact.address2,
      address3     : contact.address3,
      address4     : contact.address4,
      address5     : contact.address5,

      means        : 0
    };

  let means = 0;

  result.contact_id  = iGetContactID(contact.sequence_no); // on insert, we will have zeroes here
  result.relation_id = prin.GetRelationID(tok,contact.relation_type)

  if(iHasValue(result.phone)   ) means += 0x20; else result.phone    = " ";
  if(iHasValue(result.email)   ) means += 0x40; else result.email    = " ";
  if(iHasValue(result.address1)) means += 0x01; else result.address1 = " ";
  if(iHasValue(result.address2)) means += 0x02; else result.address2 = " ";
  if(iHasValue(result.address3)) means += 0x04; else result.address3 = " ";
  if(iHasValue(result.address4)) means += 0x08; else result.address4 = " ";
  if(iHasValue(result.address5)) means += 0x10; else result.address5 = " ";

  result.means = means; // requirement is that means be >= 0x20

  return result;
}





function CreateContact(tok, _contact) // no other user beside caller may create a user's contact
{
  if(!auth.WriteIsAuthorized(tok, _contact.byu_id)) return 0;

  let contact = iCountMeansOfCommunication(tok, _contact);

  if(contact.means < 0x20) return 0; // phone or email is required, addresses optional

  let isql = "insert into contacts(principal_id, relation_type_enum_id, name, phone, email, address1, address2, address3, address4, address5)" +
    " values(?,?,?,?,?,?,?,?,?,?)";

  let sql_params =
    [
      tok.principal_id,
      contact.relation_id,
      contact.name,
      contact.phone,
      contact.email,
      contact.address1,
      contact.address2,
      contact.address3,
      contact.address4,
      contact.address5
    ];

  let result = auth.MySqlWriter(isql, sql_params);

  return result.insertId;
}





function UpdateContact(tok, _contact)
{
  if(_contact.byu_id.length == 0                ) return false;
  if(!auth.WriteIsAuthorized(tok, _contact.byu_id)) return false;

  let contact = iCountMeansOfCommunication(tok, _contact);

  if(contact.contact_id == 0 || contact.means == 0) return false;

  let usql = "update contacts set         " +
    "  name                  = ?," +
    "  email                 = ?," +
    "  phone                 = ?," +
    "  relation_type_enum_id = ?," +
    "  address1              = ?," +
    "  address2              = ?," +
    "  address3              = ?," +
    "  address4              = ?," +
    "  address5              = ? " +
    "where contact_id        = ? " ;

  let params =
    [
      contact.name,
      contact.email,
      contact.phone,
      contact.relation_id,
      contact.address1,
      contact.address2,
      contact.address3,
      contact.address4,
      contact.address5,
      contact.contact_id
    ];

  let result = auth.MySqlWriter(usql, params );

  if(result.affectedRows > 0) return true;

  return false;
}





function DeleteContact(tok, byu_id, seq_no)
{
  if(!auth.WriteIsAuthorized(tok, byu_id)) return false;

  let dsql = "delete from contacts where principal_id = ? and contact_id = ?";

  let result = auth.MySqlWriter(dsql, [ tok.principal_id, seq_no ] );

  if(result.affectedRows > 0) return true;

  return false;
}





function iGetSequenceNo(tok, byu_id, contact_name) // not exported, used for testing only
{
  if(!(auth.WriteIsAuthorized(tok, byu_id))) return 0;

  let pid = tok.principal_id;

  if(tok.byu_id != byu_id)
  {
    pid = prin.GetPrincipalID(byu_id);
  }

  let gsql = "select contact_id from contacts where principal_id = ? and name = ?";

  let result = auth.MySqlReader(gsql, [ pid, contact_name]);

  if(result.length) return result[0].contact_id;

  return 0;
}


//    T E S T        T E S T        T E S T        T E S T        T E S T        T E S T        T E S T        T E S T





let contact_new =
  {
    byu_id       : "x",
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
  };

let contact_mod =
  {
    byu_id       : "x",
    sequence_no  : 0,
    name         : "Lauren Frederiksen",
    relation_type: "Child",
    phone        : "(248)420-5820",
    email        : "laurenells1@gmail.com",
    address1     : "2944 Burnham",
    address2     : "LasVegas",
    address3     : "NV",
    address4     : "89169",
    address5     : "USA"
  };




function TestGetContacts(tok, byu_id)
{
  let contacts = GetContactList(tok, byu_id);

  let n = contacts.length;

  let i;

  for(i = 0; i < n; ++i)
  {
    let contact = contacts[i];

    console.log("Contact: ", contact.name);
  }

  return contacts;
}


let mybyu = "530347213";



function TestNewContact(tok, byu_id)
{
  contact_new.byu_id      = byu_id;
  contact_new.sequence_no = 0;

  let cid = CreateContact(tok,contact_new);

  contact_mod.sequence_no = cid;

  console.log(cid);

  return cid;
}



function TestModifyContact(tok, byu_id, seq_no)
{
  contact_mod.byu_id      = byu_id;
  contact_mod.sequence_no = seq_no;

  let result = UpdateContact(tok, contact_mod);

  console.log(result);
}



function TestDeleteContact(tok, byu_id, seq_no)
{
  let result = DeleteContact(tok, byu_id, seq_no);

  console.log(result);
}



function iSelectContactID(contacts, name)
{
  let n = contacts.length;

  for(let i = 0; i < n; ++i)
  {
    let contact = contacts[i];

    if(contact.name == name) return contact.sequence_no;
  }

  return 0;
}




function TestContact(tok)
{
  let contacts = TestGetContacts(tok, mybyu);

  let seq_no = iSelectContactID(contacts, "Lauren Frederiksen");

  if(seq_no == 0) seq_no = iGetSequenceNo(tok, mybyu, "Lauren Frederiksen");

  if(seq_no == 0) seq_no = TestNewContact(tok, mybyu);

  TestModifyContact(tok, mybyu, seq_no);

  TestDeleteContact(tok, mybyu, seq_no);

  TestGetContacts(tok, mybyu);

  return true;
}
