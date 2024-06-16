import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OusService } from '../ous/ous.service';
import { CreateOusDto } from '../ous/dto/create-ous.dto';
import seedOus from './data/ous.json';
import seedUsers from './data/users.json';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { CreateGroupDto } from '../groups/dto/create-group.dto';
import seedGroup from './data/groups.json';
import { OneService } from '../one/one.service';
import { schemaGroup } from 'src/config/ldap-client';

@Injectable()
export class SeedService {
  constructor(private readonly ousService: OusService,
              private readonly userService: UsersService,
              private readonly groupService: GroupsService,
              private readonly oneService: OneService
  ){}

  async ouLoadData(){
    const insertPromisesOus = [];
      seedOus.forEach((ou: CreateOusDto) => {
        insertPromisesOus.push(this.ousService.create(ou));
      });

    try {
      await Promise.all(insertPromisesOus);
      return {
        msg: 'Carga masiva de unidades organizativas ejecutado con éxito',
        status: 200,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error en la carga masiva de unidades organizativas');
    }
  }

  async userLoadData(){
    const insertPromisesUsers = [];
      seedUsers.forEach((user: CreateUserDto) => {
        insertPromisesUsers.push(this.userService.create(user));
      });

    try {
      await Promise.all(insertPromisesUsers);
      return {
        msg: 'Carga masiva de usuarios ejecutado con éxito',
        status: 200,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error en la carga masiva de usuarios');
    }
  }

  async userDeleteData(selectedUids){
    const deletePromisesUsers = [];
    selectedUids['selectedKeys'].forEach(value => {
      deletePromisesUsers.push(this.userService.remove(value));
    })

    try {
      await Promise.all(deletePromisesUsers);
      return {
        msg: 'Borrado masivo de usuarios ejecutado con éxito',
        status: 200,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error en el borrado masivo de usuarios');
    }
  }

  async groupLoadData(){
    const insertPromisesGroups = [];
      seedGroup.forEach((group: CreateGroupDto) => {
        insertPromisesGroups.push(this.groupService.create(group));
      });

    try {
      await Promise.all(insertPromisesGroups);
      return {
        msg: 'Carga masiva de grupos ejecutado con éxito',
        status: 200,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error en la carga masiva de grupos');
    }
  }

  async groupDeleteData(selectedCns){
    const deletePromisesGroups = [];
    for (const value of selectedCns['selectedKeys']) {
      try {
        const group = await this.oneService.findOne(schemaGroup, 'posixGroup', 'cn', value);
  
        if (group && group.memberUid) {
          throw new InternalServerErrorException();
        }
  
        deletePromisesGroups.push(this.groupService.remove(value));
      } catch (err) {
          throw new InternalServerErrorException('No se puede borrar el grupo debido a que hay usuarios que dependen de él, borre los usuarios o vacíe el grupo');
      }
    }

    try {
      await Promise.all(deletePromisesGroups);
      return {
        msg: 'Borrado masivo de usuarios ejecutado con éxito',
        status: 200,
      };
    } catch (err) {
      throw new InternalServerErrorException('Error en el borrado masivo de usuarios');
    }
  }

}
