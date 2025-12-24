import ldap from "ldapjs";
const {
 LDAP_URL,
 LDAP_BASE_DN,
} = process.env;

if (!LDAP_URL || !LDAP_BASE_DN) {
 throw new Error("LDAP environment variables missing");
}

export function authenticateWithAD(email, password) {
 return new Promise((resolve, reject) => {
   if (!email || !password) {
     return reject(new Error("Email and password required"));
   }

   const client = ldap.createClient({
     url: LDAP_URL,
     timeout: 5000,
     connectTimeout: 10000,
     tlsOptions: {
       rejectUnauthorized: false, // internal AD certs
     },
   });

   // IMPORTANT: use UPN directly
   const userDN = email.trim();

   client.bind(userDN, password, (err) => {
     if (err) {
       console.error("AD bind failed:", err.message);
       client.unbind();
       return reject(new Error("Invalid AD credentials"));
     }

     // Optional: verify user exists
     const opts = {
       scope: "sub",
       filter: `(userPrincipalName=${userDN})`,
       attributes: ["dn"],
     };

     client.search(LDAP_BASE_DN, opts, (err, res) => {
       if (err) {
         client.unbind();
         return reject(new Error("AD search failed"));
       }

       let found = false;

       res.on("searchEntry", () => {
         found = true;
       });

       res.on("end", () => {
         client.unbind();
         if (!found) {
           return reject(new Error("User not found in AD"));
         }
         resolve(true);
       });
     });
   });
 });
}