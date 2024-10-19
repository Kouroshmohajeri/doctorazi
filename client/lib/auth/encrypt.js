import { SignJWT, jwtVerify } from "jose";

const secret = process.env.NEXT_PUBLIC_MY_SECRET;
const key = new TextEncoder().encode(secret);
export async function encrypt(payload){
    return await new SignJWT(payload)
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt()
    .setExpirationTime('1hour')
    .sign(key)
}

export async function decrypt(input){
    const {payload} = await jwtVerify(input,key,{algorithms:['HS256']});
    return payload
}