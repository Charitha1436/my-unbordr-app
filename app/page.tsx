'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading and processing CSV data...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Ingested ${data.appearancesCount || 0} appearance records across ${data.playersCount || 0} players.`);
      } else {
        setMessage(`Error: ${data.error || 'Failed to parse CSV file.'}`);
      }
    } catch {
      setMessage('Error uploading CSV file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
      <header>
        <h1 className="text-3xl font-semibold">Player data</h1>
        <p className="mt-2 text-sm text-gray-600">Upload a CSV file to process player appearances.</p>
      </header>

      <section className="flex flex-col items-start gap-4">
        <label htmlFor="player-csv" className="text-sm font-medium">Upload CSV</label>
        <input
          id="player-csv"
          type="file"
          accept=".csv,text/csv"
          disabled={uploading}
          onChange={handleFileUpload}
        />
        {message && <p role="status" aria-live="polite">{message}</p>}
      </section>

      <Link href="/players" className="text-sm font-medium underline">
        Browse players
      </Link>
    </main>
  );
}