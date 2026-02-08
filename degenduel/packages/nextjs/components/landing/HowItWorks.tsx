"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "CREATE",
    description:
      "Choose an asset. Predict UP or DOWN from the current FTSO price. Stake your FLR.",
  },
  {
    number: "02",
    title: "MATCH",
    description:
      "An opponent takes the opposite side with matching stake. The duel is now live.",
  },
  {
    number: "03",
    title: "SETTLE",
    description:
      "After the deadline, Flare\u2019s FTSO v2 reads the price on-chain. Winner takes the pot.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6"
      style={{ backgroundColor: "#050506" }}
    >
      <div className="container mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-mono font-bold mb-3"
            style={{ color: "#E8E8E8" }}
          >
            HOW IT WORKS
          </h2>
          <p className="text-sm font-mono" style={{ color: "#888888" }}>
            Three steps. No middlemen. Pure PvP.
          </p>
        </motion.div>

        {/* Step Cards with Connectors */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative"
        >
          {/* Connecting lines (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[33.3%] w-[33.4%] h-px -translate-y-1/2 z-0">
            <div className="w-full h-px" style={{ background: "linear-gradient(to right, rgba(230, 32, 88, 0.3), rgba(230, 32, 88, 0.1))" }} />
          </div>
          <div className="hidden md:block absolute top-1/2 right-0 w-[33.4%] h-px -translate-y-1/2 z-0" style={{ left: "33.3%" }}>
            {/* Already covered by the first line spanning middle third */}
          </div>

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-xl p-8 border relative z-10 cursor-default transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(230,32,88,0.12)]"
              style={{
                backgroundColor: "rgba(10, 10, 11, 0.9)",
                borderColor: "rgba(230, 32, 88, 0.1)",
              }}
            >
              {/* Step Number */}
              <div
                className="text-6xl font-mono font-bold mb-4"
                style={{
                  color: "rgba(230, 32, 88, 0.15)",
                  textShadow: "0 0 40px rgba(230, 32, 88, 0.1)",
                }}
              >
                {step.number}
              </div>

              {/* Step Title */}
              <h3
                className="text-xl font-mono font-bold mb-3"
                style={{ color: "#E8E8E8" }}
              >
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-base leading-relaxed" style={{ color: "#888888" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bonus Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p
            className="font-mono text-sm"
            style={{ color: "rgba(230, 32, 88, 0.6)" }}
          >
            {`// no backend. no middleman. just smart contracts.`}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
