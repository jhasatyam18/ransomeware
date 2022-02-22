/**
 * Check user has privilege on requested object
 * @param {*} user
 * @param {*} reqPrivileges
 */
export function hasRequestedPrivileges(user, reqPrivileges = []) {
  if (typeof user === 'undefined') {
    return false;
  }
  const { privileges = [] } = user;
  return reqPrivileges.every((privilege) => privileges.includes(privilege));
}
