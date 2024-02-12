import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const logged = request.cookies.has("token");
	const PUBLIC_PATH = ["/auth/signin", "/resep"];

	const isPublic = PUBLIC_PATH.includes(path);

	if (isPublic && logged) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (!isPublic && !logged) {
		return NextResponse.redirect(new URL("/auth/signin", request.url));
	}
}

export const config = {
	matcher: ["/auth/signin", "/admin/:path*"],
};
