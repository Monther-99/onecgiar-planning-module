import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity'
import { UsersService } from './users.service';
import { Brackets } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCreatedResponse({
  description: '',
  type: [User],
})
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }

  @Get()
  async getUsers(@Query() query) {
    console.log(query)
    const take = query.limit || 10
    const skip=(Number(query.page)-1)*take;
    const result = await this.usersService.userRepository.createQueryBuilder('user');
    result.where(
      new Brackets((qb) => {
        qb.where('email LIKE :email', {
          email: `%${query?.email || ''}%`,
        })
        .orWhere('full_name LIKE :full_name', { full_name: `%${query?.email || ''}%` })
      }),
    )
    .orderBy(this.sort(query))
    if(query.role) 
      result.andWhere('role = :role', { role: query.role })
    else
      result.andWhere('role IS NOT NULL')
    .skip(skip || 0)
    .take(take || 10);

    const finalResult = await result.getManyAndCount();

    return {
      result: finalResult[0],
      count: finalResult[1]
    }
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search/:term')
  async searchUsers(@Param('term') term: string) {
    return this.usersService.searchUsers(term);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}