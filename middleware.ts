import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)", "/analytics(.*)"]);
const isApiRoute = createRouteMatcher(["/api/leads", "/api/generate-email"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId && (req.nextUrl.pathname.startsWith("/sign-in") || req.nextUrl.pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!userId && isApiRoute(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
