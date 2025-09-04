import Image from 'next/image';
import { Post } from '@prisma/client';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-md bg-[var(--surface)] p-4">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="mb-2 whitespace-pre-wrap">{post.body}</p>
      {post.imageUrls.map((url, i) => (
        <Image key={i} src={url} alt="" width={400} height={300} className="rounded" />
      ))}
      <p className="text-sm text-gray-400 mt-2">{new Date(post.createdAt).toLocaleString()}</p>
    </article>
  );
}
