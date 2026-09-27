import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      appearances: true,
    },
  });

  if (!player) {
    notFound();
  }

  const totalMinutes = player.appearances.reduce((acc, curr) => acc + curr.minutesPlayed, 0);
  const totalGoals = player.appearances.reduce((acc, curr) => acc + curr.goals, 0);
  const totalAssists = player.appearances.reduce((acc, curr) => acc + curr.assists, 0);

  return (