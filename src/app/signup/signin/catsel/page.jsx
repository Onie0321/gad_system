"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Briefcase, GraduationCap } from "lucide-react";

const categories = {
  "Non-Academic": ["GAD Office", "Registrar", "Human Resources", "Finance"],
  Academic: [
    "School of Information Technology (SOIT)",
    "School of Engineering (SOE)",
    "School of Business",
    "School of Arts and Sciences",
  ],
};

export default function CategorySelectionPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">
          Select Your Category
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(categories).map(([category, subcategories]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 space-y-4"
            >
              <h2 className="text-2xl font-semibold flex items-center">
                {category === "Non-Academic" ? (
                  <Briefcase className="mr-2" />
                ) : (
                  <GraduationCap className="mr-2" />
                )}
                {category}
              </h2>
              <ul className="space-y-2">
                {subcategories.map((subcategory) => (
                  <li key={subcategory}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-left hover:bg-gray-700"
                      onClick={() => setSelectedCategory(subcategory)}
                    >
                      {subcategory}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="text-xl mb-4">
              You selected:{" "}
              <span className="font-bold">{selectedCategory}</span>
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Continue to Dashboard
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
