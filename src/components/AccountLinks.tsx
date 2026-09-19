"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { logoutAction } from "@/app/auth-actions";

export default function AccountLinks({ mobile = false }: { mobile?: boolean }) {
  const { data, status } = useSession();

  if (status === "loading") return null;

  if (!data?.user) {
    if (mobile) {
      return (
        <Link href="/prisijungti" className="rounded-xl px-3 py-2 text-gold">
          Prisijungti
        </Link>
      );
    }
    return (
      <Link
        href="/prisijungti"
        className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 md:inline-flex"
      >
        Prisijungti
      </Link>
    );
  }

  const admin = data.user.role === "admin";

  if (mobile) {
    return (
      <>
        <Link href="/mano" className="rounded-xl px-3 py-2 text-gold">
          Mano mačai
        </Link>
        {admin ? (
          <Link href="/admin" className="rounded-xl px-3 py-2 text-gold">
            Administravimas
          </Link>
        ) : null}
        <form action={logoutAction}>
          <button type="submit" className="rounded-xl px-3 py-2 text-left text-white/80">
            Atsijungti
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link href="/mano" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
        Mano mačai
      </Link>
      {admin ? (
        <Link href="/admin" className="rounded-full px-4 py-2 text-sm font-medium text-gold hover:bg-white/10">
          Admin
        </Link>
      ) : null}
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
        >
          Atsijungti
        </button>
      </form>
    </div>
  );
}
