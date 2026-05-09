// // import { getDataFromToken } from './src/utils/getDataFromToken';
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'


 

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   const isPublicPath = path === '/login' || path === '/signup' || path === '/verify-email' || path === '/verify-login' || path === '/hospital/login' || path === '/hospital/register' || path === '/'

//   const token = request.cookies.get('token')?.value || ''
//   console.log("Middleware TOKEN:", request.cookies.get("token"));


//   if(isPublicPath && token) {
//     return NextResponse.redirect(new URL('/patient', request.nextUrl))
//   }

//   if (!isPublicPath && !token) {
//     if (path === '/hospital') {return NextResponse.redirect(new URL('/hospital/login', request.nextUrl))}
//     else return NextResponse.redirect(new URL('/login', request.nextUrl))
//   }
    
// }

 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     // '/',
//     '/patient/:path*',
//     '/hospital/:path*',
//     '/login',
//     '/signup',
//     '/hospital/login',
//     '/hospital/register',
//     '/verify-email',
//     '/verify-login'
//   ]
// }


// middleware.ts

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/"];

// Role based route access
const ROLE_ROUTES = {
  patient: ["/patient"],
  hospital: ["/hospital"],
  doctor: ["/doctor"],
  nurse: ["/nurse"],
  admin: ["/admin"],
};

// Login pages
const LOGIN_ROUTES = {
  patient: "/login",
  hospital: "/hospital/login",
  doctor: "/doctor/login",
  nurse: "/nurse/login",
  admin: "/admin/login",
};

// Token names
const TOKENS = {
  patient: "patientToken",
  hospital: "hospitalToken",
  doctor: "doctorToken",
  nurse: "nurseToken",
  admin: "adminToken",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // =========================
  // Allow public routes
  // =========================
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // =========================
  // Get all tokens
  // =========================
  const patientToken = request.cookies.get(TOKENS.patient)?.value;
  const hospitalToken = request.cookies.get(TOKENS.hospital)?.value;
  const doctorToken = request.cookies.get(TOKENS.doctor)?.value;
  const nurseToken = request.cookies.get(TOKENS.nurse)?.value;
  const adminToken = request.cookies.get(TOKENS.admin)?.value;

  console.log("Middleware tokens:", {
    patientToken,
   
  });

  // =========================
  // PATIENT ROUTES
  // =========================
  if (pathname.startsWith("/patient")) {
    if (!patientToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // =========================
  // HOSPITAL ROUTES
  // =========================
  if (pathname.startsWith("/hospital")) {
    // allow hospital login page without token
    if (pathname === "/hospital/login" || pathname ==="/hospital/register") {
      return NextResponse.next();
    }

    if (!hospitalToken) {
      return NextResponse.redirect(
        new URL("/hospital/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // =========================
  // DOCTOR ROUTES
  // =========================
  if (pathname.startsWith("/doctor")) {
    if (pathname === "/doctor/login" || pathname === "/doctor/register") {
      return NextResponse.next();
    }

    if (!doctorToken) {
      return NextResponse.redirect(
        new URL("/doctor/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // =========================
  // NURSE ROUTES
  // =========================
  if (pathname.startsWith("/nurse")) {
    if (pathname === "/nurse/login" || pathname === "/nurse/register") {
      return NextResponse.next();
    }

    if (!nurseToken) {
      return NextResponse.redirect(
        new URL("/nurse/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // =========================
  // ADMIN ROUTES
  // =========================
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!adminToken) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // =========================
  // Prevent cross-role access
  // =========================

  // Patient cannot access hospital/doctor/admin pages
  if (
    patientToken &&
    (
      pathname.startsWith("/hospital") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/nurse") ||
      pathname.startsWith("/admin")
    )
  ) {
    return NextResponse.redirect(new URL("/patient", request.url));
  }

  // Hospital cannot access patient/doctor/admin pages
  if (
    hospitalToken &&
    (
      pathname.startsWith("/patient") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/nurse") ||
      pathname.startsWith("/admin")
    )
  ) {
    return NextResponse.redirect(new URL("/hospital", request.url));
  }

  // Doctor cannot access others
  if (
    doctorToken &&
    (
      pathname.startsWith("/patient") ||
      pathname.startsWith("/hospital") ||
      pathname.startsWith("/nurse") ||
      pathname.startsWith("/admin")
    )
  ) {
    return NextResponse.redirect(new URL("/doctor", request.url));
  }

  // Nurse cannot access others
  if (
    nurseToken &&
    (
      pathname.startsWith("/patient") ||
      pathname.startsWith("/hospital") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/admin")
    )
  ) {
    return NextResponse.redirect(new URL("/nurse", request.url));
  }

  // Admin cannot access others
  if (
    adminToken &&
    (
      pathname.startsWith("/patient") ||
      pathname.startsWith("/hospital") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/nurse")
    )
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/hospital/:path*",
    "/doctor/:path*",
    "/nurse/:path*",
    "/admin/:path*",
  ],
};