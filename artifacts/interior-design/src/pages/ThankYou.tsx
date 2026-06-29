import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <nav className="w-full px-8 py-6">
        <Link href="/">
          <div className="text-2xl font-serif text-foreground tracking-widest uppercase cursor-pointer">Lumière</div>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto pb-20">
        <div className="w-24 h-24 mb-10 border border-primary rounded-full flex items-center justify-center text-primary">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Your vision is in our hands.</h1>
        
        <p className="text-muted-foreground font-light text-lg leading-relaxed mb-12">
          Thank you for sharing your project details with us. Our design directors are reviewing your submission and will be in touch shortly to schedule your initial consultation.
        </p>

        <Link href="/">
          <Button variant="outline" className="rounded-none px-8 py-6 uppercase tracking-widest text-xs border-primary text-primary hover:bg-primary hover:text-white transition-all">
            Return to Showroom
          </Button>
        </Link>
      </main>
    </div>
  );
}
