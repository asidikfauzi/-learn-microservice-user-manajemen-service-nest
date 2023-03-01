import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDTO } from './dtos';
import { PrismaService } from './services';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    @Inject('LOG_SERVICE')
    private readonly logClient: ClientProxy
  ) {}

  public async createUser(req, body:CreateUserDTO, ip) {
    const {username, email, role_id, password, is_active} = body;

    const role = await this.getRoleById(role_id) 
    if(!role) {
      throw new BadRequestException('Invalid role id')
    }

    //check username exist
    if(await this.prisma.user.findUnique({where:{username}})) {
      throw new BadRequestException('Username already exist')
    }

    if(await this.prisma.user.findUnique({where:{email}})) {
      throw new BadRequestException('Email already exist')
    }

    const newUser = {} as User;
    newUser.username = username;
    newUser.email = email;
    newUser.role_id = role_id;
    newUser.is_active = is_active;
    newUser.password = await bcrypt.hash(password, 10);
    newUser.created_by_id = req.user.user_id;

    const user = await this.prisma.user.create({data: newUser});

    user['role_name'] = role.role_name;
    delete user.role_id;
    delete user.password;
    delete user.deleted_at;

    const logPayload = {
      timestamp: new Date(),
      action: 'CREATE_USER',
      user_id: req.user.user_id,
      ip_address: ip,
      user_agent: req.headers['user-agent'],
      details: `Create user with user_id=${user.id}`,
    };

    this.logClient.emit('add_log', JSON.stringify(logPayload));

    return {
      statusCode: HttpStatus.CREATED,
      message: 'New user was successfully added',
      data: user,
    };
  }

  private async getRoleById(id: number) {
    return await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }
}
