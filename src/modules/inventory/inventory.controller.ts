import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get(':computerName')
  findOne(@Param('computerName') computerName: string) {
    return this.inventoryService.findOne(computerName);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }
}
