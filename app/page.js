"use client";

import { SiteHeader, SiteFooter } from "./components/Shared";
import { Hero, BusinessObjectives, SelectedCases } from "./components/Sections1";
import {
  CircularJourney,
  FortyYearsValue,
  Capabilities,
  Delivery,
  Certifications,
} from "./components/Sections2";
import {
  AwardsRecognition,
  TrustClients,
  WorkWith,
  BeyondEvent,
  FinalCTA,
  Contact,
} from "./components/Sections3";

export default function Home() {
  return (
    <div id="site-scroll">
      <SiteHeader />
      <main>
        <Hero />
        <BusinessObjectives />
        <TrustClients />
        <SelectedCases />
        <CircularJourney />
        <FortyYearsValue />
        <Capabilities />
        <Delivery />
        <Certifications />
        <AwardsRecognition />
        <WorkWith />
        <BeyondEvent />
        <FinalCTA />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
