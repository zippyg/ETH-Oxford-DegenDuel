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
      "After the deadline, Flare's FTSO v2 reads the price on-chain. Winner takes the pot.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6"
      style={{ backgroundColor: "#050506" }}
    >
      <div className="container mx-auto">
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-mono font-bold text-center mb-16"
          style={{ color: "#E8E8E8" }}
        >
          HOW IT WORKS
        </h2>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-xl p-8 border"
              style={{
                backgroundColor: "rgba(10, 10, 11, 0.8)",
                borderColor: "rgba(230, 32, 88, 0.1)",
              }}
            >
              {/* Step Number */}
              <div
                className="text-5xl font-mono font-bold mb-4"
                style={{ color: "rgba(230, 32, 88, 0.2)" }}
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
              <p className="text-base" style={{ color: "#888888" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bonus Line */}
        <div className="text-center">
          <p
            className="font-mono text-sm"
            style={{ color: "rgba(230, 32, 88, 0.6)" }}
          >
            {`// 10% chance of 2x bonus via Flare Secure RNG`}
          </p>
        </div>
      </div>
    </section>
  );
};
