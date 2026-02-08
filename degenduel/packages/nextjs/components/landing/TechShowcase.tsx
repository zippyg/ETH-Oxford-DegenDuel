"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const technologies = [
  {
    logo: "/logos/flare.svg",
    title: "FTSO v2",
    description:
      "Decentralized price feeds from 100+ validators. Free to read. Updates every block.",
    accentColor: "#E62058",
  },
  {
    logo: "/logos/flare.svg",
    title: "FDC Web2Json",
    description:
      "Any API becomes an oracle. Validators fetch, verify, and produce Merkle proofs.",
    accentColor: "#6C93EC",
  },
  {
    logo: "/logos/flare.svg",
    title: "Secure RNG",
    description:
      "Verifiable on-chain randomness. Powers the 10% bonus multiplier.",
    accentColor: "#10B981",
  },
  {
    logo: "/logos/effect-ts.png",
    title: "Effect-TS",
    description:
      "12 effect types in production. Type-safe functional programming for the entire backend.",
    accentColor: "#4F46E5",
  },
  {
    logo: "/logos/flock.png",
    title: "FLock AI",
    description:
      "Decentralized AI strategy hints. Powered by qwen3-30b on FLock's network.",
    accentColor: "#6C93EC",
  },
  {
    logo: "/logos/eth-oxford.svg",
    title: "ETH Oxford 2026",
    description:
      "Built in 24 hours at Europe's premier Ethereum hackathon.",
    accentColor: "#F59E0B",
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
              whileHover={{ scale: 1.03, y: -4 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-xl p-6 border hover:shadow-[0_0_20px_rgba(230,32,88,0.15)] transition-shadow duration-300"
              style={{
                backgroundColor: "rgba(10, 10, 11, 0.8)",
                borderColor: "rgba(230, 32, 88, 0.08)",
              }}
            >
              {/* Logo */}
              <div
                className="mb-4 h-12 w-12 relative rounded-lg overflow-hidden"
                style={{ backgroundColor: `${tech.accentColor}15` }}
              >
                <Image
                  src={tech.logo}
                  alt={tech.title}
                  fill
                  className="object-contain p-2"
                />
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
