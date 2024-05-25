import { RoleEnum } from "../constants/enum/RoleEnum";


const checkRoleIncludes = (searchingRole:string, roles: RoleEnum[]) => {

    let rolesInString: string[] = [];
    
    roles.map(role => rolesInString.push(role))

    return rolesInString.includes(searchingRole);

}

export default checkRoleIncludes