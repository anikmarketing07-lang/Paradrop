import { clerkMiddleware } from "@clerk/nextjs/server";

// Middleware only attaches Clerk auth context — no server-side redirects.
// Pages handle auth client-side via <SignedIn>/<SignedOut>.
// API routes call auth() and return 401 themselves.
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
