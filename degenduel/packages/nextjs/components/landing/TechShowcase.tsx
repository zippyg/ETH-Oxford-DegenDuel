"use client";

import { motion } from "framer-motion";

const technologies = [
  {
    icon: { bg: "#E62058", text: "F", textColor: "#FFFFFF" },
    title: "FTSO v2",
    description:
      "Decentralized price feeds from 100+ validators. Free to read. Updates every block.",
  },
  {
    icon: { bg: "#6C93EC", text: "D", textColor: "#FFFFFF" },
    title: "FDC Web2Json",
    description:
      "Any API becomes an oracle. Validators fetch, verify, and produce Merkle proofs.",
  },
  {
    icon: { bg: "#10B981", text: "R", textColor: "#FFFFFF" },
    title: "Secure RNG",
    description:
      "Verifiable on-chain randomness. Powers the 10% bonus multiplier.",
  },
  {
    icon: { bg: "#4F46E5", text: "E", textColor: "#FFFFFF" },
    title: "Effect-TS",
    description:
      "12 effect types in production. Type-safe functional programming for the entire backend.",
  },
  {
    icon: { bg: "#6C93EC", text: "✦", textColor: "#FFFFFF" },
    title: "FLock AI",
    description:
      "Decentralized AI strategy hints. Powered by qwen3-30b on FLock's network.",
  },
  {
    icon: { bg: "#F59E0B", text: "Ξ", textColor: "#000000" },
    title: "ETH Oxford 2026",
    description:
      "Built in 24 hours at Europe's premier Ethereum hackathon.",
  },
];

export const TechShowcase = () => {
  return (
    <section
      id="technology"
      className="py-24 px-6"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="container mx-auto">
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-mono font-bold text-center mb-16"
          style={{ color: "#E8E8E8" }}
        >
          POWERED BY
        </h2>

        {/* Technology Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(10, 10, 11, 0.8)",
                borderColor: "rgba(230, 32, 88, 0.08)",
              }}
            >
              {/* Icon */}
              <div className="mb-4 h-10 flex items-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: tech.icon.bg,
                    color: tech.icon.textColor,
                  }}
                >
                  {tech.icon.text}
                </div>
              </div>

              {/* Title */}
              <h3
                className="font-mono font-bold mb-2 text-base"
                style={{ color: "#E8E8E8" }}
              >
                {tech.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: "#888888" }}>
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Watch Demo Button */}
        <div className="text-center">
          <a
            href="https://youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-lg font-mono uppercase tracking-wider font-bold border transition-all duration-300"
            style={{
              borderColor: "rgba(230, 32, 88, 0.5)",
              color: "#E62058",
            }}
          >
            <span className="mr-2">▶</span>Watch the Demo
          </a>
        </div>
      </div>
    </section>
  );
};
