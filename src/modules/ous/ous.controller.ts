import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OusService } from './ous.service';
import { CreateOusDto } from './dto/create-ous.dto';
import { UpdateOusDto } from './dto/update-ous.dto';
import { ouGet } from 'src/interfaces/ou.interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('ous')
export class OusController {
  constructor(private readonly ousService: OusService) {}

  @Post()
  create(@Body() createOusDto: CreateOusDto) {
    return this.ousService.create(createOusDto);
  }

  @Get()
  find(@Query() ouFilter: ouGet) {
    return this.ousService.getOus(ouFilter);
  }

  @Patch(':ou')
  update(@Param('ou') ou: string, @Body() UpdateOusDto: UpdateOusDto) {
    return this.ousService.update(ou, UpdateOusDto);
  }

  @Delete(':ou')
  remove(@Param('ou') ou: string) {
    return this.ousService.remove(ou);
  }
}
