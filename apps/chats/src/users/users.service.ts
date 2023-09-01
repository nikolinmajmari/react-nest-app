import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "./dto/user.dto";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private readonly repository:Repository<User>
    ){}


    async get():Promise<User[]>{
        return this.repository.createQueryBuilder('u')
        .select('u')
        .execute();
    }

    async create(data:CreateUserDTO):Promise<User>{
        return await this.repository.save(
            this.repository.create(data)
        );
    }

    async findUserByIdentifier(email:string):Promise<User|undefined>{
        return await this.repository.findOne({
            where:{ email},
            cache:{
                id: `user.${email}`,
                milliseconds: 5000
            }
        })
    }
}