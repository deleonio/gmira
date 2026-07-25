"use client";

import { useEffect, useRef, useState } from "react";
import { SHOP, eur, vatContained } from "../data";
import { FOCUS } from "../ui";

export interface BagLine {
  key: string;
  title: string;
  handle: string;
  dyeName: string;
  dyeVar: string;
  size: string;
  sku: string;
  lot: string;
  qty: number;
  unitCents: number;
  lineCents: number;
  packedWeightG: number;
}

/* ------------------------------------------------------------------ countries and zones */

const COUNTRIES = [
  { code: "DE", name: "Germany", zone: 0, numericPostcode: true, postcodeDigits: 5 },
  { code: "AT", name: "Austria", zone: 1, numericPostcode: true, postcodeDigits: 4 },
  { code: "NL", name: "Netherlands", zone: 1, numericPostcode: false, postcodeDigits: 0 },
  { code: "CH", name: "Switzerland", zone: 2, numericPostcode: true, postcodeDigits: 4 },
  { code: "GB", name: "United Kingdom", zone: 2, numericPostcode: false, postcodeDigits: 0 },
] as const;

/* A stand-in for a postcode service. Two hits and everything else a miss, so the loading
   state and the failure state are both reachable by hand. */
const POSTCODES: Record<string, string> = {
  "25554": "Wilster",
  "20095": "Hamburg",
  "10115": "Berlin",
  "1012": "Amsterdam",
  "8001": "Zuerich",
};

type FieldName =
  | "given"
  | "family"
  | "email"
  | "tel"
  | "line1"
  | "line2"
  | "postal"
  | "city"
  | "vat"
  | "note";

const REQUIRED: FieldName[] = ["given", "family", "email", "tel", "line1", "postal", "city"];

const EMPTY: Record<FieldName, string> = {
  given: "",
  family: "",
  email: "",
  tel: "",
  line1: "",
  line2: "",
  postal: "",
  city: "",
  vat: "",
  note: "",
};

