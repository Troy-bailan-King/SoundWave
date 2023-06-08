import { authMiddleware, withClerkMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export default withClerkMiddleware(()=>{
    return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};