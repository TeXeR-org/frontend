import { Reveal, SectionHeading } from "./_shared";
import { PricingPlans } from "./PricingPlans";

/**
 * Homepage pricing band. Supplies the framing; the cards themselves live in
 * `PricingPlans` so the /pricing page can reuse them under its own heading
 * instead of stacking a second one underneath.
 */
export function PricingSection() {
  return (
    <section id="pricing" className="py-24 @min-[40rem]:py-32">
      <div className="container">
        <Reveal>
          <SectionHeading
            title="Free to write together. Pay for the heavy lifting."
            lede="Start free and stay free if that is all you need. No seat minimums, no annual lock-in."
          />
        </Reveal>

        <PricingPlans className="mt-10" />
      </div>
    </section>
  );
}