/* Errors name the problem and the recovery. Both, every time. */
function validate(
  name: FieldName,
  value: string,
  ctx: { countryCode: string; business: boolean },
): string | null {
  const v = value.trim();
  switch (name) {
    case "given":
      if (!v) return "We print a first name on the label. Anything the carrier can read is fine.";
      return null;
    case "family":
      if (!v) return "DHL will not deliver to a first name alone. Add a family name.";
      return null;
    case "email":
      if (!v) return "The tracking link goes by email. Without one you hear nothing until it arrives.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v))
        return "That address cannot be delivered to. It should look like name@example.de, with an @ and a dot after it.";
      return null;
    case "tel":
      if (!v) return "The driver rings if nobody answers the door. Mobile or landline, either works.";
      if (v.replace(/\D/g, "").length < 6)
        return "That is too short to dial. Include the area code, for example 04823 000000.";
      return null;
    case "line1":
      if (!v) return "Street and house number, or the parcel has nowhere to go.";
      return null;
    case "postal": {
      if (!v) return "Postcode, because the postage depends on it.";
      const c = COUNTRIES.find((x) => x.code === ctx.countryCode);
      if (c?.numericPostcode && c.postcodeDigits > 0) {
        const digits = v.replace(/\D/g, "");
        if (digits.length !== c.postcodeDigits)
          return `${c.name} postcodes are ${c.postcodeDigits} digits, for example ${
            c.code === "DE" ? "25554" : c.code === "AT" ? "1010" : "8001"
          }. Correct it and we will look the town up again.`;
      }
      return null;
    }
    case "city":
      if (!v) return "Town. The postcode check fills this in, or type it yourself.";
      return null;
    case "vat":
      if (!ctx.business) return null;
      if (!v) return "A business order is invoiced against a VAT ID. Add it, or untick the business box.";
      if (!/^[A-Za-z]{2}[0-9A-Za-z]{6,}$/.test(v.replace(/\s/g, "")))
        return "A VAT ID starts with the two letter country code, for example DE123456789.";
      return null;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ one field */

function Field({
  name,
  id,
  label,
  hint,
  optional,
  type = "text",
  inputMode,
  autoComplete,
  value,
  error,
  disabled,
  disabledReason,
  loading,
  loadingText,
  onChange,
  onBlur,
  inputRef,
}: {
  name: string;
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  type?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "decimal";
  autoComplete?: string;
  value: string;
  error?: string | null;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  loadingText?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  inputRef?: (el: HTMLInputElement | null) => void;
}) {
  const described = [
    hint ? `${id}-hint` : null,
    disabled && disabledReason ? `${id}-why` : null,
    loading ? `${id}-busy` : null,
    error ? `${id}-err` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block font-[family-name:var(--font-spec)] text-[12px] font-medium text-[var(--ink)]"
      >
        {label}
        {optional ? <span className="ml-1.5 font-normal text-[var(--ink-2)]">optional</span> : null}
      </label>
      {hint ? (
        <p
          id={`${id}-hint`}
          className="mt-0.5 font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink-2)]"
        >
          {hint}
        </p>
      ) : null}

      <div className="relative mt-1.5">
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          disabled={disabled}
          ref={inputRef}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={described || undefined}
          className={`w-full border bg-[var(--stock)] px-3 py-2 font-[family-name:var(--font-body)] text-[15px] text-[var(--ink)] transition-colors ${FOCUS} ${
            loading ? "pr-24" : ""
          } ${
            disabled
              ? "cursor-not-allowed border-[var(--rule)] bg-[var(--stock-2)] text-[var(--ink-3)]"
              : error
                ? "border-[var(--madder)] hover:border-[var(--madder)]"
                : "border-[var(--ink-3)] hover:border-[var(--ink)]"
          }`}
        />
        {loading ? (
          <span
            id={`${id}-busy`}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 border border-[var(--rule)] bg-[var(--stock-2)] px-1.5 py-0.5 font-[family-name:var(--font-spec)] text-[11px] text-[var(--ink-2)]"
          >
            {loadingText ?? "checking"}
          </span>
        ) : null}
      </div>

      {disabled && disabledReason ? (
        <p
          id={`${id}-why`}
          className="mt-1 font-[family-name:var(--font-spec)] text-[11.5px] leading-snug text-[var(--ink-2)]"
        >
          {disabledReason}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-1 max-w-[34em] text-[13px] leading-snug text-[var(--madder)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ the step */

export function DeliveryForm({
  bag,
  bagPanel,
  goodsCents,
  holdUntil,
  holdMinutes,
}: {
  bag: BagLine[];
  bagPanel: React.ReactNode;
  goodsCents: number;
  holdUntil: string;
  holdMinutes: number;
}) {
  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string | null>>>({});
  const [countryCode, setCountryCode] = useState("DE");
  const [business, setBusiness] = useState(false);
  const [lookup, setLookup] = useState<"idle" | "loading" | "done" | "failed">("idle");
  const [step, setStep] = useState<"idle" | "submitting" | "success" | "failed">("idle");
  const [attention, setAttention] = useState<number>(0);
  const [expired, setExpired] = useState(false);

  const refs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const doneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  /* The hold is real, so it ends. One timeout, no ticking clock: a counter that repaints
     every second on a checkout is motion nobody asked for. */
  useEffect(() => {
    const t = setTimeout(() => setExpired(true), holdMinutes * 60_000);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [holdMinutes]);

  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
  const zone = SHOP.delivery[country.zone];
  const dap = zone.dutiesHandling === "DAP";
  const goodsNet = dap ? Math.round(goodsCents / 1.19) : goodsCents;
  const vatOff = goodsCents - goodsNet;
  const postageCents =
    zone.freeOverCents > 0 && goodsNet >= zone.freeOverCents ? 0 : zone.priceCents;
  const totalCents = goodsNet + postageCents;
  const vatIn = dap ? 0 : vatContained(goodsCents, 19);
  const units = bag.reduce((n, l) => n + l.qty, 0);

  function set(name: FieldName, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
    // Revalidate only a field that has already errored, so the message clears the moment it is
    // fixed and no field is corrected on its first keystroke.
    setErrors((prev) =>
      prev[name] ? { ...prev, [name]: validate(name, v, { countryCode, business }) } : prev,
    );
  }

  function blur(name: FieldName) {
    const v = values[name];
    if (v.trim() === "") return; // an untouched or emptied field is not an error yet
    setErrors((prev) => ({ ...prev, [name]: validate(name, v, { countryCode, business }) }));
    if (name === "postal") runLookup(v);
  }

  function runLookup(raw: string) {
    const key = raw.trim().replace(/\s/g, "");
    if (!key) return;
    if (validate("postal", raw, { countryCode, business })) return;
    setLookup("loading");
    const t = setTimeout(() => {
      const town = POSTCODES[key];
      if (town) {
        setValues((prev) => ({ ...prev, city: town }));
        setErrors((prev) => ({ ...prev, city: null, postal: null }));
        setLookup("done");
      } else {
        setLookup("failed");
        setErrors((prev) => ({
          ...prev,
          postal: `We have no ${key} in the ${country.name} list. Type the town in yourself and we will post to that.`,
        }));
      }
    }, 800);
    timers.current.push(t);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === "submitting") return;

    const next: Partial<Record<FieldName, string | null>> = {};
    for (const n of [...REQUIRED, "vat"] as FieldName[]) {
      next[n] = validate(n, values[n], { countryCode, business });
    }
    const bad = (Object.keys(next) as FieldName[]).filter((k) => next[k]);
    setErrors(next);
    setAttention(bad.length);

    if (bad.length > 0) {
      refs.current[bad[0]]?.focus();
      return;
    }
    if (lookup === "loading") return;

    setStep("submitting");
    const t = setTimeout(() => {
      // A business order is checked against VIES. A non-German ID fails here on purpose so the
      // server error state can be read without a network tab.
      if (business && !values.vat.trim().toUpperCase().startsWith("DE")) {
        setStep("failed");
      } else {
        setStep("success");
        const f = setTimeout(() => doneRef.current?.focus(), 30);
        timers.current.push(f);
      }
    }, 900);
    timers.current.push(t);
  }

  const submitBlocked = lookup === "loading";

  if (step === "success") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className={`bg-[var(--stock)] px-5 py-7 shadow-[0_8px_14px_-10px_rgba(30,26,17,0.55)] sm:px-7 ${FOCUS}`}
      >
        <h2 className="font-[family-name:var(--font-packet)] text-[1.6rem] font-bold tracking-[-0.01em]">
          Delivery saved
        </h2>
        <p className="mt-3 max-w-[34em] text-[15px] leading-relaxed text-[var(--ink-2)]">
          Reference W-2026-0417. Going to {values.given} {values.family}, {values.line1},{" "}
          {values.postal} {values.city}, {country.name}. Postage {eur(postageCents)}, total{" "}
          {eur(totalCents)}. Nothing has been charged: the card comes at the next step.
        </p>
        <p className="mt-3 max-w-[34em] text-[15px] leading-relaxed text-[var(--ink-2)]">
          Payment is the next step and it is not built in this proof, which is why there is no
          button to it. In a real flow this would be a redirect to /checkout/payment with the
          reference in the session, not in the query string.
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("idle");
            setAttention(0);
          }}
          className={`mt-5 border border-[var(--ink)] px-4 py-2 font-[family-name:var(--font-spec)] text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--stock)] ${FOCUS}`}
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid items-start gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
      {/* The hold, stated at the moment it starts rather than discovered at submit. */}
      <p
        className={`border-y py-2 font-[family-name:var(--font-spec)] text-[12px] tabular-nums ${
          expired ? "border-[var(--madder)] text-[var(--madder)]" : "border-[var(--rail)] text-[var(--ink)]"
        }`}
      >
        {expired
          ? `The hold ran out. The ${units} pieces went back on the rack and the bag is unreserved. The price has not changed, so finishing this step still works if nobody took them.`
          : `${units} pieces are held for you until ${holdUntil} Berlin time, ${holdMinutes} minutes from when this step opened.`}
      </p>

      {attention > 0 ? (
        <p
          role="alert"
          className="mt-4 border-t-2 border-[var(--madder)] pt-2 text-[14px] text-[var(--ink)]"
        >
          {attention} {attention === 1 ? "field needs" : "fields need"} attention. The first one has
          the cursor in it.
        </p>
      ) : null}

      {step === "failed" ? (
        <p
          role="alert"
          className="mt-4 max-w-[34em] border-t-2 border-[var(--madder)] pt-2 text-[14px] leading-snug text-[var(--ink)]"
        >
          <span className="font-[family-name:var(--font-spec)] text-[11.5px] uppercase tracking-[0.1em] text-[var(--madder)]">
            Not saved.{" "}
          </span>
          The European VAT service did not recognise {values.vat.trim()}. Nothing was charged and
          nothing was reserved beyond the hold above. Either correct the ID, or untick the business
          box and order as a private buyer, which needs no ID at all.
        </p>
      ) : null}

      <fieldset
        className="mt-6 border-0 p-0"
        inert={step === "submitting" || undefined}
      >
        <legend className="sr-only">Delivery address</legend>

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <Field
            name="given-name"
            id="given-name"
            label="First name"
            autoComplete="given-name"
            value={values.given}
            error={errors.given}
            onChange={(v) => set("given", v)}
            onBlur={() => blur("given")}
            inputRef={(el) => {
              refs.current.given = el;
            }}
          />
          <Field
            name="family-name"
            id="family-name"
            label="Family name"
            autoComplete="family-name"
            value={values.family}
            error={errors.family}
            onChange={(v) => set("family", v)}
            onBlur={() => blur("family")}
            inputRef={(el) => {
              refs.current.family = el;
            }}
          />
          <Field
            name="email"
            id="email"
            label="Email"
            hint="One message when it ships, with the tracking number. Nothing else."
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(v) => set("email", v)}
            onBlur={() => blur("email")}
            inputRef={(el) => {
              refs.current.email = el;
            }}
          />
          <Field
            name="tel"
            id="tel"
            label="Telephone"
            hint="The driver rings from the door if nobody answers."
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.tel}
            error={errors.tel}
            onChange={(v) => set("tel", v)}
            onBlur={() => blur("tel")}
            inputRef={(el) => {
              refs.current.tel = el;
            }}
          />
        </div>

        <div className="mt-5 grid gap-x-5 gap-y-5">
          <Field
            name="address-line1"
            id="address-line1"
            label="Street and number"
            autoComplete="address-line1"
            value={values.line1}
            error={errors.line1}
            onChange={(v) => set("line1", v)}
            onBlur={() => blur("line1")}
            inputRef={(el) => {
              refs.current.line1 = el;
            }}
          />
          <Field
            name="address-line2"
            id="address-line2"
            label="Extra address line"
            hint="Care of, flat number, gate code. Leave it empty if there is nothing to add."
            optional
            autoComplete="address-line2"
            value={values.line2}
            error={errors.line2}
            onChange={(v) => set("line2", v)}
            onBlur={() => blur("line2")}
            inputRef={(el) => {
              refs.current.line2 = el;
            }}
          />
        </div>

        <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-[10rem_1fr]">
          <Field
            name="postal-code"
            id="postal-code"
            label="Postcode"
            hint={
              country.numericPostcode
                ? `${country.postcodeDigits} digits. Try 25554 or 99999.`
                : "Letters and digits."
            }
            inputMode={country.numericPostcode ? "numeric" : "text"}
            autoComplete="postal-code"
            value={values.postal}
            error={errors.postal}
            loading={lookup === "loading"}
            loadingText="looking up"
            onChange={(v) => {
              set("postal", v);
              if (lookup !== "idle") setLookup("idle");
            }}
            onBlur={() => blur("postal")}
            inputRef={(el) => {
              refs.current.postal = el;
            }}
          />
          <Field
            name="address-level2"
            id="address-level2"
            label="Town"
            hint={
              lookup === "done"
                ? "Filled in from the postcode. Change it if it is wrong."
                : "The postcode check fills this in."
            }
            autoComplete="address-level2"
            value={values.city}
            error={errors.city}
            onChange={(v) => set("city", v)}
            onBlur={() => blur("city")}
            inputRef={(el) => {
              refs.current.city = el;
            }}
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="country"
            className="block font-[family-name:var(--font-spec)] text-[12px] font-medium text-[var(--ink)]"
          >
            Country
          </label>
          <p
            id="country-hint"
            className="mt-0.5 font-[family-name:var(--font-spec)] text-[11.5px] text-[var(--ink-2)]"
          >
            Changing this changes the postage and the tax treatment below, on this screen.
          </p>
          <select
            id="country"
            name="country"
            autoComplete="country-name"
            aria-describedby="country-hint"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setErrors((prev) => (prev.postal ? { ...prev, postal: null } : prev));
              setLookup("idle");
            }}
            className={`mt-1.5 w-full max-w-[22rem] border border-[var(--ink-3)] bg-[var(--stock)] px-3 py-2 font-[family-name:var(--font-body)] text-[15px] text-[var(--ink)] transition-colors hover:border-[var(--ink)] ${FOCUS}`}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Disabled, done properly: genuinely inapplicable input, with the reason next to it
            and a control that makes it applicable. */}
        <div className="mt-6 border-t border-[var(--rule)] pt-5">
          <div className="flex items-start gap-3">
            <input
              id="business"
              name="business"
              type="checkbox"
              checked={business}
              onChange={(e) => {
                setBusiness(e.target.checked);
                if (!e.target.checked) setErrors((prev) => ({ ...prev, vat: null }));
              }}
              className={`mt-1 h-4 w-4 shrink-0 accent-[var(--ink)] ${FOCUS}`}
            />
            <label htmlFor="business" className="text-[14.5px] leading-snug text-[var(--ink)]">
              This is a business order and needs an invoice with a VAT ID on it.
            </label>
          </div>

          <div className="mt-4 max-w-[22rem]">
            <Field
              name="vat-id"
              id="vat-id"
              label="VAT ID"
              autoComplete="off"
              value={values.vat}
              error={errors.vat}
              disabled={!business}
              disabledReason={
                !business
                  ? "Off, because a private order is invoiced without one. Tick the box above to turn it on."
                  : undefined
              }
              hint={business ? "Checked against the European VAT service when you save." : undefined}
              onChange={(v) => set("vat", v)}
              onBlur={() => blur("vat")}
              inputRef={(el) => {
                refs.current.vat = el;
              }}
            />
          </div>
        </div>
      </fieldset>

      <div className="mt-8">
        <button
          type="submit"
          aria-busy={step === "submitting" || undefined}
          aria-disabled={submitBlocked || step === "submitting" || undefined}
          className={`w-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 font-[family-name:var(--font-spec)] text-[13px] uppercase tracking-[0.12em] text-[var(--stock)] transition-colors hover:bg-[var(--ink-2)] sm:w-auto ${FOCUS}`}
        >
          {step === "submitting" ? "Saving the address" : "Save and go to payment"}
        </button>
        {submitBlocked ? (
          <p className="mt-2 font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink-2)]">
            Waiting on the postcode lookup. It takes under a second and then this works.
          </p>
        ) : null}
        <p className="mt-3 max-w-[34em] font-[family-name:var(--font-spec)] text-[11.5px] leading-snug text-[var(--ink)]">
          Payment stays blocked until a postcode and a town are on file, because the postage
          cannot be quoted without them. No card details are asked for on this step.
        </p>
      </div>

      {/* How to reach each state by hand. A state nobody can force is a state nobody reviews. */}
      <section
        aria-labelledby="states"
        className="mt-10 border-t-2 border-[var(--rail)] pt-5"
      >
        <h2
          id="states"
          className="font-[family-name:var(--font-spec)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink)]"
        >
          Six field states, and where each one is
        </h2>
        <dl className="mt-3 grid gap-x-8 gap-y-3 xl:grid-cols-2">
          {[
            ["Rest and empty", "Extra address line is optional and untouched. Tab through it and it stays quiet, because empty is not invalid."],
            ["Hover", "Every field darkens its border and nothing moves. A field that resizes under the pointer is a field you miss."],
            ["Focus", "A 2px ring with a 2px offset, visible against both the paper and the board. No field removes the outline."],
            ["Disabled", "VAT ID, until the business box is ticked. The reason sits under the field, not in a tooltip."],
            ["Loading", "Postcode, on blur. Try 25554 for a hit and 99999 for a miss. The field stays editable and the save button says why it waits."],
            ["Error", "Blur Email with tom@ in it, or press save with the form empty. Every message names the problem and the way out."],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-[var(--rule)] pt-2">
              <dt className="font-[family-name:var(--font-spec)] text-[12px] text-[var(--ink)]">{k}</dt>
              <dd className="mt-1 max-w-[34em] text-[13px] leading-snug text-[var(--ink-2)]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      </div>

      {/* The bag and the money, beside the form rather than four steps later. The bag itself
          is server rendered and handed in, so the client bundle carries the arithmetic only. */}
      <aside className="lg:col-start-2 lg:row-start-1">
        {bagPanel}

        <section aria-labelledby="total" className="mt-5 bg-[var(--stock)] px-5 py-5">
          <h2
            id="total"
            className="font-[family-name:var(--font-packet)] text-[1.25rem] font-bold tracking-[-0.01em]"
          >
            What it comes to
          </h2>
          <dl className="mt-3 font-[family-name:var(--font-spec)] text-[13px]">
            <div className="flex justify-between gap-6 border-b border-[var(--rule)] py-1.5">
              <dt>
                Cloths, {units} {units === 1 ? "piece" : "pieces"}
              </dt>
              <dd className="tabular-nums">{eur(goodsCents)}</dd>
            </div>
            {dap ? (
              <div className="flex justify-between gap-6 border-b border-[var(--rule)] py-1.5">
                <dt>German VAT taken off, export</dt>
                <dd className="tabular-nums">{eur(-vatOff)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-6 border-b border-[var(--rule)] py-1.5">
              <dt>
                Postage, {zone.carrier} {zone.service}
              </dt>
              <dd className="tabular-nums">
                {postageCents === 0 ? `free over ${eur(zone.freeOverCents)}` : eur(postageCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 py-2">
              <dt className="font-medium">To pay now</dt>
              <dd className="text-[17px] font-medium">
                <output htmlFor="country" aria-live="polite" className="block tabular-nums">
                  {eur(totalCents)}
                </output>
              </dd>
            </div>
          </dl>

          <p className="mt-2 max-w-[34em] text-[13px] leading-snug text-[var(--ink-2)]">
            {dap
              ? `DAP. ${zone.note}`
              : `DDP. Includes ${eur(vatIn)} MwSt. at 19 percent. Nothing further is billed on delivery.`}{" "}
            {zone.estimateBusinessDays.min} to {zone.estimateBusinessDays.max} working days once it
            leaves.
          </p>
        </section>

        <p className="mt-4 font-[family-name:var(--font-spec)] text-[11.5px] leading-snug text-[var(--ink)]">
          {SHOP.illustrative}
        </p>
      </aside>
    </form>
  );
}
