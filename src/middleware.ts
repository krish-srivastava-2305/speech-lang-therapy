import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_ROUTES = [
  '/',
  '/supervisor/login',
  '/therapist/login',
  '/patient/login',
  '/patient/register',
  '/therapist/register',
  '/supervisor/register',
];

const SUPERVISOR_ROUTES = [
  '/supervisor',
  '/supervisor/patient/:id',
  '/supervisor/therapists',
  '/supervisor/view/:id/progress-report',
  '/supervisor/view/:id/sessions',
];

const THERAPIST_ROUTES = [
  '/therapist',
  '/therapist/:id/progress-report',
  '/therapist/:id/sessions',
];

const PATIENT_ROUTES = [
  '/dashboard/patient',
];

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const decodedToken = jwt.decode(token) as { userRole: string };

    const userRole = decodedToken.userRole;

    if (SUPERVISOR_ROUTES.includes(pathname) && userRole !== 'supervisor') {
      return NextResponse.redirect(new URL('/supervisor/therapist', req.url)); 
    }

    if (THERAPIST_ROUTES.includes(pathname) && userRole !== 'therapist') {
      return NextResponse.redirect(new URL('/therapist/patient', req.url));
    }

    if (PATIENT_ROUTES.includes(pathname) && userRole !== 'patient') {
      return NextResponse.redirect(new URL('/dashboard/patient', req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
};

export const config = {
  matcher: [
    '/supervisor/:path*',
    '/therapist/:path*',
    '/dashboard/patient/:path*',
  ],
};
