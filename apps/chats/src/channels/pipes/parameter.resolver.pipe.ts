import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";


@Injectable()

export class ParameterResolverPipe implements  PipeTransform{
  constructor(
    @InjectEntityManager()
    private readonly entityManager:EntityManager
  ) {
  }

  transform(value: any, metadata: ArgumentMetadata): any {
    console.log(value);
    if(metadata.type==='param'){
      //// resolve entity
      console.log(metadata.metatype);
      return this.entityManager.getRepository(metadata.metatype)
          .findOneByOrFail({id:value});
    }
    return value;
  }
}
