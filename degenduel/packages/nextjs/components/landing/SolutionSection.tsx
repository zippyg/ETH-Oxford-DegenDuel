"use client";

import { motion } from "framer-motion";

const solutions = [
  {
    title: "100+ Validators",
    description: "Flare's FTSO v2 aggregates price data from 100+ independent validators. No single point of failure.",
    icon: "✓",
  },
  {
    title: "On-Chain Settlement",
    description: "Every duel settles with verifiable smart contract logic. Read the code. Verify the proof. Trust the math.",
    icon: "✓",
  },
  {
    title: "Real Stakes",
    description: "Put your FLR where your mouth is. 1v1 duels with real crypto. Winner takes the pot.",
    icon: "✓",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export function SolutionSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#0A0A0B" }}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-mono text-4xl md:text-5xl font-bold mb-6"
            style={{
              background: "linear-gradient(135deg, #E62058 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            THE SOLUTION
          </h2>
          <p className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#E8E8E8" }}>
            DegenDuel: Trustless PvP Predictions on Flare
          </p>
          <p className="text-lg md:text-xl" style={{ color: "#888888" }}>
            Every problem has an answer. Here&apos;s ours.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-lg border backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(10, 10, 11, 0.9)",
                borderColor: "rgba(16, 185, 129, 0.15)",
              }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                <span className="text-4xl font-bold" style={{ color: "#10B981" }}>
                  {solution.icon}
                </span>
              </div>
              <h3 className="font-mono text-xl font-bold mb-4 text-center" style={{ color: "#E8E8E8" }}>
                {solution.title}
              </h3>
              <p className="text-center leading-relaxed" style={{ color: "#888888" }}>
                {solution.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
