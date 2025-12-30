export function maskEmail(email){

    const [name, domain] = email.split("@");
    if (name.length<=2) return `**@${domain}`;

    return `${name[0]}${"*".repeat(name.length-2)}${name.slice(-1)}@${domain}`


}

export function maskPhone(phone)
{
    return phone.replace(/\d(?=\d{4})/g,"*");
    
}