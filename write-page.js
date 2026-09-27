const fs = require('fs');

const code = `import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    include: { appearances: true },
    orderBy: { name: 'asc' },
  });

  return (