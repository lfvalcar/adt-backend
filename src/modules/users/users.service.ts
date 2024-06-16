import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userGet } from 'src/interfaces/user.interface';
import { OneService } from '../one/one.service';
import { schemaUser } from 'src/config/ldap-client';
import { schemaGroup } from 'src/config/ldap-client';
import { ldapConfig } from 'src/config/ldap-client';

@Injectable()
export class UsersService {
  constructor(private readonly oneService: OneService) {}

  // GET
  async getUsers(userFilter: userGet){
    if(Object.keys(userFilter).length===0){
      return this.oneService.findAll(schemaUser,'posixAccount');
    }else{
      let ldapFilter = '(&(objectClass=posixAccount)';
      for(let key in userFilter){
      ldapFilter = ldapFilter + `(${key}=${userFilter[key]})`;
      }
      ldapFilter = ldapFilter + ')';
    
      return this.oneService.findFilter(schemaUser,ldapFilter);
    }
  }

  // POST
  async create(createUserDto: CreateUserDto) {
    if(!createUserDto.group){
      createUserDto.group = 'usuarios';
    }

    const dnGroup:any = this.oneService.findOne(schemaGroup,'posixGroup','cn',createUserDto.group)
    const newMember = {"memberUid":createUserDto.uid}
    this.oneService.ldapmodify('add',newMember,dnGroup.dn)

    createUserDto.userPassword = await this.oneService.getHash(createUserDto.userPassword);
    
    const uidNumber = await this.oneService.autoIncrementUidNumber();
    const gidNumber = await this.oneService.convertGidGroup(createUserDto.group);

    const entry = {
      // Valores por defecto
      objectClass: ['top','inetOrgPerson','posixAccount'],
      uidNumber: uidNumber,
      gidNumber: gidNumber,
      o: 'IES CURA VALERA',
      homeDirectory: '/home/%u',
      loginShell: '/bin/bash',
      // Body request
      ...createUserDto
    };
    delete entry.group;
    const result = await this.oneService.add(`uid=${entry.uid},ou=${entry.ou},${ldapConfig.ldapDomain}`, entry);
    return result;  
  }

  // UPDATE
  async update(uid: string, UpdateUserDto: UpdateUserDto) {
    const currentUser = await this.oneService.findOne(schemaUser,'posixAccount','uid',uid);
    
    if(UpdateUserDto.group){
      UpdateUserDto['gidNumber'] = await this.oneService.convertGidGroup(UpdateUserDto.group);
      delete UpdateUserDto.group
    }

    if(UpdateUserDto.fields){
      const arrayFields = UpdateUserDto.fields
      delete UpdateUserDto.fields
      for(let field of arrayFields){
        UpdateUserDto[field] = []
      }
    }

    if(UpdateUserDto.userPassword){
      UpdateUserDto.userPassword = await this.oneService.getHash(UpdateUserDto.userPassword);
    }

    const result =  await this.oneService.ldapmodify(UpdateUserDto.action,UpdateUserDto,currentUser.dn);
    return result;
  }

  // DELETE
  async remove(uid: string) {

    const dnGroup:any = this.oneService.findFilter(schemaGroup,`(&(objectClass=posixGroup)(memberUid=${uid}))`)
    for(let group of dnGroup){
      this.oneService.ldapmodify('delete',{memberUid:uid},group.dn)
    }

    const entry = await this.oneService.findOne(schemaUser,'posixAccount','uid',uid);
    // Aplicar borrado
    const result = await this.oneService.del(entry.dn)
    
    return result;
  }
}
