import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

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
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <Link href="/players" className="text-sm font-medium underline">
        Back to players
      </Link>

      <header className="my-8 border-b pb-6">
        <p className="text-sm text-gray-600">{player.ageGroup} · {player.position}</p>
        <h1 className="mt-2 text-3xl font-semibold">{player.name}</h1>
      </header>

      <section aria-label="Player totals" className="mb-10 grid grid-cols-1 gap-4 border-b pb-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-600">Minutes</p>
          <p className="mt-1 text-2xl font-semibold">{totalMinutes}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Goals</p>
          <p className="mt-1 text-2xl font-semibold">{totalGoals}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Assists</p>
          <p className="mt-1 text-2xl font-semibold">{totalAssists}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Appearances</h2>
        {player.appearances.length === 0 ? (
          <p className="border-t py-6 text-sm text-gray-600">No appearances recorded.</p>
        ) : (
          <div className="overflow-x-auto border-t">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th scope="col" className="py-3 pr-4 font-medium">Match</th>
                  <th scope="col" className="px-4 py-3 font-medium">Team</th>
                  <th scope="col" className="px-4 py-3 font-medium">Opponent</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Minutes</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Goals</th>
                  <th scope="col" className="py-3 pl-4 text-right font-medium">Assists</th>
                </tr>
              </thead>
              <tbody>
                {player.appearances.map((appearance) => (
                  <tr key={appearance.id} className="border-b last:border-b-0">
                    <th scope="row" className="py-3 pr-4 font-medium">{appearance.matchId}</th>
                    <td className="px-4 py-3">{appearance.team}</td>
                    <td className="px-4 py-3">{appearance.opponent}</td>
                    <td className="px-4 py-3 text-right">{appearance.minutesPlayed}</td>
                    <td className="px-4 py-3 text-right">{appearance.goals}</td>
                    <td className="py-3 pl-4 text-right">{appearance.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}