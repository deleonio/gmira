"use client";

import { useId, useState } from "react";
import s from "./bill.module.css";

type Status = "empty" | "ready" | "sending" | "error" | "sent";

/* The free resource, which is the one honest reason to ask for an email in this
   vertical: the spec sheet and the rate card template are useful whether or not
   anyone enrols. Six states live here so the page has all of them somewhere real:
   empty (nothing typed, the action says why it is off), hover, focus, disabled,
   loading, error naming the problem and the recovery, and the settled result. */
export default function SpecSheetRequest() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("empty");
  const fieldId = useId();
  const noteId = `${fieldId}-note`;

  const disabled = status === "empty" || status === "sending";

  function onChange(value: string) {
    setEmail(value);
    setStatus(value.trim().length === 0 ? "empty" : "ready");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 max-w-[30rem]">
      <label
        htmlFor={fieldId}
        className="block font-[family-name:var(--font-spec)] text-[12px] font-medium text-[var(--ink-2)]"
      >
        Email for the spec sheet and the rate card template
      </label>

      <div className="mt-2 flex flex-wrap items-stretch gap-2">
        <input
          id={fieldId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          disabled={status === "sending" || status === "sent"}
          aria-invalid={status === "error"}
          aria-describedby={noteId}
          onChange={(e) => onChange(e.target.value)}
          className={`${s.focusable} min-w-[16rem] flex-1 border-b-2 border-[var(--ink)] bg-[var(--stock-2)] px-3 py-2.5 font-[family-name:var(--font-spec)] text-[14px] text-[var(--ink)] transition-colors hover:bg-[#c9a621] disabled:border-[var(--rule)] disabled:text-[var(--ink-2)]`}
        />
        <button
          type="submit"
          disabled={disabled}
          className={`${s.focusable} border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 font-[family-name:var(--font-bill)] text-[15px] tracking-[0.06em] text-[var(--stock)] transition-colors hover:bg-[var(--spot)] hover:border-[var(--spot)] disabled:cursor-not-allowed disabled:border-[var(--rule)] disabled:bg-transparent disabled:text-[var(--ink-2)]`}
        >
          {status === "sending" ? "SENDING" : "SEND IT"}
        </button>
      </div>

      <p
        id={noteId}
        role="status"
        aria-live="polite"
        className="mt-3 max-w-[30rem] text-[13.5px] leading-relaxed"
      >
        {status === "empty" ? (
          <span className="text-[var(--ink-2)]">
            The button turns on once there is an address in the field. One email, the two
            documents attached, no sequence afterwards.
          </span>
        ) : null}
        {status === "ready" ? (
          <span className="text-[var(--ink-2)]">
            Ready. One email, the two documents attached, no sequence afterwards.
          </span>
        ) : null}
        {status === "sending" ? (
          <span className="text-[var(--ink-2)]">Sending, this takes a moment.</span>
        ) : null}
        {status === "error" ? (
          <span className="font-medium text-[var(--spot)]">
            That address has no domain after the @ sign, so nothing can be delivered to it.
            Add the part after the @ and send again.
          </span>
        ) : null}
        {status === "sent" ? (
          <span className="font-medium text-[var(--ink)]">
            Nothing was sent. This is a proof build and the form has no address behind it. In
            the live version the two documents arrive as attachments, not as a link to a portal.
          </span>
        ) : null}
      </p>
    </form>
  );
}
