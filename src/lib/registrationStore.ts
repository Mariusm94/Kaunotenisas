import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export type RegistrationConfig = {
  id: string;
  tournamentId: string;
  enabled: boolean;
  allowPartner: boolean;
  title: string;
  intro: string;
};

export type RegistrationEntryView = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partnerFirstName: string | null;
  partnerLastName: string | null;
  partnerEmail: string | null;
  partnerPhone: string | null;
  createdAt: Date;
};

type RegRow = {
  id: string;
  tournamentId: string;
  enabled: number | boolean;
  allowPartner: number | boolean;
  title: string;
  intro: string;
};

type EntryRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partnerFirstName: string | null;
  partnerLastName: string | null;
  partnerEmail: string | null;
  partnerPhone: string | null;
  createdAt: string | Date;
};

function asBool(value: number | boolean) {
  return value === true || value === 1;
}

function mapReg(row: RegRow): RegistrationConfig {
  return {
    id: row.id,
    tournamentId: row.tournamentId,
    enabled: asBool(row.enabled),
    allowPartner: asBool(row.allowPartner),
    title: row.title,
    intro: row.intro,
  };
}

function mapEntry(row: EntryRow): RegistrationEntryView {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    partnerFirstName: row.partnerFirstName,
    partnerLastName: row.partnerLastName,
    partnerEmail: row.partnerEmail,
    partnerPhone: row.partnerPhone,
    createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
  };
}

function defaultRegistrationCopy(tournamentTitle: string) {
  return {
    title: `Registracija — ${tournamentTitle}`,
    intro:
      "Užpildykite formą — vardas, pavardė, el. paštas ir telefonas. Jei žaidžiate dvejetus, galite iškart pridėti partnerį.",
  };
}

export async function getOrCreateRegistration(
  tournamentId: string,
  opts?: { enabled?: boolean; title?: string; intro?: string },
): Promise<RegistrationConfig> {
  try {
    const existing = await prisma.$queryRaw<RegRow[]>`
      SELECT id, tournamentId, enabled, allowPartner, title, intro
      FROM TournamentRegistration
      WHERE tournamentId = ${tournamentId}
      LIMIT 1
    `;
    if (existing[0]) return mapReg(existing[0]);

    const id = randomUUID();
    const now = new Date().toISOString();
    const enabled = opts?.enabled ?? false;
    const title = opts?.title?.trim() || "Registracija";
    const intro = opts?.intro?.trim() || "";
    await prisma.$executeRaw`
      INSERT INTO TournamentRegistration
        (id, tournamentId, enabled, allowPartner, title, intro, createdAt, updatedAt)
      VALUES
        (${id}, ${tournamentId}, ${enabled ? 1 : 0}, 1, ${title}, ${intro}, ${now}, ${now})
    `;

    return {
      id,
      tournamentId,
      enabled,
      allowPartner: true,
      title,
      intro,
    };
  } catch (error) {
    throw new Error(
      "Nepavyko pasiekti registracijos lentelių. Paleiskite `npx prisma db push` serveryje.",
      { cause: error },
    );
  }
}

/** Create/enable online form for tournaments with status „registracija“. */
export async function ensureOpenRegistration(tournament: {
  id: string;
  title: string;
  status: string;
}): Promise<RegistrationConfig | null> {
  if (tournament.status !== "registracija") return null;

  const copy = defaultRegistrationCopy(tournament.title);

  try {
    const rows = await prisma.$queryRaw<RegRow[]>`
      SELECT id, tournamentId, enabled, allowPartner, title, intro
      FROM TournamentRegistration
      WHERE tournamentId = ${tournament.id}
      LIMIT 1
    `;

    if (!rows[0]) {
      return getOrCreateRegistration(tournament.id, {
        enabled: true,
        title: copy.title,
        intro: copy.intro,
      });
    }

    const existing = mapReg(rows[0]);
    // Open registration status means the public form should be live.
    if (
      !existing.enabled ||
      existing.title === "Registracija" ||
      !existing.title.trim() ||
      !existing.intro.trim()
    ) {
      const title =
        !existing.title.trim() || existing.title === "Registracija" ? copy.title : existing.title;
      const intro = existing.intro.trim() ? existing.intro : copy.intro;
      await updateRegistrationConfig(existing.id, {
        title,
        intro,
        enabled: true,
        allowPartner: existing.allowPartner,
      });
      return {
        ...existing,
        title,
        intro,
        enabled: true,
      };
    }

    return existing;
  } catch (error) {
    console.error("[registration] ensureOpenRegistration failed:", error);
    return null;
  }
}

