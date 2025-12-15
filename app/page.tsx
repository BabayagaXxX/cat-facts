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
          </div>
        </motion.div>

        {/* Floating Elements Background */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
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
    </div>
  );
}
