const services = [
  {
    title: 'Merchandising Walkthrough',
    description:
      'A 30-minute, no-cost visit focused on how customers move, what they notice first, and how your shelves guide buying decisions.',
  },
  {
    title: 'Space Utilization Audit',
    description:
      'Measure aisle widths, fixture placement, and sightlines so every square foot supports better flow and higher basket sizes.',
  },
  {
    title: 'Ready-to-Use Action Plan',
    description:
      'You receive a tailored plan with layout tweaks, merchandising moves, and a realistic shopping list for fixtures or signage.',
  },
];

const steps = [
  {
    title: 'Book your free visit',
    detail: 'Pick a time that works. We meet you onsite and listen to what is and is not working today.',
  },
  {
    title: 'On-site optimization session',
    detail: 'We walk the floor together, map traffic patterns, and highlight immediate wins you can make on the spot.',
  },
  {
    title: 'Personalized plan delivered',
    detail: 'Within 48 hours you get a plan priced between $75–$100 based on the level of detail you need.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-6 pb-16">
      <section className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-purple-600/10 p-10 shadow-2xl ring-1 ring-white/10">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200 ring-1 ring-white/20">
            Retail space consultancy
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Optivize Max helps neighborhood stores earn more from the space they already have.
          </h1>
          <p className="max-w-3xl text-lg text-gray-200">
            We specialize in convenience shops, boutiques, salons, and other small-format retailers. Get a free 30-minute
            walk-through, then choose an actionable plan tailored to your layout, budget, and merchandising goals.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-full bg-emerald-400 px-5 py-3 text-black shadow-lg shadow-emerald-400/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Schedule a free visit
            </a>
            <a
              href="#pricing"
              className="rounded-full border border-white/20 px-5 py-3 text-white transition hover:border-white/60 hover:-translate-y-0.5"
            >
              See what you get
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <p className="text-3xl font-bold text-emerald-300">30 min</p>
              <p className="text-sm text-gray-300">Complimentary on-site walkthrough focused on flow and merchandising.</p>
            </div>
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <p className="text-3xl font-bold text-emerald-300">$75–$100</p>
              <p className="text-sm text-gray-300">Flat-rate personalized plan based on your needs and store size.</p>
            </div>
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
              <p className="text-3xl font-bold text-emerald-300">48 hrs</p>
              <p className="text-sm text-gray-300">Turnaround for your customized layout and merchandising recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">What we do in every visit</h2>
          <span className="text-sm text-gray-300">Tailored for small and retail stores</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map(service => (
            <article key={service.title} className="rounded-xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
              <h3 className="mb-3 text-xl font-semibold text-white">{service.title}</h3>
              <p className="text-gray-200">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="space-y-6">
        <h2 className="text-2xl font-semibold">How your project moves forward</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl bg-black/40 p-6 ring-1 ring-white/10">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-black font-bold">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-200">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="grid gap-6 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-sky-500/20 p-8 shadow-2xl ring-1 ring-white/10 md:grid-cols-2"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Choose the depth that fits your store</h2>
          <p className="text-gray-100">
            Every engagement starts with the free 30-minute visit. From there you can opt into a detailed plan priced at $75–$100,
            based on how much guidance you want and the size of your floor. No long contracts—just clear recommendations.
          </p>
          <ul className="space-y-2 text-gray-100">
            <li>• Quick-win layout fixes you can deploy immediately</li>
            <li>• Merchandising moves to lift impulse and basket size</li>
            <li>• Fixture and signage suggestions matched to your budget</li>
            <li>• A simple timeline so your team can execute confidently</li>
          </ul>
        </div>
        <div className="rounded-xl bg-black/50 p-6 ring-1 ring-white/10">
          <div className="flex items-baseline gap-2 text-4xl font-bold text-emerald-300">
            $75<span className="text-lg text-gray-200">to</span>$100
          </div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-300">per personalized plan</p>
          <div className="space-y-3 text-gray-100">
            <p>Includes a recap of our visit, diagrams or sketches, and prioritized actions.</p>
            <p>Need help after the plan? We stay available for quick check-ins and photo reviews.</p>
          </div>
          <a
            href="#contact"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-black font-semibold shadow-lg shadow-emerald-400/30 transition hover:-translate-y-0.5"
          >
            Start with the free visit
          </a>
        </div>
      </section>

      <section id="contact" className="grid gap-6 rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Ready to see what your space can do?</h2>
          <p className="text-gray-200">
            Tell us about your store and when we can stop by. We respond within one business day to confirm the free 30-minute
            walkthrough and gather any floor plans or photos that help us prep.
          </p>
          <div className="space-y-2 text-gray-100">
            <p><span className="font-semibold">Email:</span> hello@optivizemax.com</p>
            <p><span className="font-semibold">Phone:</span> (555) 123-0199</p>
            <p><span className="font-semibold">Service area:</span> Local visits with remote plan delivery available.</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Your name</label>
            <input
              type="text"
              placeholder="Owner or manager name"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Store name</label>
            <input
              type="text"
              placeholder="Store or concept"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Email or phone</label>
            <input
              type="text"
              placeholder="How we can reach you"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">What do you want to improve?</label>
            <textarea
              placeholder="Space use, merchandising, product flow, signage, etc."
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
              rows={4}
            />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-emerald-400 px-4 py-3 text-black font-semibold shadow-lg shadow-emerald-400/30 transition hover:-translate-y-0.5"
          >
            Request my free 30-minute visit
          </button>
        </form>
      </section>
    </main>
  );
}
