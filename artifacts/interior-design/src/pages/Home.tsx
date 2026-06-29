import React from "react";
import { Link } from "wouter";
import { useGetLeadStats } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const STYLES = [
  { id: "modern", label: "Modern", img: "/images/style-modern.png" },
  { id: "contemporary", label: "Contemporary", img: "/images/style-contemporary.png" },
  { id: "traditional", label: "Traditional", img: "/images/style-traditional.png" },
  { id: "scandinavian", label: "Scandinavian", img: "/images/style-scandinavian.png" },
  { id: "industrial", label: "Industrial", img: "/images/style-industrial.png" },
  { id: "bohemian", label: "Bohemian", img: "/images/style-bohemian.png" },
  { id: "minimalist", label: "Minimalist", img: "/images/style-minimalist.png" },
  { id: "mid_century", label: "Mid-Century", img: "/images/style-mid-century.png" },
];

export default function Home() {
  const { data: stats } = useGetLeadStats();

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="w-full absolute top-0 left-0 z-50 px-8 py-6 flex items-center justify-between">
        <div className="text-2xl font-serif text-white tracking-widest uppercase">Lumière</div>
        <Link href="/survey">
          <Button variant="outline" className="text-white border-white/30 bg-transparent hover:bg-white/10 rounded-none uppercase tracking-widest text-xs px-6 py-5">
            Begin Your Journey
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src="/images/hero.png"
            alt="Warm luxurious living room"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight"
          >
            Design with <br /> <span className="italic font-light">Intention.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="text-white/80 text-lg md:text-xl font-sans max-w-xl mx-auto mb-10 font-light tracking-wide"
          >
            A quiet luxury interior studio for discerning homeowners who want their space transformed with artistry and soul.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          >
            <Link href="/survey">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 px-8 text-sm uppercase tracking-widest transition-all duration-300">
                Consult with us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h2 className="text-4xl md:text-5xl text-foreground leading-tight">
            We believe your home should be a reflection of your <span className="italic text-primary">deepest self.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Every material chosen, every shadow cast, and every light placed is done with profound consideration. Lumière Interiors crafts spaces that breathe — environments that are unhurried, tactile, and inherently calming.
          </p>
          <div className="w-24 h-[1px] bg-primary/30" />
        </div>
        <div className="flex-1 w-full aspect-[4/5] bg-muted relative">
          <img src="/images/style-minimalist.png" alt="Detail interior" className="w-full h-full object-cover absolute inset-0" />
        </div>
      </section>

      {/* Stats Section */}
      {stats && stats.totalLeads > 0 && (
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
            <h3 className="text-2xl font-serif mb-12 opacity-80">Our Legacy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-serif mb-2">{stats.totalLeads * 10}+</span>
                <span className="text-sm uppercase tracking-widest opacity-70">Projects Consulted</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-serif mb-2">15</span>
                <span className="text-sm uppercase tracking-widest opacity-70">Design Awards</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-serif mb-2">100%</span>
                <span className="text-sm uppercase tracking-widest opacity-70">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Styles Gallery */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl text-foreground mb-4">Curated Aesthetics</h2>
              <p className="text-muted-foreground font-light max-w-xl text-lg">Explore our foundational design languages. Each style can be tailored to your precise architectural context.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STYLES.map((style) => (
              <div key={style.id} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden mb-4 bg-muted relative">
                  <img 
                    src={style.img} 
                    alt={style.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-serif tracking-wide">{style.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl text-foreground text-center mb-24">The Lumière Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[1px] bg-border z-0" />
          
          {[
            { step: "01", title: "Discovery", desc: "We begin by understanding your rituals, routines, and the emotional resonance you desire from your space." },
            { step: "02", title: "Concept", desc: "Our artisans craft a comprehensive design narrative, presenting tactile palettes, layouts, and lighting plans." },
            { step: "03", title: "Realization", desc: "Seamless execution handled entirely by our team, culminating in a beautifully styled, turn-key reveal." }
          ].map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border border-primary text-primary flex items-center justify-center text-2xl font-serif mb-8">
                {s.step}
              </div>
              <h3 className="text-2xl font-serif mb-4">{s.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 relative flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img src="/images/style-contemporary.png" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/80" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-8">
          <h2 className="text-4xl md:text-6xl font-serif text-white">Ready to elevate your everyday?</h2>
          <p className="text-white/70 font-light text-xl max-w-xl mx-auto">
            Share your vision with us through our bespoke inquiry process, and let us begin the dialogue.
          </p>
          <div className="pt-8">
            <Link href="/survey">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none h-14 px-10 text-sm uppercase tracking-widest transition-all duration-300">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 text-center text-muted-foreground font-light text-sm">
        <div className="text-2xl font-serif text-foreground tracking-widest uppercase mb-4">Lumière</div>
        <p>© {new Date().getFullYear()} Lumière Interiors. All rights reserved.</p>
      </footer>
    </div>
  );
}
