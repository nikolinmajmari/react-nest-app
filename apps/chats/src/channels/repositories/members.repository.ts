import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import ChannelMember from "../entities/channel-member.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export default class ChannelsMemberRepository extends Repository<ChannelMember>{

  constructor(
    @InjectRepository(ChannelMember)
    repository:Repository<ChannelMember>
  ) {
    super(repository.target,repository.manager,repository.queryRunner);
  }

  async findUserChannelMember(channelId: string, userId: string) {
    return await this.findOneBy({
      channel: {id: channelId},
      user: {id: userId}
    })
  }
}
