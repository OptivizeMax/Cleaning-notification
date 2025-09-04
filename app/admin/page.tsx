import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import NewPostForm from '../../components/NewPostForm';
import { sessionOptions, SessionData } from '../../lib/auth';

export default async function AdminPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.loggedIn) {
    return (
      <form action="/api/login" method="post" className="p-4 space-y-2">
        <input type="password" name="password" placeholder="Password" className="p-2 rounded bg-[var(--surface)]" />
        <button type="submit" className="px-4 py-2 rounded bg-[var(--accent)] text-black">Login</button>
      </form>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <NewPostForm />
    </div>
  );
}
