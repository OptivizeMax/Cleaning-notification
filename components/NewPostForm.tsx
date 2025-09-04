'use client';

import { useState, FormEvent } from 'react';

export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);
    await fetch('/api/post', {
      method: 'POST',
      body: formData,
    });
    setTitle('');
    setBody('');
    setImage(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded bg-[var(--surface)]"
      />
      <textarea
        placeholder="Notes"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-2 rounded bg-[var(--surface)]"
      />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button type="submit" className="px-4 py-2 rounded bg-[var(--accent)] text-black">Submit & Notify</button>
    </form>
  );
}
