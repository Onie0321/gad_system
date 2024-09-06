"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Github, Twitter } from "lucide-react";

export default function Component() {
  const [agreed, setAgreed] = useState(false);
  const [checkboxEnabled, setCheckboxEnabled] = useState(false);

  useEffect(() => {
    // Check if the terms and conditions have been accepted
    const termsAccepted = localStorage.getItem("termsAccepted");
    if (termsAccepted === "true") {
      setAgreed(true);
      setCheckboxEnabled(true); // Enable checkbox if terms are accepted
    } else {
      setAgreed(false);
      setCheckboxEnabled(false); // Disable checkbox if terms are not accepted
    }
  }, []);

  const handleCheckboxChange = (checked) => {
    setAgreed(checked);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-100 md:flex-row">
      {/* Left Column (Sign Up Form) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col items-center justify-center bg-gray-800 p-8"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block rounded-full p-2 bg-gray-700"
            >
              <UserPlus size={48} className="text-blue-400" />
            </motion.div>
            <h2 className="mt-4 text-3xl font-extrabold">Join GAD Nexus</h2>
            <p className="mt-2 text-gray-400">
              Create your account and start making a difference
            </p>
          </div>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="name" className="sr-only">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="pl-10 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <div className="relative">
                <Label htmlFor="email" className="sr-only">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="pl-10 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="pl-10 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <div className="relative">
                <Label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="pl-10 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="agree-terms"
                checked={agreed}
                onCheckedChange={handleCheckboxChange}
                disabled={!checkboxEnabled}
                className="text-blue-500 focus:ring-blue-500"
              />
              <Label
                htmlFor="agree-terms"
                className="ml-2 text-sm text-gray-300"
              >
                I agree to the{" "}
                <Link
                  href="/signup/termsandconditions"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Terms and Conditions
                </Link>
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={!agreed}
            >
              Create Account
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <Github className="mr-2" size={18} />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <Twitter className="mr-2" size={18} />
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column (Branding) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-600 to-purple-700 opacity-50" />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mb-8 text-5xl font-bold tracking-tight"
          >
            GAD Nexus
          </motion.div>
          <p className="mb-8 text-xl font-light leading-relaxed max-w-md">
            Join our community of change-makers and contribute to a more
            equitable world through data-driven insights
          </p>
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/signup/signin"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />
      </motion.div>
    </div>
  );
}
