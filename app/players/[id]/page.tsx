import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

interface PageProps {
  params: Promise<; id: string >>;
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4dl mx-auto space-y-6">
        <Link
          href="/players"
          className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          ‚Çê Back to Directory
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">{player.name}</h1>
          <div className="flex gap-3 text-sm">
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-3 py-1 rounded-full font-medium">
              {player.position}
            </span>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full font-medium">
              {player.ageGroup}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-slate-400">Total Appearances</p>
            <p className="text-3xl font-extrabold text-white mt-1">{player.appearances.length}</p>
          </div>
          <div className="bg-Õ±Ö—î¥‰¿¿ÅâΩ…ëï»ÅâΩ…ëï»µÕ±Ö—î¥‡¿¿Å…Ω’πëïêµ·∞Å¿¥‘Å—ï·–µçïπ—ï»à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µµïë•’¥Å—ï·–µÕ±Ö—î¥–¿¿à˘5•π’—ïÃÅA±ÖÂïêΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–¥Õ·∞ÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µïµï…Ö±ê¥–¿¿Åµ–¥ƒà˘Ì—Ω—Ö±5•π’—ïÕÙΩ¿¯(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙââúµÕ±Ö—î¥‰¿¿ÅâΩ…ëï»ÅâΩ…ëï»µÕ±Ö—î¥‡¿¿Å…Ω’πëïêµ·∞Å¿¥‘Å—ï·–µçïπ—ï»à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µµïë•’¥Å—ï·–µÕ±Ö—î¥–¿¿à˘ΩÖ±ÃÄºÅÕÕ•Õ—ÃΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–¥Õ·∞ÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µ›°•—îÅµ–¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ—Ω—Ö±ΩÖ±ÕÙÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ±Ö—î¥‘¿¿Å—ï·–µ·∞à¯ºΩÕ¡Ö∏¯ÅÌ—Ω—Ö±ÕÕ•Õ—ÕÙ(ÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯((ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙââúµÕ±Ö—î¥‰¿¿ÅâΩ…ëï»ÅâΩ…ëï»µÕ±Ö—î¥‡¿¿Å…Ω’πëïêµ·∞Å¿¥ÿà¯(ÄÄÄÄÄÄÄÄÄÄÒ†»Åç±ÖÕÕ9ÖµîÙâ—ï·–µ·∞ÅôΩπ–µâΩ±êÅ—ï·–µ›°•—îÅµà¥–à˘5Ö—ç†Å%πùïÕ—•Ω∏Å!•Õ—Ω…‰Ω†»¯(ÄÄÄÄÄÄÄÄÄÅÌ¡±ÖÂï»πÖ¡¡ïÖ…ÖπçïÃπ±ïπù—†ÄÙÙÙÄ¿Ä¸Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ±Ö—î¥–¿¿Å—ï·–µÕ¥à˘9ºÅÖ¡¡ïÖ…ÖπçîÅ…ïçΩ…ëÃÅôΩ’πêÅôΩ»Å—°•ÃÅ¡±ÖÂï»∏Ω¿¯(ÄÄÄÄÄÄÄÄÄÄ§ÄËÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâΩŸï…ô±Ω‹µ‡µÖ’—ºà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—Öâ±îÅç±ÖÕÕ9ÖµîÙâ‹µô’±∞Å—ï·–µ±ïô–Å—ï·–µÕ¥Å—ï·–µÕ±Ö—î¥Ã¿¿à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—°ïÖêÅç±ÖÕÕ9ÖµîÙââúµÕ±Ö—î¥‡¿¿ºÿ¿Å—ï·–µÕ±Ö—î¥–¿¿Å’¡¡ï…çÖÕîÅ—ï·–µ·Ãà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—»¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—†Åç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥Ãà˘IïçΩ…êÅ%Ω—†¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—†Åç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥Ãà˘5•π’—ïÃΩ—†¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—†Åç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥Ãà˘ΩÖ±ÃΩ—†¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—†Åç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥Ãà˘ÕÕ•Õ—ÃΩ—†¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ—»¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ—°ïÖê¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—âΩë‰Åç±ÖÕÕ9ÖµîÙâë•Ÿ•ëîµ‰Åë•Ÿ•ëîµÕ±Ö—î¥‡¿¿à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ¡±ÖÂï»πÖ¡¡ïÖ…ÖπçïÃπµÖ¿†°Ö¡¿§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—»Å≠ï‰ıÌÖ¡¿π•ëÙÅç±ÖÕÕ9ÖµîÙâ°ΩŸï»ÈâúµÕ±Ö—î¥‡¿¿º–¿Å—…ÖπÕ•—•Ω∏µçΩ±Ω…Ãà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—êÅç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥ÃÅôΩπ–µµΩπºÅ—ï·–µ·ÃÅ—ï·–µÕ±Ö—î¥–¿¿à˘ÌÖ¡¿π•ëÙΩ—ê¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—êÅç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥ÃÅôΩπ–µÕïµ•âΩ±êÅ—ï·–µ›°•—îà˘ÌÖ¡¿πµ•π’—ïÕA±ÖÂïëÙΩ—ê¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—êÅç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥ÃÅ—ï·–µÕ±Ö—î¥Ã¿¿à˘ÌÖ¡¿πùΩÖ±ÕÙΩ—ê¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—êÅç±ÖÕÕ9ÖµîÙâ¡‡¥–Å¡‰¥ÃÅ—ï·–µÕ±Ö—î¥Ã¿¿à˘ÌÖ¡¿πÖÕÕ•Õ—ÕÙΩ—ê¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ—»¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ—âΩë‰¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ—Öâ±î¯(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄΩµÖ•∏¯(ÄÄ§Ï}