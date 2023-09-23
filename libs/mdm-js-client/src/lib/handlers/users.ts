import { BaseClient } from "../base-client";
import { IUser } from "@mdm/mdm-core";
import { IPaginitionDTO } from "../paginition.dto";

export class UsersHandler{
    constructor(
        private readonly baseClient:BaseClient
    ){}

    async get(dto:IPaginitionDTO & ISeatchUser):Promise<IUser[]>{
        return await this.baseClient.get('/users',{
            ...dto
        });
    }
}


interface ISeatchUser{
    search?:string;
    privateChannelCandidate?:"true"|"false";
}

