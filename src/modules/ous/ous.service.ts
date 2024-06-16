import { Injectable } from '@nestjs/common';
import { CreateOusDto } from './dto/create-ous.dto';
import { UpdateOusDto } from './dto/update-ous.dto';
import { ouGet } from 'src/interfaces/ou.interface';
import { OneService } from '../one/one.service';
import { schemaOu } from 'src/config/ldap-client';

@Injectable()
export class OusService {
  constructor(private readonly oneService: OneService) {}

  // GET
  async getOus(ouFilter: ouGet){
    if(Object.keys(ouFilter).length===0){
      return this.oneService.findAll(schemaOu,'organizationalUnit');
    }else{
      let ldapFilter = '(&(objectClass=organizationalUnit)';
      for(let key in ouFilter){
        ldapFilter = ldapFilter + `(${key}=${ouFilter[key]})`;
      }
      ldapFilter = ldapFilter + ')';
      
      return this.oneService.findFilter(schemaOu,ldapFilter);
    }
  }

  // POST
  async create(createOusDto: CreateOusDto) {
    // Preparar entrada
    const entry = {
      // Valores por defecto
      objectClass: ['organizationalUnit','top'],
      // Body request
      ...createOusDto
    };
    // Aplicar entrada
    const result = await this.oneService.add(`ou=${entry.ou},${process.env.DOMAIN}`, entry);

    // Resultado
    return result;
  }

  // UPDATE
  async update(ou: string, UpdateOusDto: UpdateOusDto) {
    // Localizar unidad organizativa
    const currentOu = await this.oneService.findOne(schemaOu,'organizationalUnit','ou',ou);

    // Modificación
    const result = await this.oneService.ldapmodify(UpdateOusDto.action,UpdateOusDto,currentOu.dn);

    return result;
  }

  // DELETE
  async remove(ou: string) {
    // Localizar unidad organizativa a borrar
    const entry = await this.oneService.findOne(schemaOu,'organizationalUnit','ou',ou);

    // Aplicar borrado
    const result = await this.oneService.del(entry.dn);

    return result;
  }
}
