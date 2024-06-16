export const LdapClient = require('ldapjs-client');

export const client = new LdapClient({
  url: 'ldaps://servidor.dominio.es:636',
  tlsOptions: {
    rejectUnauthorized: false
  }
});

export const schemaOu = ['ou','description'];

export const schemaGroup = ['dn','cn','gidNumber','description','memberUid'];

export const schemaUser = ['uid', 'ou', 'givenName','sn','cn','mail',
                           'telephoneNumber','mobile','gidNumber',
                           'st','title','l','description','userPassword']