import {VIRTUAL_COLUMN_KEY} from "../decorators/virtual";
import {SelectQueryBuilder} from "typeorm";

declare module "typeorm" {
  interface SelectQueryBuilder<Entity>{
    getMany(this:SelectQueryBuilder<Entity>):Promise<Entity[]>|undefined;
    getOne(this:SelectQueryBuilder<Entity>):Promise<Entity>|undefined;
  }
}


SelectQueryBuilder.prototype.getMany = async function (){
  const {entities,raw} = await this.getRawAndEntities();
  const items = entities.map((entity: any, index: string | number)=>{
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY,entity)??{};
    const item = raw[index];
    for(const [propertyKey,name] of Object.entries<string>(metaInfo)){
      entity[propertyKey] = item[`${this.alias}_${name}`];
    }
    return entity;
  })
  return [...items];
}

SelectQueryBuilder.prototype.getOne = async function (){
  const {entities,raw} = await this.getRawAndEntities();
  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY,entities[0])||{};
  for(const [propertyKey,name] of Object.entries<string>(metaInfo)){
    entities[0][propertyKey] = raw[0][`${this.alias}_${name}`]
  }
  return entities[0];
}
