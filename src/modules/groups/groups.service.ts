import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { groupGet } from 'src/interfaces/group.interface';
import { OneService } from '../one/one.service';
import { schemaGroup } from 'src/config/ldap-client';

@Injectable()
export class GroupsService {
  constructor(private readonly oneService: OneService) {}

  // GET ALL
  async getGroups(groupFilter: groupGet){
    if(Object.keys(groupFilter).length===0){
      return this.oneService.findAll(schemaGroup,'posixGroup');
    }else{
      let ldapFilter = '(&(objectClass=posixGroup)';
    for(let key in groupFilter){
      ldapFilter = ldapFilter + `(${key}=${groupFilter[key]})`;
    }
    ldapFilter = ldapFilter + ')';
    
    return this.oneService.findFilter(schemaGroup,ldapFilter);
    }
  }

  // POST
  async create(createGroupDto: CreateGroupDto) {
    const gidNumber = await this.oneService.autoIncrementGidNumber();

    const ou=createGroupDto.ou
    delete createGroupDto.ou

    // Preparar entrada
    const entry = {
      // Valores por defecto
      objectClass: ['top','posixGroup'],
      gidNumber: gidNumber,
      // Body request
      ...createGroupDto
    };
    // Añadir entrada
    const result = await this.oneService.add(`cn=${entry.cn},ou=${ou},${process.env.DOMAIN}`, entry);
    // Resultado
    return result;
  }

  // UPDATE
  async update(cn: string, UpdateGroupDto: UpdateGroupDto) {
    // Localizamos el grupo a modificar
    const currentGroup = await this.oneService.findOne(schemaGroup,'posixGroup','cn',cn);

    // Modificación
    const result = await this.oneService.ldapmodify(UpdateGroupDto.action,UpdateGroupDto,currentGroup.dn);

    // Resultado
    return result;
  }

  // DELETE
  async remove(cn: string) {
    // Localizar grupo a borrar
    const entry = await this.oneService.findOne(schemaGroup,'posixGroup','cn',cn);

    // Aplicar borrado
    const result = await this.oneService.del(entry.dn);

    // Resultado
    return result;
  }
}
