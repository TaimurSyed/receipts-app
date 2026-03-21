export function Waitlist() {
  return (
    <section id="waitlist" className="border-t border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Launch angle</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Here’s what your behavior says, not what your intentions say.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Start with a waitlist and a sharp landing page. If people say “this feels uncomfortably accurate,” you’ve got something worth building all the way.
        </p>

        <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="min-h-12 flex-1 rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none ring-0 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            className="min-h-12 rounded-full bg-amber-300 px-6 font-semibold text-black transition hover:bg-amber-200"
          >
            Join the waitlist
          </button>
        </form>
      </div>
    </section>
  );
}
