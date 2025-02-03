import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest)=>{
    const {userId} = await auth();
    if(!userId)  return NextResponse.json({error: 'User not authenticated'}, {status: 401});

    console.log("User ID: ", userId);
    // return NextResponse.json({userId}); 
    
    const params = req.nextUrl.searchParams;

    const status = params.get('status');
    if(!status) return NextResponse.json({error: 'Status not provided'}, {status: 400});


    //get the code to exchange for the auth token
    const code = params.get('code');
    if(!code) return NextResponse.json({error: 'Code not provided'}, {status: 400});

    const token = await exchangeCodeForAccessToken(code);
    console.log("Token: ", token);
    if(!token) return NextResponse.json({error: 'Failed to exchange code for token'}, {status: 500});

    const accountDetails = await getAccountDetails(token.accessToken);
    console.log("Account Details: ", accountDetails);

    await db.account.upsert({
        where: { id: token.accountId.toString() },
        update: { accessToken: token.accessToken },
        create: {
            id: token.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: token.accessToken,
        } 
    });
    return NextResponse.redirect(new URL('/mail', req.url))
   
}