export enum userRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  id: number;

  email: string;

  first_name: string;

  last_name: string;


  role: userRole;
}
