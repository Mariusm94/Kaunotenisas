import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createLeagueDrawAction,
  deleteLeagueDrawAction,
} from "@/app/admin/turnyrai/[slug]/lygos/actions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await prisma.tournament.findUnique({ where: { slug } });
  return { title: row ? `Lygos · ${row.title}` : "Lygos" };
}

export default async function AdminTournamentLeaguesPage({ params }: Props) {
  const { slug } = await params;
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      draws: {
        orderBy: [{ groupName: "asc" }, { title: "asc" }],
        include: { _count: { select: { matches: true, brackets: true } } },
      },
    },
  });
  if (!tournament) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">
            <Link href="/admin/turnyrai" className="font-semibold text-court">
              ← Turnyrai
            </Link>
            {" · "}
            <Link href={`/admin/turnyrai/${slug}`} className="font-semibold text-court">
              Taisyti turnyrą
            </Link>
          </p>
          <h1 className="mt-2 font-display text-4xl">Lygos — {tournament.title}</h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            Čia valdote lygas, mačus ir playoff. Kas išsaugota — matosi viešame turnyro puslapyje.
          </p>
        </div>
        <Link href={`/turnyrai/${slug}`} className="rounded-full border border-line px-5 py-3 text-sm font-semibold">
          Žiūrėti viešai
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-[1.75rem] bg-white shadow-sm">
        <table className="w-full min-w-[40rem] text-left">
          <thead className="bg-court-deep text-white">
            <tr>
              <th className="px-5 py-3 text-sm font-medium">Raktas</th>
              <th className="px-5 py-3 text-sm font-medium">Grupė</th>
              <th className="px-5 py-3 text-sm font-medium">Lyga</th>
              <th className="px-5 py-3 text-sm font-medium">Mačai</th>
              <th className="px-5 py-3 text-sm font-medium">Playoff</th>
              <th className="px-5 py-3 text-sm font-medium" />
            </tr>
          </thead>
          <tbody>
            {tournament.draws.length ? (
              tournament.draws.map((draw) => (
                <tr key={draw.id} className="border-t border-line">
                  <td className="px-5 py-3 font-mono text-sm text-ink-soft">{draw.externalKey}</td>
                  <td className="px-5 py-3 text-sm">{draw.groupName}</td>
                  <td className="px-5 py-3 font-medium">{draw.title}</td>
                  <td className="px-5 py-3 text-sm">{draw._count.matches}</td>
                  <td className="px-5 py-3 text-sm">{draw._count.brackets}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3 text-sm font-semibold">
                      <Link href={`/admin/turnyrai/${slug}/lygos/${draw.externalKey}`} className="text-court">
                        Taisyti
                      </Link>
                      <form action={deleteLeagueDrawAction}>
                        <input type="hidden" name="tournamentSlug" value={slug} />
                        <input type="hidden" name="externalKey" value={draw.externalKey} />
                        <button type="submit" className="text-red-700">
                          Trinti
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-soft">
                  Kol kas nėra lygų — sukurkite pirmą žemiau.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        action={createLeagueDrawAction}
        className="mt-10 grid gap-4 rounded-[2rem] bg-white p-8 shadow-sm"
      >
        <input type="hidden" name="tournamentSlug" value={slug} />
        <h2 className="font-display text-3xl">Nauja lyga</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            Grupė
            <input required name="groupName" placeholder="pvz. Mixai" className="rounded-2xl border border-line px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Lygos pavadinimas
            <input required name="title" placeholder="pvz. Masters" className="rounded-2xl border border-line px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Raktas (URL)
            <input name="externalKey" placeholder="automatiškai" className="rounded-2xl border border-line px-4 py-3" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Komandos (po vieną eilutėje)
          <textarea required name="teams" rows={6} className="rounded-2xl border border-line px-4 py-3" />
        </label>
        <p className="text-sm text-ink-soft">
          Taškai, vietos ir lentelė perskaičiuojami iš patvirtintų mačų — po sukūrimo galite sugeneruoti ratų mačus.
        </p>
        <button type="submit" className="justify-self-start rounded-full bg-court px-5 py-3 font-semibold text-white">
          Sukurti lygą
        </button>
      </form>
    </div>
  );
}
