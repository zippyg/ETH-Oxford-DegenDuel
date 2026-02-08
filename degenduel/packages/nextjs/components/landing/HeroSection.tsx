"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
  const handleLaunchApp = () => {
    document.getElementById("arena")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#0A0A0B",
        backgroundImage: "radial-gradient(rgba(230, 32, 88, 0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="container mx-auto px-6 text-center z-10">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-mono font-bold mb-6"
          style={{
            background: "linear-gradient(135deg, #E62058, #F59E0B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          PREDICT. DUEL. WIN.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl mb-4 max-w-3xl mx-auto"
          style={{ color: "#888888" }}
        >
          PvP prediction duels settled by Flare&apos;s native protocols. No oracles. No trust. Just data.
        </motion.p>

        {/* Small Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "#E62058" }}
          />
          <span className="text-xs font-mono" style={{ color: "#E62058" }}>
            Built at ETH Oxford 2026
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button
            onClick={handleLaunchApp}
            className="px-8 py-4 rounded-lg font-mono uppercase tracking-wider font-bold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(230,32,88,0.4)]"
            style={{ backgroundColor: "#E62058" }}
          >
            Launch App
          </button>
          <a
            href="https://youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg font-mono uppercase tracking-wider font-bold border transition-all duration-300"
            style={{
              borderColor: "rgba(230, 32, 88, 0.5)",
              color: "#E62058",
            }}
          >
            <span className="mr-2">▶</span>Watch Demo
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 1.0 },
            y: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          style={{ color: "#E62058" }}
        >
          <div className="text-3xl">▼</div>
        </motion.div>
      </div>
    </section>
  );
};
