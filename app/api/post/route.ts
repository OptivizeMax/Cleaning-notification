import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionOptions, SessionData } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import { saveFile } from '../../../lib/storage';
import { sendEmail } from '../../../lib/email';

export async function POST(req: Request) {
  const formData = await req.formData();
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const image = formData.get('image') as File | null;
  const session = await getIronSession<SessionData>(req, NextResponse.next(), sessionOptions);
  if (!session.loggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let imageUrl: string | undefined;
  if (image && image.name) {
    imageUrl = await saveFile(image);
  }
  await prisma.post.create({
    data: { title, body, imageUrls: imageUrl ? [imageUrl] : [] },
  });
  await sendEmail(title, body, imageUrl);
  return NextResponse.json({ ok: true });
}