export async function ensureAllOpenRegistrations() {
  try {
    const open = await prisma.tournament.findMany({
      where: { status: "registracija", published: true },
      select: { id: true, title: true, status: true, slug: true },
    });
    let count = 0;
    for (const tournament of open) {
      const copy = defaultRegistrationCopy(tournament.title);
      const reg = await getOrCreateRegistration(tournament.id, {
        enabled: true,
        title: copy.title,
        intro: copy.intro,
      });
      if (
        !reg.enabled ||
        reg.title === "Registracija" ||
        !reg.title.trim() ||
        !reg.intro.trim()
      ) {
        await updateRegistrationConfig(reg.id, {
          title: !reg.title.trim() || reg.title === "Registracija" ? copy.title : reg.title,
          intro: reg.intro.trim() ? reg.intro : copy.intro,
          enabled: true,
          allowPartner: true,
        });
      }
      count += 1;
    }
    return count;
  } catch (error) {
    console.error("[registration] ensureAllOpenRegistrations failed:", error);
    return 0;
  }
}

export async function getRegistrationByTournamentSlug(slug: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { slug },
      select: { id: true, slug: true, title: true, status: true },
    });
    if (!tournament) return null;

    if (tournament.status === "registracija") {
      return {
        tournament,
        registration: await ensureOpenRegistration(tournament),
      };
    }

    const rows = await prisma.$queryRaw<RegRow[]>`
      SELECT id, tournamentId, enabled, allowPartner, title, intro
      FROM TournamentRegistration
      WHERE tournamentId = ${tournament.id}
      LIMIT 1
    `;

    return {
      tournament,
      registration: rows[0] ? mapReg(rows[0]) : null,
    };
  } catch {
    // Staging / seni DB dump'ai be TournamentRegistration — puslapis turi veikti be formos.
    return null;
  }
}

export async function updateRegistrationConfig(
  id: string,
  data: { title: string; intro: string; enabled: boolean; allowPartner: boolean },
) {
  const now = new Date().toISOString();
  await prisma.$executeRaw`
    UPDATE TournamentRegistration
    SET
      title = ${data.title},
      intro = ${data.intro},
      enabled = ${data.enabled ? 1 : 0},
      allowPartner = ${data.allowPartner ? 1 : 0},
      updatedAt = ${now}
    WHERE id = ${id}
  `;
}

export async function listRegistrationEntries(registrationId: string): Promise<RegistrationEntryView[]> {
  const rows = await prisma.$queryRaw<EntryRow[]>`
    SELECT
      id, firstName, lastName, email, phone,
      partnerFirstName, partnerLastName, partnerEmail, partnerPhone, createdAt
    FROM TournamentRegistrationEntry
    WHERE registrationId = ${registrationId}
    ORDER BY createdAt DESC
  `;
  return rows.map(mapEntry);
}

export async function createRegistrationEntry(data: {
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partnerFirstName: string | null;
  partnerLastName: string | null;
  partnerEmail: string | null;
  partnerPhone: string | null;
}) {
  const id = randomUUID();
  const now = new Date().toISOString();
  await prisma.$executeRaw`
    INSERT INTO TournamentRegistrationEntry
      (id, registrationId, firstName, lastName, email, phone,
       partnerFirstName, partnerLastName, partnerEmail, partnerPhone, createdAt)
    VALUES
      (${id}, ${data.registrationId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
       ${data.partnerFirstName}, ${data.partnerLastName}, ${data.partnerEmail}, ${data.partnerPhone}, ${now})
  `;
  return id;
}

export async function deleteRegistrationEntry(entryId: string) {
  await prisma.$executeRaw`
    DELETE FROM TournamentRegistrationEntry WHERE id = ${entryId}
  `;
}

export function fullName(first: string, last: string) {
  return `${first.trim()} ${last.trim()}`.trim();
}
