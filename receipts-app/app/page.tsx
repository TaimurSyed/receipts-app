import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MvpSection } from "@/components/landing/mvp";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { Waitlist } from "@/components/landing/waitlist";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <MvpSection />
      <Waitlist />
    </main>
  );
}
