import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>
  ){}

  async create(createInventoryDto: CreateInventoryDto) {
    const entry = this.inventoryRepository.create(createInventoryDto);
    
    try{
      await this.inventoryRepository.save(entry);
      return {
        msg: 'Entrada añadida correctamente',
        status: 200
      }
    }catch(err){
      throw new InternalServerErrorException('No se ha podido añadir la entrada')
    }
  }

  findAll() {
    const entries = this.inventoryRepository.find({});
    return entries;
  }

  findOne(computerName: string){
    const entry = this.inventoryRepository.findOne({
      where: {
        computerName,
      },
    });
    return entry;
  }
}
