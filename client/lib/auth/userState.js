import API from "@/app/api/server";
import { decrypt } from "./encrypt";

export async function Login(values, endPoint) {
    try {
        return await API.post(endPoint, values)
        
    } catch (error) {
        throw error; 
    }
}
export async function Logout(endPoint){
    try {
        return await API.post(endPoint)
    } catch (error) {
        throw error; 
    }
}

// export async function serverSideLogout(){
//     cookies().set('token','',{expires: new Date(0)})
// }


export async function GetCookies (){
    const cookies = await cookies.get('token')?.value;
    if(!cookies) return null
    return await decrypt(cookies)
}