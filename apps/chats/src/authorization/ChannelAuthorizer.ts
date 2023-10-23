import {Action, IAction, Authorizer} from "./authorizer.base.";
import Channel from "../channels/entities/channel.entity";
import {IUser, MemberRole} from "@mdm/mdm-core";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, Repository} from "typeorm";


@Injectable()
export default class ChannelAuthorizer extends Authorizer<Channel>{

  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository:Repository<Channel>
  ) {
    super();
  }

  async userIsMember(channel:Channel,user:IUser,requireAdmin:boolean=false){
    const query =  this.channelRepository.createQueryBuilder('ch')
      .innerJoin('ch.members','m')
      .innerJoin('m.user','u')
      .where('u.id = :user')
      .setParameter('user',user.id)
      .andWhere('ch.id =:channel')
      .setParameter('channel',channel.id);
    if(requireAdmin){
      query.andWhere(
        new Brackets((qb)=>{
          return qb.orWhere('ch.type = :private',{private:'private'})
            .orWhere('m.role = :admin',{admin:MemberRole.admin})
        })
      );
    }
    return query.getExists();
  }

  async isAuthorized(action: IAction, subject: Channel, user: IUser): Promise<boolean>  {
    switch (action){
      case "delete":
      case Action.Delete:
        return this.userIsMember(subject,user,true);
      case "update":
      case Action.Update:
        return this.userIsMember(subject,user,true);
      case Action.View:
      case "view":
        return this.userIsMember(subject,user,false);
    }
    return false;
  }
}
