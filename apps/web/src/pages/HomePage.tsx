import { CloudDeploymentStory } from "@/components/sections/CloudDeploymentStory";
import { PageTransition } from "@/components/common/PageTransition";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { HomeCTA } from "@/components/sections/HomeCTA";
import { Impact } from "@/components/sections/Impact";
import { JourneyPreview } from "@/components/sections/JourneyPreview";
import { FlagshipStory } from "@/components/sections/FlagshipStory";

export function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <Impact />
      <FlagshipStory />
      <FeaturedWork />
      <JourneyPreview />
      <CloudDeploymentStory />
      <HomeCTA />
    </PageTransition>
  );
}
