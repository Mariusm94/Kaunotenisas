import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createMatchAction,
  deleteBracketAction,
  deleteMatchAction,
  generateRoundRobinMatchesAction,
  updateLeagueDrawAction,
  updateMatchAction,
  upsertBracketPayloadAction,
} from "@/app/admin/turnyrai/[slug]/lygos/actions";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string; externalKey: string }> };

function parseJsonPretty(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, externalKey } = await params;
  return { title: `Lyga · ${externalKey} · ${slug}` };
}

export default async function AdminLeagueDrawPage({ params }: Props) {
  const { slug, externalKey } = await params;
  const draw = await prisma.leagueDraw.findFirst({
    where: { externalKey, tournament: { slug } },
    include: {
      tournament: true,
      matches: { orderBy: [{ playedAt: "asc" }, { createdAt: "asc" }] },
      brackets: { orderBy: { title: "asc" } },
    },
  });
  if (!draw) notFound();

  let teams: string[] = [];
  let points: number[] = [];
  let places: number[] = [];
  try {
    teams = JSON.parse(draw.teams) as string[];
    points = JSON.parse(draw.points) as number[];
    places = JSON.parse(draw.places) as number[];
  } catch {
    teams = [];
    points = [];
    places = [];
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-ink-soft">
          <Link href={`/admin/turnyrai/${slug}/lygos`} className="font-semibold text-court">
            ← Visos lygos
          </Link>
          {" · "}
          <Link href={`/turnyrai/${slug}/lenteles/${externalKey}`} className="font-semibold text-court">
            Vieša lentelė
          </Link>
        </p>
        <h1 className="mt-2 font-display text-4xl">
          {draw.groupName} — {draw.title}
        </h1>
        <p className="mt-1 font-mono text-sm text-ink-soft">{draw.externalKey}</p>
      </div>

      <form action={updateLeagueDrawAction} className="grid gap-4 rounded-[2rem] bg-white p-8 shadow-sm">
        <input type="hidden" name="tournamentSlug" value={slug} />
        <input type="hidden" name="externalKey" value={externalKey} />
        <h2 className="font-display text-3xl">Lygos duomenys</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Grupė
            <input required name="groupName" defaultValue={draw.groupName} className="rounded-2xl border border-line px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Pavadinimas
            <input required name="title" defaultValue={draw.title} className="rounded-2xl border border-line px-4 py-3" />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Komandos (po vieną eilutėje)
          <textarea required name="teams" rows={8} defaultValue={teams.join("\n")} className="rounded-2xl border border-line px-4 py-3" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Taškai
            <textarea
              readOnly
              rows={3}
              defaultValue={points.join(", ")}
              className="rounded-2xl border border-line bg-paper px-4 py-3 text-ink-soft"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Vietos
            <textarea
              readOnly
              rows={3}
              defaultValue={places.join(", ")}
              className="rounded-2xl border border-line bg-paper px-4 py-3 text-ink-soft"
            />
          </label>
        </div>
        <p className="text-sm text-ink-soft">Perskaičiuojama iš patvirtintų mačų</p>
        <button type="submit" className="justify-self-start rounded-full bg-court px-5 py-3 font-semibold text-white">
          Išsaugoti lygą
        </button>
      </form>

      <section className="space-y-4 rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Mačai</h2>
          <form action={generateRoundRobinMatchesAction}>
            <input type="hidden" name="tournamentSlug" value={slug} />
            <input type="hidden" name="externalKey" value={externalKey} />
            <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              Sugeneruoti ratų mačus
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="bg-court-deep text-white">
              <tr>
                <th className="px-3 py-2 font-medium">Komanda namie</th>
                <th className="px-3 py-2 font-medium">Svečiai</th>
                <th className="px-3 py-2 font-medium">Rezultatas</th>
                <th className="px-3 py-2 font-medium">Etapas</th>
                <th className="px-3 py-2 font-medium">Būsena</th>
                <th className="px-3 py-2 font-medium">Data</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {draw.matches.map((match) => (
                <tr key={match.id} className="border-t border-line align-top">
                  <td colSpan={7} className="px-2 py-3">
                    <form action={updateMatchAction} className="grid gap-2 md:grid-cols-7">
                      <input type="hidden" name="tournamentSlug" value={slug} />
                      <input type="hidden" name="externalKey" value={externalKey} />
                      <input type="hidden" name="matchId" value={match.id} />
                      <input
                        name="home"
                        defaultValue={match.home}
                        aria-label="Komanda namie"
                        className="rounded-xl border border-line px-3 py-2"
                      />
                      <input
                        name="away"
                        defaultValue={match.away}
                        aria-label="Svečiai"
                        className="rounded-xl border border-line px-3 py-2"
                      />
                      <input
                        name="score"
                        defaultValue={match.score}
                        aria-label="Rezultatas"
                        placeholder="6:4 6:2"
                        className="rounded-xl border border-line px-3 py-2"
                      />
                      <input
                        name="stage"
                        defaultValue={match.stage}
                        aria-label="Etapas"
                        className="rounded-xl border border-line px-3 py-2"
                      />
                      <select
                        name="status"
                        defaultValue={match.status}
                        aria-label="Būsena"
                        className="rounded-xl border border-line px-3 py-2"
                      >
                        <option value="confirmed">Patvirtinta</option>
                        <option value="pending">Laukia</option>
                      </select>
                      <input
                        name="playedAt"
                        defaultValue={match.playedAt ?? ""}
                        aria-label="Data"
                        placeholder="YYYY-MM-DD"
                        className="rounded-xl border border-line px-3 py-2"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-full bg-court px-3 py-2 text-xs font-semibold text-white">
                          Saugoti
                        </button>
                      </div>
                    </form>
                    <form action={deleteMatchAction} className="mt-1">
                      <input type="hidden" name="tournamentSlug" value={slug} />
                      <input type="hidden" name="externalKey" value={externalKey} />
                      <input type="hidden" name="matchId" value={match.id} />
                      <button type="submit" className="text-xs font-semibold text-red-700">
                        Trinti mačą
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={createMatchAction} className="mt-4 grid gap-3 rounded-2xl bg-paper p-4 md:grid-cols-3">
          <input type="hidden" name="tournamentSlug" value={slug} />
          <input type="hidden" name="externalKey" value={externalKey} />
          <input required name="home" placeholder="Komanda namie" className="rounded-xl border border-line px-3 py-2" />
          <input required name="away" placeholder="Svečiai" className="rounded-xl border border-line px-3 py-2" />
          <input name="score" placeholder="Rezultatas (6:4 6:2)" className="rounded-xl border border-line px-3 py-2" />
          <input name="stage" placeholder="Etapas" defaultValue="Grupė" className="rounded-xl border border-line px-3 py-2" />
          <select name="status" defaultValue="confirmed" className="rounded-xl border border-line px-3 py-2">
            <option value="confirmed">Patvirtinta</option>
            <option value="pending">Laukia</option>
          </select>
          <input name="playedAt" placeholder="Data (YYYY-MM-DD)" className="rounded-xl border border-line px-3 py-2" />
          <button type="submit" className="rounded-full bg-court px-4 py-2 font-semibold text-white md:col-span-3 md:justify-self-start">
            Pridėti mačą
          </button>
        </form>
      </section>

      <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="font-display text-3xl">Playoff</h2>
        {draw.brackets.map((bracket) => (
          <div key={bracket.id} className="space-y-3 rounded-2xl border border-line p-4">
            <form action={upsertBracketPayloadAction} className="grid gap-3">
              <input type="hidden" name="tournamentSlug" value={slug} />
              <input type="hidden" name="externalKey" value={externalKey} />
              <input type="hidden" name="bracketId" value={bracket.id} />
              <div className="grid gap-3 md:grid-cols-3">
                <label className="grid gap-1 text-sm font-medium">
                  External ID
                  <input required name="externalId" defaultValue={bracket.externalId} className="rounded-xl border border-line px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Pavadinimas
                  <input required name="title" defaultValue={bracket.title} className="rounded-xl border border-line px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Lyga
                  <input name="league" defaultValue={bracket.league} className="rounded-xl border border-line px-3 py-2" />
                </label>
              </div>
              <label className="grid gap-1 text-sm font-medium">
                Grupė
                <input name="groupName" defaultValue={bracket.groupName} className="rounded-xl border border-line px-3 py-2" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Payload JSON
                <textarea
                  name="payload"
                  rows={10}
                  defaultValue={parseJsonPretty(bracket.payload)}
                  className="rounded-xl border border-line px-3 py-2 font-mono text-xs"
                />
              </label>
              <button type="submit" className="justify-self-start rounded-full bg-court px-4 py-2 text-sm font-semibold text-white">
                Išsaugoti playoff
              </button>
            </form>
            <form action={deleteBracketAction}>
              <input type="hidden" name="tournamentSlug" value={slug} />
              <input type="hidden" name="externalKey" value={externalKey} />
              <input type="hidden" name="bracketId" value={bracket.id} />
              <button type="submit" className="text-sm font-semibold text-red-700">
                Trinti playoff
              </button>
            </form>
          </div>
        ))}

        <form action={upsertBracketPayloadAction} className="grid gap-3 rounded-2xl bg-paper p-4">
          <h3 className="font-semibold">Naujas playoff</h3>
          <input type="hidden" name="tournamentSlug" value={slug} />
          <input type="hidden" name="externalKey" value={externalKey} />
          <div className="grid gap-3 md:grid-cols-3">
            <input required name="externalId" placeholder="externalId" className="rounded-xl border border-line px-3 py-2" />
            <input required name="title" placeholder="Pavadinimas" className="rounded-xl border border-line px-3 py-2" />
            <input name="league" defaultValue={draw.title} placeholder="Lyga" className="rounded-xl border border-line px-3 py-2" />
          </div>
          <input name="groupName" defaultValue={draw.groupName} placeholder="Grupė" className="rounded-xl border border-line px-3 py-2" />
          <textarea
            name="payload"
            rows={8}
            placeholder='{"layout":"tree","rounds":[]}'
            className="rounded-xl border border-line px-3 py-2 font-mono text-xs"
          />
          <button type="submit" className="justify-self-start rounded-full bg-court px-4 py-2 text-sm font-semibold text-white">
            Pridėti playoff
          </button>
        </form>
      </section>
    </div>
  );
}
