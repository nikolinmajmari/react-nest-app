import { Injectable } from "@nestjs/common";
import { Brackets, Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "./dto/user.dto";
import { FindUserDTO } from "./dto/findUser.dto";
import ChannelMember from "../channels/entities/channel-member.entity";
import Channel from "../channels/entities/channel.entity";
import { AuthenticatedDTO } from "../core/authenticated";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private readonly repository:Repository<User>,
        @InjectRepository(User)
        private readonly channelRepository:Repository<Channel>
    ){}


    async get(filter:FindUserDTO&AuthenticatedDTO):Promise<User[]>{
        const query =  this.repository.createQueryBuilder('u')
        .select('u');
        if(filter.privateChannelCandidate && filter.user && filter.user.id){
            query.leftJoin(ChannelMember,'member','member.userId = u.id');
            query.andWhere(
                'member.channelId is null or member.channelId not in '+ query.subQuery()
                .select('ch.id')
                .from(Channel,'ch')
                .innerJoin('ch.members','chm')
                .where('ch.type = :private')
                .andWhere('chm.userId = :userId')
                .getQuery()
            );
            query.setParameter('userId',filter.user.id);
            query.setParameter('private','private');
        }
        if(filter.search){
            query.andWhere(
                new Brackets((qb)=>{
                    qb.where('Lower(u.firstName) like :search')
                    .orWhere('Lower(u.lastName) like :search')
                    .orWhere('Lower(u.email) like :search')
                })
            ).setParameter('search',`%${filter.search.toLowerCase()}%`);
        }
        return query.getMany();
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

    async findUserProfileInfoByIdentifier(email:string):Promise<User|undefined>{
        return await this.repository.findOne({
            select:{
                email:true,avatar:true,firstName:true,id:true,lastName:true
            },
            where:{ email},
            cache:{
                id: `user.${email}`,
                milliseconds: 5000
            }
        }) 
    }
}