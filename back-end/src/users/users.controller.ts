import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity'

import { UsersService } from './users.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { query } from 'express';
import { ILike } from 'typeorm';

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
    if(query.search == 'teamMember') {
      return this.usersService.userRepository.createQueryBuilder('users')
      .where("users.full_name like :full_name", { full_name: `%${query.full_name}%` })
      .orWhere("users.email like :email", { email: `%${query.email}%` })
      .select(['users.id as id', 'users.full_name as full_name', 'users.email as email'])
      .getRawMany()
    }
    else {
      const take = query.limit || 10
      const skip=(Number(query.page)-1)*take;
      const [result, total] = await this.usersService.userRepository.findAndCount({
        where: {
          full_name: query?.full_name ? ILike(`%${query?.full_name}%`) : null,
          email: query?.email ? ILike(`%${query?.email}%`) : null,
          id: query?.id ? query?.id : null,
          role: query?.role ? query?.role : null,
        },
        order: { ...this.sort(query) },
        take: take == null ? null : take,
        skip: skip == null ? null : skip,
      });
      return {
        result: result,
        count: total
    }
    }
  }
}