import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

const prisma = new PrismaClient();

interface CSVRow {
  match_id?: string;
  match_date?: string;
  competition?: string;
  age_group?: string;
  home_team?: string;
  away_team?: string;
  player_id?: string;
  player_name?: string;
  position?: string;
  team?: string;
  opponent?: string;
  venue?: string;
  goals_for?: string;
  goals_against?: string;
  minutes_played?: string;
  goals?: string;
  assists?: string;
  passes_completed?: string;
  tackles_won?: string;
  interceptions?: string;
}

function numberFrom(value?: string): number {
  const parsed = Number.parseInt(value || '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const parsed = Papa.parse<CSVRow>(await file.text(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json({ error: 'Failed to parse CSV structure' }, { status: 400 });
    }

    const validRows = parsed.data.filter((row) => row.match_id?.trim() && row.player_name?.trim());
    if (validRows.length === 0) {
      return NextResponse.json(
        { error: 'CSV must include match_id and player_name columns with at least one data row.' },
        { status: 400 },
      );
    }

    let appearancesCount = 0;
    const playerIds = new Set<string>();

    for (const row of validRows) {
      const ageGroup = row.age_group?.trim() || 'U15';
      const name = row.player_name!.trim();
      const position = row.position?.trim() || 'CM';
      const requestedId = row.player_id?.trim();

      let player = requestedId
        ? await prisma.player.findUnique({ where: { id: requestedId } })
        : null;
      player ??= await prisma.player.findUnique({ where: { name_ageGroup: { name, ageGroup } } });

      if (player) {
        player = await prisma.player.update({
          where: { id: player.id },
          data: { name, ageGroup, position },
        });
      } else {
        player = await prisma.player.create({
          data: { ...(requestedId ? { id: requestedId } : {}), name, ageGroup, position },
        });
      }

      const matchDate = row.match_date?.trim() ? new Date(row.match_date) : new Date();
      if (Number.isNaN(matchDate.getTime())) {
        return NextResponse.json(
          { error: `Invalid match_date for match ${row.match_id}.` },
          { status: 400 },
        );
      }

      const match = await prisma.match.upsert({
        where: { id: row.match_id!.trim() },
        update: {},
        create: {
          id: row.match_id!.trim(),
          matchDate,
          competition: row.competition?.trim() || 'Unknown',
          ageGroup,
          homeTeam: row.home_team?.trim() || row.team?.trim() || 'Unknown',
          awayTeam: row.away_team?.trim() || row.opponent?.trim() || 'Unknown',
        },
      });

      const appearanceData = {
        team: row.team?.trim() || 'Unknown',
        opponent: row.opponent?.trim() || 'Unknown',
        venue: row.venue?.trim() || 'Unknown',
        goalsFor: numberFrom(row.goals_for),
        goalsAgainst: numberFrom(row.goals_against),
        position,
        minutesPlayed: numberFrom(row.minutes_played),
        goals: numberFrom(row.goals),
        assists: numberFrom(row.assists),
        passesCompleted: numberFrom(row.passes_completed),
        tackles: numberFrom(row.tackles_won),
        interceptions: numberFrom(row.interceptions),
      };

      const existingAppearance = await prisma.appearance.findFirst({
        where: { playerId: player.id, matchId: match.id },
        select: { id: true },
      });

      if (existingAppearance) {
        await prisma.appearance.update({
          where: { id: existingAppearance.id },
          data: appearanceData,
        });
      } else {
        await prisma.appearance.create({
          data: { ...appearanceData, playerId: player.id, matchId: match.id },
        });
      }

      playerIds.add(player.id);
      appearancesCount++;
    }

    return NextResponse.json({ success: true, appearancesCount, playersCount: playerIds.size });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}