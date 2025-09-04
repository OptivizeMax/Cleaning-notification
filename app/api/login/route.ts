import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionOptions, SessionData } from '../../../lib/auth';

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = formData.get('password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect('/admin');
  }
  const res = NextResponse.redirect('/admin');
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.loggedIn = true;
  await session.save();
  return res;
}
