"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const quotes = [
  "Empowering communities through data-driven gender equality initiatives.",
  "Bridging the gap between gender statistics and actionable insights.",
  "Transforming event management with a focus on inclusive participation.",
  "Unleashing the power of demographic analysis for social change.",
  "Fostering gender-responsive decision-making in development programs.",
];

const triviaItems = [
  "Did you know? Gender-disaggregated data is crucial for addressing inequalities in development projects.",
  "Fact: Effective event management can significantly increase women's participation in development initiatives.",
  "Insight: Demographic analysis helps identify underrepresented groups in GAD programs.",
  "Tip: Integrating gender perspectives in all stages of event planning leads to more inclusive outcomes.",
  "Statistic: Web-based GAD systems can improve data accuracy by up to 40% compared to traditional methods.",
];

export default function LandingPage() {
  const router = useRouter();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const generateQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const isQuote = Math.random() > 0.5;
      setQuote(isQuote ? quotes[randomIndex] : triviaItems[randomIndex]);
    };

    generateQuote();
    // Change quote every 10 seconds
    const interval = setInterval(generateQuote, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-gray-100 p-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-50" />
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: "0% 0%" }}
          animate={{ backgroundPosition: "100% 100%" }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 20 }}
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          GAD Nexus
        </h1>
        <motion.p
          key={quote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl max-w-2xl mx-auto px-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm"
        >
          {quote}
        </motion.p>
        <Button
          size="lg"
          onClick={() => router.push("/signup")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 group"
        >
          Start Your Journey
          <ArrowRight className="ml-2 inline-block transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-4 left-4 text-sm text-gray-400 flex items-center"
      >
        <Sparkles className="mr-2" size={16} />
        Web-Based Gender and Development (GAD) Information System
      </motion.div>

      {/* Floating elements */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-blue-500 opacity-20"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
}
