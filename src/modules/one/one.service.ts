import { schemaGroup } from 'src/config/ldap-client';
import { Injectable, OnModuleInit, OnModuleDestroy, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { client } from 'src/config/ldap-client';
import * as bcrypt from 'bcrypt';
import { ldapConfig } from 'src/config/ldap-client';

@Injectable()
export class OneService implements OnModuleInit, OnModuleDestroy {
  // CONNECTION
  onModuleInit() {
    client.bind(`cn=${ldapConfig.ldapUser},${ldapConfig.ldapDomain}`, `${ldapConfig.ldapPassword}`, (err) => {
      if (err) {
        console.error('Conexión establecida', err);
      }
    });
  }

  onModuleDestroy() {
    client.unbind((err) => {
      if (err) {
        console.error('Conexión NO establecida');
      }
    });
  }

  // FIND ALL
  async findAll(schema: string[],objectClass: string) {
    try {
      // Preparar consulta
      const options = {
        filter: `(objectClass=${objectClass})`,
        scope: 'sub',
        attributes: schema
      };

      // Lanzar consulta
      const entries = await client.search(ldapConfig.ldapDomain, options);

      // Resultado
      if(entries.length===0){
        return 'Nada que mostrar';
      }else{
        for(let entry of entries){
          
          if(entry.gidNumber){
            entry['group'] = await this.convertGidGroup(parseInt(entry.gidNumber));
            delete entry.gidNumber
          }else{break}

          if(entry.memberUid){
            if(typeof(entry.memberUid) === 'object'){
            const arrayMembers:string[] = entry.memberUid
            entry['listMembers'] = arrayMembers.join(', ')
            delete entry['memberUid']
            }else{
              entry['listMembers'] = entry.memberUid
              delete entry['memberUid']
            }
          }
        }
        return entries;
      }

    } catch (err) {
      console.error(err); throw new InternalServerErrorException('Consulta no llega al servidor');
    }
  }
  
  // FIND ONE
  async findOne(schema: string[],objectClass: string,keyId: string,valueId: any){
    try {
      // Preparar consulta
      const options = {
        filter: `(&(objectClass=${objectClass})(${keyId}=${valueId}))`,
        scope: 'sub',
        attributes: schema
      };
      // Lanzar la consulta
      const entry = await client.search(ldapConfig.ldapDomain, options);

      // Resultado
      return entry[0];

    } catch (err) {
      console.error(err); throw new InternalServerErrorException('Consulta no llega al servidor');
    }
  }

  // FIND FILTER
  async findFilter(schema: string[],ldapFilter: string) {
    try {
      // Preparar consulta
      const options = {
        filter: ldapFilter,
        scope: 'sub',
        attributes: schema
      };
    
      // Lanzar consulta
      const entries = await client.search(ldapConfig.ldapDomain, options);

      // Resultado
      if(entries.length===0){
        return 'Nada que mostrar';
      }else{
        for(let entry of entries){
          
          if(entry.gidNumber){
            entry['group'] = await this.convertGidGroup(parseInt(entry.gidNumber));
            delete entry.gidNumber
          }else{break}

          if(entry.memberUid){
            if(typeof(entry.memberUid) === 'object'){
            const arrayMembers:string[] = entry.memberUid
            entry['listMembers'] = arrayMembers.join(', ')
            delete entry['memberUid']
            }else{
              entry['listMembers'] = entry.memberUid
              delete entry['memberUid']
            }
          }
        }
        return entries;
      }
    } catch (err) {
      console.error(err); throw new InternalServerErrorException('Consulta no llega al servidor');
    }
  }

  // ADD
  async add(dn: string, entry: any) {
    console.log(dn,entry)
    try {
      // Añadir entrada
      await client.add(dn, entry);
      
      return {
        msg: 'Entrada añadida correctamente',
        status: 200,
        entry: dn
      }
    } catch (err) {
      throw new BadRequestException('Error en la inserción de la nueva entrada')
    }
  }

  // AUTOINCREMENT GID NUMBER 
  async autoIncrementGidNumber(){
    try {
      // Preparar consulta                                                                                                                                                  
      const opts = {
        filter: '(&(objectClass=posixGroup)(gidNumber=*))',
        scope: 'sub',
        attributes: ['gidNumber'],
      };
      var entries = await client.search(ldapConfig.ldapDomain, opts);

    } catch (err) {
      console.log(err); throw new InternalServerErrorException('Consulta no llega al servidor');
    }

    // Rango de números utilizables
    const firstGid = 10001;
    let maxGidNumber = firstGid

    if(entries.length!=0){
      maxGidNumber = Math.max(...entries.flatMap( entry => Number(entry.gidNumber)));
      maxGidNumber=maxGidNumber+1;
    }

    const busyGidNumbers = new Set(entries.flatMap(entry => Number(entry.gidNumber)));

    // Generar la lista de números libres
    const freeGidNumbers = [];
    for (let i = firstGid; i <= maxGidNumber; i++) {
      if (!busyGidNumbers.has(i)) {
        freeGidNumbers.push(i);
      }
    }
    return freeGidNumbers[0];
  }

  // AUTOINCREMENT UID NUMBER 
  async autoIncrementUidNumber(){
    try {
      const opts = {
        filter: '(&(objectClass=posixAccount)(uidNumber=*))',
        scope: 'sub',
        attributes: ['uidNumber'],
      };
    
      var entries = await client.search(ldapConfig.ldapDomain, opts);

    } catch (err) {
      console.log(err); throw new InternalServerErrorException('Consulta no llega al servidor');
    }

    // Rango de números utilizables
    const firstUid = 10001;
    let maxUidNumber = firstUid;

    if(entries.length!=0){
      maxUidNumber = Math.max(...entries.flatMap( entry => Number(entry.uidNumber)));
      maxUidNumber = maxUidNumber+1;
    }

    const busyUidNumbers = new Set(entries.flatMap(entry => Number(entry.uidNumber)));

    // Generar la lista de números libres
    let freeUidNumbers = [];
    for (let i = firstUid; i <= maxUidNumber; i++) {
      if (!busyUidNumbers.has(i)) {
        freeUidNumbers.push(i);
      }
    }
    return freeUidNumbers[0];
  }

  // CN <--> GIDNUMBER
  async convertGidGroup(idGroup){
    if(typeof(idGroup)=='number'){
      const result = await this.findOne(schemaGroup,'posixGroup','gidNumber',idGroup);
      if(result.length===0){
        throw new NotFoundException(`No existe grupo con el gidNumber ${idGroup}`)
      }else{
        return result.cn;
      }

    }else if(typeof(idGroup)=='string'){
      const result = await this.findOne(schemaGroup,'posixGroup','cn',idGroup);
      if(result.length===0){
        throw new NotFoundException(`El grupo ${idGroup} no existe`)
      }else{
        return result.gidNumber;
      }
    }
  }

  // MODIFY
  async ldapmodify(operation:string,changes,dn){
    // Se borra la acción del json modificaciones
    if(changes.action){
      delete changes.action;
    }

    try {
      // Preparación de la modificación
      const change = {
        operation: operation, // add, delete, replace
        modification: changes
      };
      // Modificación
      await client.modify(dn, change);

      return {
        msg: `Entrada modificada correctamente`,
        status: 200,
        entry: dn
      }

    } catch (err) {
      return {
        status: err.status,
        msg: err.msg
      }
    }
  }
  
  // DELETE
  async del(dn: string) {
    try {
      await client.del(dn);

      return {
        msg: 'Entrada borrada correctamente',
        status: 200,
        entry: dn
      }
    } catch (err) {
      console.error(err); throw new Error('No se ha borrado nada');
    }
  }

  async getHash(password: string) {
    return await bcrypt.hash(password, 10);
  }


}
