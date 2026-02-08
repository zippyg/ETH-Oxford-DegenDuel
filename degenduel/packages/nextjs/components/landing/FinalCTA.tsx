"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden"
      style={{ backgroundColor: "#050506" }}
    >
      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at center, #E62058 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2
            className="font-mono text-5xl md:text-7xl font-bold mb-6"
            style={{
              background: "linear-gradient(135deg, #E62058 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            READY TO DUEL?
          </h2>

          <p className="text-xl md:text-2xl mb-12" style={{ color: "#E8E8E8" }}>
            Join the arena. Predict. Stake. Win.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/arena"
                className="px-8 py-4 rounded-lg font-mono text-lg font-bold transition-all duration-300 inline-block relative overflow-hidden group"
                style={{ backgroundColor: "#E62058", color: "#FFFFFF" }}
              >
                {/* Pulse glow animation */}
                <span className="absolute inset-0 animate-pulse opacity-50" style={{ backgroundColor: "#E62058", filter: "blur(20px)" }} />
                <span className="relative z-10">Launch App →</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-lg font-mono text-lg font-bold border-2 transition-all duration-300 inline-block hover:bg-white hover:bg-opacity-5"
                style={{ borderColor: "#E62058", color: "#E8E8E8" }}
              >
                Watch Demo
              </a>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm font-mono"
            style={{ color: "#888888" }}
          >
            Built on Flare • Powered by FTSO v2 • ETH Oxford 2026
          </motion.p>
        </motion.div>
      </div>

      {/* Animated border glow effect */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #E62058, transparent)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </section>
  );
}
