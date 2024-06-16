import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { groupGet } from 'src/interfaces/group.interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  find(@Query() groupFilter: groupGet) {
    return this.groupsService.getGroups(groupFilter);
  }

  @Patch(':cn')
  update(@Param('cn') cn: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(cn, updateGroupDto);
  }

  @Delete(':cn')
  remove(@Param('cn') cn: string) {
    return this.groupsService.remove(cn);
  }
}
