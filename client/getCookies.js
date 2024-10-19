'use server'

import { cookies } from "next/headers"

// import { cookies } from "next/headers"

// export const GetHttpOnlyCookies = async ()=>{
//     return await cookies().get();
// }
// pages/api/getUserData.js
export default async function getHttpOnlyCookies() {
    // // Access cookies from the request
    // const userCookie = req.cookies['token'];
  
    // // You might decode or validate the cookie value here
    // if (userCookie) {
    //   res.status(200).json({ data: userCookie });
    // } else {
    //   res.status(404).json({ error: "No cookie found" });
    // }
    return await cookies().get('token')?.value
}
  