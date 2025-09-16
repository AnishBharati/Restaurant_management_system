import { NextRequest, NextResponse } from "next/server";
import { validateAuth } from "./lib/validateAuth";
export const middleware = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  // console.log("Refresh token in middleware", refreshToken);
  // const accessToken = req.cookies.get("refreshToken")?.value;
  console.log("Hello from middleware");
  if (!refreshToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // if (!accessToken) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }
  const authData = await validateAuth();
  if (!authData || authData.success) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
};

// import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { validateAuth } from "./digi_waiter_frontend/lib/validateAuth";

// export const middleware = async (req: NextRequest) => {
//   const cookiesStore = await cookies();
//   if (!cookiesStore.get("refreshToken")) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.rewrite(url);
//   }

// const authData = await validateAuth();
// if (!authData || authData.success) {
//   const url = req.nextUrl.clone();
//   url.pathname = "/login";
//   return NextResponse.rewrite(url);
// }

// return NextResponse.next();
// };

// export const config:MiddlewareConfig = {
//     matcher: "/login"
// }

export const config = {
  matcher: [
    // Protect everything under /dashboard, /profile, etc.
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
