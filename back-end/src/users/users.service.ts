import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Brackets, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as XLSX from 'xlsx-js-style';
import { join } from 'path';
import { createReadStream, unlink } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
  async getUsers(query: any) {
    const take = query.limit || 10
    const skip=(Number(query.page)-1)*take;
    const result = this.userRepository.createQueryBuilder('user');
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

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    });
    if(!userExist) {
      const newUser = this.userRepository.create({ ...createUserDto });
      return this.userRepository.save(newUser);
    } else {
      throw new BadRequestException('User already exist');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: {
        id: Not(id),
        email: updateUserDto.email
      }
    });
    if(!userExist) {
      return this.userRepository.update({ id }, { ...updateUserDto });
    } else {
      throw new BadRequestException('User already exist');
    }
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }

  searchUsers(term: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.full_name like :name', { name: `%${term}%` })
      .orWhere('user.email like :email', { email: `%${term}%` })
      .orderBy('user.full_name')
      .getMany();
  }

  async exportExcel(query: any) {
    const result = this.userRepository.createQueryBuilder('user');
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

    const finalResult = await result.getMany();

    const finaldata = this.prepareUserTemplate(finalResult);

    const file_name = 'Users.xlsx';
    var wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(finaldata);

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    await XLSX.writeFile(
      wb,
      join(process.cwd(), 'generated_files', file_name),
      { cellStyles: true },
    );
    const file = createReadStream(
      join(process.cwd(), 'generated_files', file_name),
    );

    setTimeout(async () => {
      try {
        unlink(join(process.cwd(), 'generated_files', file_name), null);
      } catch (e) {}
    }, 9000);
    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file_name}"`,
    });

  }

  getTemplateUser() {
    return {
      ID: null,
      Name: null,
      Email: null,
      Role: null,
    };
  }

  userTemplate(template, element) {
    template.ID = element?.id
    template.Name = element?.full_name;
    template.Email = element?.email;
    template.Role = element?.role;
  }

  prepareUserTemplate(users) {
    let finaldata = [];

    users.forEach((element: any) => {
      const template = this.getTemplateUser();
      this.userTemplate(template, element);
      finaldata.push(template)
    });
    return  finaldata;
  }

}
