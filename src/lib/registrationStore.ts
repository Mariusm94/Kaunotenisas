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

export async function getOrCreateRegistration(tournamentId: string): Promise<RegistrationConfig> {
  const existing = await prisma.$queryRaw<RegRow[]>`
    SELECT id, tournamentId, enabled, allowPartner, title, intro
    FROM TournamentRegistration
    WHERE tournamentId = ${tournamentId}
    LIMIT 1
  `;
  if (existing[0]) return mapReg(existing[0]);

  const id = randomUUID();
  const now = new Date().toISOString();
  await prisma.$executeRaw`
    INSERT INTO TournamentRegistration
      (id, tournamentId, enabled, allowPartner, title, intro, createdAt, updatedAt)
    VALUES
      (${id}, ${tournamentId}, 0, 1, ${"Registracija"}, ${""}, ${now}, ${now})
  `;

  return {
    id,
    tournamentId,
    enabled: false,
    allowPartner: true,
    title: "Registracija",
    intro: "",
  };
}

export async function getRegistrationByTournamentSlug(slug: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, status: true },
  });
  if (!tournament) return null;

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
