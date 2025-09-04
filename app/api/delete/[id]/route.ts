import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getIronSession<SessionData>(req, NextResponse.next(), sessionOptions);
  if (!session.loggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
