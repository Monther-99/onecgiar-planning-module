import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}

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
}
