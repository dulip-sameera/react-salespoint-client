import { RoleEnum } from "../constants/enum/roles";

export default function checkRoleIncludes(
  searchingRole: string,
  roles: RoleEnum[]
) {
  let rolesInString: string[] = [];

  roles.map((role) => rolesInString.push(role));

  return rolesInString.includes(searchingRole);
}
