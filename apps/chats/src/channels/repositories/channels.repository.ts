import {Injectable} from "@nestjs/common";
import {Brackets, Repository, SelectQueryBuilder} from "typeorm";
import Channel from "../entities/channel.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ChannelType, IUser, MemberRole} from "@mdm/mdm-core";
import User from "../../users/entities/user.entity";


@Injectable()
export default class ChannelsRepository extends Repository<Channel>{
  constructor(
    @InjectRepository(Channel) repository:Repository<Channel>
  ) {
    super(repository.target,repository.manager,repository.queryRunner);
  }

  /// builders
  /**
   * select ch from relations ch=>m=>u  where channel=ch and user=u
   * @param channel
   * @param user
   */
  createChannelUserQueryBuilder(channel:Channel,user:User){
    return  this.createQueryBuilder('ch')
      .innerJoin('ch.members','m')
      .innerJoin('m.user','u')
      .where('u.id = :user')
      .setParameter('user',user.id)
      .andWhere('ch.id =:channel')
      .setParameter('channel',channel.id);
  }

  /**
   * select ch from Channel:ch left join Members:m left join LastMessage:lm left join User:u
   */
  createChannelsQueryBuilder(){
    return this.createQueryBuilder('ch')
      .leftJoin('ch.members', 'm')
      .leftJoin('ch.lastMessage', 'lm')
      .leftJoin('m.user', 'u');
  }

  /**
   * Dynamically selects other member full name as alias of private channel
   * :userId param is required to be added in channelsApi as all checks will be done agains this id
   * @param builder Query builder
   * @param ch channel entity alias
   */
  addSelectDynamicChannelAlias(builder:SelectQueryBuilder<Channel>,ch:string='ch'){
    const sqb = this.manager.createQueryBuilder();
    sqb.select(`CONCAT("_u"."firstName",' ',"_u"."lastName")`)
      .from("user", '_u')
      .innerJoin('_u.members', '_chm')
      .innerJoin('_chm.channel', '_ch')
      .where(`_chm.channelId = ${ch}.id`)
      .andWhere('_u.id <> :userId')
      .limit(1);
    builder.addSelect(`
         case when "${ch}"."type" = 'group'
         then "${ch}"."alias"
         else (${sqb.getQuery()}) end`,
      `${ch}_alias`)
    return sqb;
  }

  andWhereUserChannels(builder: SelectQueryBuilder<Channel>,userId:string){
    builder
      .andWhere(
        'ch.id in' + builder.subQuery()
          .select('_ch.id')
          .from(Channel,'_ch')
          .leftJoin('_ch.members','_m')
          .leftJoin('_m.user','_u')
          .andWhere('_u.id = :userId')
          .getQuery())
      .setParameter('userId',userId);
    return builder;
  }

  //// queries
  async userIsMember(channel:Channel,user:IUser,requireAdmin:boolean=false){
    const query =  this.createChannelUserQueryBuilder(channel,user as User);
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

  async privateChannelWithUsersExists(firstMember:string,secondMember:string){
    const query = this.createQueryBuilder('ch')
      .select(['ch', 'COUNT(u.id) as users'])
      .leftJoin('ch.members', 'm')
      .leftJoin('m.user', 'u')
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('u.id = :user1Id')
            .orWhere('u.id = :user2Id')
        })
      )
      .andWhere('ch.type = :private')
      .setParameter('private', ChannelType.private)
      .setParameter('user1Id', firstMember)
      .setParameter('user2Id', secondMember)
      .groupBy('ch.id')
      .having('COUNT(u.id) = 2');
    return (await query.execute()).length > 0;
  }

  async findUserChannels(user: Partial<User>) {
    const query = this.createChannelsQueryBuilder();
    query.select(["ch", "lm"]);
    this.addSelectDynamicChannelAlias(query);
    this.andWhereUserChannels(query,user.id);
    query.orderBy('lm.createdAt','DESC')
      .cache(false);
    return await query.getMany();
  }

  async findUserChannel(
    id: string,user:Partial<IUser>,
  ) {
    const query = this.createChannelsQueryBuilder();
    query.select([
      'ch', 'ch.alias',
      'lm',
      'm',
      'u.id','u.firstName','u.lastName','u.email','u.avatar'
    ]);
    this.addSelectDynamicChannelAlias(query);
    query
      .where('ch.id = :id')
      .setParameter('id',id)
      .setParameter('userId',user.id);
    return query.getOneOrFail();
  }

}
