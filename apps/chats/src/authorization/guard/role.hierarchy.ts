import {Role} from "./role.enum";


const hierarchy = {
  [Role.Admin]:[ Role.User ]
}

export default hierarchy;
