"use client";

import { motion } from "framer-motion";

const problems = [
  {
    title: "Centralized Oracles",
    description: "Trust a single data source? One exploit. One failure point. Your funds are gone.",
    icon: "✕",
  },
  {
    title: "Opaque Settlement",
    description: "Who decides you lost? The house? A server you can't inspect? A black box?",
    icon: "✕",
  },
  {
    title: "No Skin in the Game",
    description: "Paper trading apps. Social media tips. Everyone's a genius until real money is on the line.",
    icon: "✕",
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

export function ProblemSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#050506" }}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-4xl md:text-5xl font-bold mb-4" style={{ color: "#E62058" }}>
            THE PROBLEM
          </h2>
          <p className="text-lg md:text-xl" style={{ color: "#888888" }}>
            What&apos;s wrong with crypto predictions today?
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-lg border backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(10, 10, 11, 0.9)",
                borderColor: "rgba(239, 68, 68, 0.15)",
              }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                <span className="text-4xl font-bold" style={{ color: "#E62058" }}>
                  {problem.icon}
                </span>
              </div>
              <h3 className="font-mono text-xl font-bold mb-4 text-center" style={{ color: "#E8E8E8" }}>
                {problem.title}
              </h3>
              <p className="text-center leading-relaxed" style={{ color: "#888888" }}>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
