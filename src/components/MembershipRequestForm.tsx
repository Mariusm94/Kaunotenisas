"use client";

import { FormEvent } from "react";
import { clubMailto } from "@/lib/mail";

export default function MembershipRequestForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const about = String(data.get("about") ?? "");
    window.location.href = clubMailto(
      `Prašymas tapti nariu — ${name}`,
      `Vardas: ${name}\nEl. paštas: ${email}\nTelefonas: ${phone}\n\n${about}`,
    );
  }

  return (
    <form id="prasymas" onSubmit={onSubmit} className="mt-10 grid scroll-mt-28 gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Vardas ir pavardė
        <input required name="name" className="rounded-2xl border border-line px-4 py-3" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        El. paštas
        <input required type="email" name="email" className="rounded-2xl border border-line px-4 py-3" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Telefonas
        <input name="phone" className="rounded-2xl border border-line px-4 py-3" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Trumpai apie save
        <textarea name="about" rows={4} className="rounded-2xl border border-line px-4 py-3" />
      </label>
      <button type="submit" className="rounded-full bg-court px-6 py-3 font-semibold text-white">
        Atidaryti laišką klubui
      </button>
    </form>
  );
}
