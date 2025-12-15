export function resolveUserTypeAndAuthName(authTypeInput) {

  if (!authTypeInput) throw new Error("authType is required");

  const type = authTypeInput.toLowerCase();

  if (type === "ad") return { userType: "INTERNAL", authTypeName: "ad" };

  if (type === "email") return { userType: "EXTERNAL", authTypeName: "email" };

  if (type === "phone") return { userType: "EXTERNAL", authTypeName: "phone" };

  throw new Error("Invalid authType. Allowed: AD / EMAIL / PHONE");

}
 