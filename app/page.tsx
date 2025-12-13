"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Cat, Dna, Sparkles, Star, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container relative z-10 px-4"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 rotate-3">
            <Cat className="h-10 w-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-6 w-fit rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <span className="mr-2">🏆</span> Award Winning Design
          </motion.div>

          <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-black tracking-tight text-foreground sm:text-7xl md:text-8xl">
            The Ultimate <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Cat Experience</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground md:text-2xl">
            Browse cat breeds, manage adoptions, and explore interesting facts in an intuitive and modern platform.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              <Link href="/breeds">
                Explore Breeds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-8 text-lg transition-transform hover:scale-105">
              <Link href="/hybrid">
                Create Hybrid
                <Dna className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Floating Elements Background */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] top-[20%] text-6xl opacity-20"
          >🐱</motion.div>
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[15%] top-[15%] text-7xl opacity-20"
          >🧶</motion.div>
          <motion.div
            animate={{ y: [0, -40, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[20%] bottom-[20%] text-5xl opacity-20"
          >🐾</motion.div>
        </div>
      </section>


      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why CatFacts?</h2>
            <p className="text-lg text-muted-foreground">Everything you need to satisfy your feline curiosity.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Extensive Breed Library",
                desc: "Detailed information on over 90 cat breeds from around the world.",
                image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
                link: "/breeds"
              },
              {
                title: "Hybrid Generator",
                desc: "Use our advanced algorithm to predict traits of cross-breeding.",
                image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=800&auto=format&fit=crop",
                link: "/hybrid"
              },
              {
                title: "Interactive Playground",
                desc: "Remix and share cat facts in fun and creative ways.",
                image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=800&auto=format&fit=crop",
                link: "/playground"
              }
            ].map((feature, i) => (
              <Link key={i} href={feature.link} className="group block h-full">
                <Card className="h-full overflow-hidden border-border bg-card text-card-foreground shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl hover:ring-2 hover:ring-primary/20">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/5" />
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="mb-3 text-xl font-bold text-card-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
