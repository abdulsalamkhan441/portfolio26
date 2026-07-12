import type { Metadata } from "next";
import LegalHeroSection from "@/components/LegalHeroSection";
import "./globals.css";
import AboutSection from "@/components/about";
import ExperienceSection from "@/components/experiance";
import StickyComponent from "@/components/projects";
import TestimonialsSection from "@/components/testmonial";
import ServicesSection from "@/components/services";
import ContactSection from "@/components/contact";
import FooterSection from "@/components/footer";
import GridLightSweep from "@/components/aurora";


export const metadata: Metadata = {
  title: "ASK Portfolio",
  description: "Crafting digital experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col relative isolation:isolate">
        <GridLightSweep gridSize={48}/>
        <LegalHeroSection />
        <AboutSection/>
        <ExperienceSection/>
        <StickyComponent/>
        <TestimonialsSection/>
        <ServicesSection/>
        <ContactSection/>
        <FooterSection/>
      </body>
    </html>
  );
}