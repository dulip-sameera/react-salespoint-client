import { RoleEnum } from "../constants/enum/RoleEnum";

export default function checkRoleIncludes(
  searchingRole: string,
  roles: RoleEnum[]
) {
  let rolesInString: string[] = [];

  roles.map((role) => rolesInString.push(role));

  return rolesInString.includes(searchingRole);
}
