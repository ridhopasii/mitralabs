"use client";

import React from "react";
import Footer from "@/components/Footer";
import { Rocket, ShieldCheck, Heart } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function AboutPage() {
  const { data } = useData();
  const { about } = data;

  return (
    <>
      <main>
        {/* Hero & Story Section */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <span className="text-primary font-bold uppercase tracking-[0.2em] mb-4 block text-sm">{about.hero.tagline}</span>
                <h1 className="font-display text-5xl md:text-7xl font-extrabold text-on-surface mb-6 leading-tight">
                  {about.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-on-surface-variant mb-8 leading-relaxed">
                  {about.hero.subtitle}
                </p>
                <div className="flex gap-4">
                  {about.stats.map((stat, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col">
                        <span className="text-4xl font-bold text-primary">{stat.value}</span>
                        <span className="text-xs text-outline uppercase tracking-wider font-bold">{stat.label}</span>
                      </div>
                      {i < about.stats.length - 1 && <div className="w-px h-12 bg-outline-variant mx-4"></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="aspect-video rounded-[2rem] overflow-hidden shadow-premium border border-surface-container-highest">
                  <img
                    alt="About Image"
                    className="w-full h-full object-cover"
                    src={about.hero.image}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-2xl hidden md:block">
                  <p className="text-on-primary text-xl font-bold italic">"{about.vision}"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-10 bg-surface-container-lowest rounded-xl shadow-premium border border-surface-container-highest">
                <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-6">
                  <Rocket className="text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-4">{about.visionTitle}</h2>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {about.vision}
                </p>
              </div>
              <div className="p-10 bg-surface-container-lowest rounded-xl shadow-premium border border-surface-container-highest md:col-span-2">
                <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-4">{about.missionTitle}</h2>
                <ul className="text-on-surface-variant leading-relaxed text-base space-y-4">
                  {about.mission.map((m, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface mb-4">{about.teamTitle}</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">{about.teamSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {about.team.map((member) => (
                <div key={member.id} className="group text-center">
                  <div className="aspect-square w-56 h-56 mx-auto rounded-[3rem] overflow-hidden mb-8 shadow-premium group-hover:scale-105 transition-transform duration-500 border border-surface-container-highest">
                    <img
                      alt={member.name}
                      className="w-full h-full object-cover"
                      src={member.image}
                    />
                  </div>
                  <h3 className="text-3xl font-black text-on-surface tracking-tighter">{member.name}</h3>
                  <p className="text-sm text-primary uppercase tracking-widest mt-1 font-black">{member.role}</p>
                  <p className="text-base text-on-surface-variant mt-4 leading-relaxed px-10">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
