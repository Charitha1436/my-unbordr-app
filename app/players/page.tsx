import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    include: { appearances: true },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Players</h1>
        <p className="mt-2 text-sm text-gray-600">{players.length} players</p>
      </header>

      {players.length === 0 ? (
        <p className="border-t py-6 text-sm text-gray-600">No players yet.</p>
      ) : (
        <div className="overflow-x-auto border-t">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Age group</th>
                <th scope="col" className="px-4 py-3 font-medium">Position</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Appearances</th>
                <th scope="col" className="py-3 pl-4 text-right font-medium">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const totalMinutes = player.appearances.reduce(
                  (total, appearance) => total + appearance.minutesPlayed,
                  0,
                );

                return (
                  <tr key={player.id} className="border-b last:border-b-0">
                    <th scope="row" className="py-3 pr-4 font-medium">{player.name}</th>
                    <td className="px-4 py-3">{player.ageGroup}</td>
                    <td className="px-4 py-3">{player.position}</td>
                    <td className="px-4 py-3 text-right">{player.appearances.length}</td>
                    <td className="py-3 pl-4 text-right">{totalMinutes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
