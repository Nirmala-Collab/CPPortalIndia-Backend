// import ldap from "ldapjs";
// const {
//  LDAP_URL,
//  LDAP_DOMAIN,
//  LDAP_BASE_DN,
// } = process.env;
// if (!LDAP_URL || !LDAP_DOMAIN) {
//  throw new Error("LDAP environment variables are not configured");
// }
// export function authenticateWithAD(email, password) {
//  return new Promise((resolve, reject) => {
//    const client = ldap.createClient({
//      url: LDAP_URL,
//      timeout: 5000,
//      connectTimeout: 10000,
//    });
//    /**
//     * Common AD formats:
//     * 1) user@domain  (UPN)   ← we use this
//     * 2) sAMAccountName
//     * 3) CN=User,OU=...
//     */
//    const username = email.split("@")[0];
//    const userDN = `${username}@${LDAP_DOMAIN}`;
//    client.bind(userDN, password, (err) => {
//      client.unbind();
//      if (err) {
//        return reject(new Error("Invalid AD credentials"));
//      }
//      return resolve(true);
//    });
//  });
// }