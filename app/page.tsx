import { prisma } from '../lib/db';
import PostCard from '../components/PostCard';

export const revalidate = 0;

export default async function Home() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <main className="p-4 space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}
