'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlayerDetailPage({ params }: { params: { id: string } }) {
  const [playerData, setPlayerData] = useState(null);
  const [aiReport, setAiReport] = useState('Generating scout assessment...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch player detail & stats
    async function fetchData() {
      const res = await fetch(`/api/players/${params.id}`);
      const data = await res.json();
      setPlayerData(data);
      setLoading(false);

      // Trigger AI Scout endpoint
      if (data) {
        const scoutRes = await fetch('/api/scout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            position: data.position,
            ageGroup: data.ageGroup,
            percentile: data.rating,
            stats: data.p90Stats
          })
        });
        const scoutData = await scoutRes.json();
        setAiReport(scoutData.summary);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) return