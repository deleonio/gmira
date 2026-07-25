const BILL = "font-[family-name:var(--font-bill)]";
const SPEC = "font-[family-name:var(--font-spec)]";

/* Loading is a design surface here, not a spinner. The bill frame is already
   correct, so what arrives is the names, and the shape of the page never jumps. */
export default function BoutLoading() {
  return (
    <main className="mx-auto max-w-[1240px] px-5 pt-8 md:px-9">
      <p className={`${SPEC} text-[11.5px] uppercase tracking-[0.13em] text-[var(--ink-2)]`}>
        Halbe Sekunde / loading the bout
      </p>
      <span aria-hidden className="mt-5 block h-[6px] w-full bg-[var(--ink)]" />
      <p
        role="status"
        className={`${BILL} mt-6 text-center text-[clamp(1.9rem,5.4vw,3.5rem)] uppercase leading-[0.88] text-[var(--ink-2)]`}
      >
        Fetching the card
      </p>
      <div aria-hidden className="mt-8">
        {[92, 74, 84, 60].map((w, i) => (
          <div key={w} className="border-t border-[var(--rule)] py-4">
            <span
              className="block h-3 bg-[var(--stock-2)]"
              style={{ width: `${w}%`, marginLeft: i % 2 ? "0" : "0" }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
