"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserCircle, Lock, Mail, Github, Twitter } from "lucide-react";

export default function Component() {
  const [showMFA, setShowMFA] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-100 md:flex-row">
      {/* Left Column */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-50" />
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
            Empowering gender equality through advanced event management and
            demographic analysis
          </p>

          <Button
            as={Link}
            href="/signup"
            variant="outline"
            className="w-full max-w-xs bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            Signup
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-900 to-transparent" />
      </motion.div>

      {/* Right Column */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
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
              <UserCircle size={48} className="text-blue-400" />
            </motion.div>
            <h2 className="mt-4 text-3xl font-extrabold">Welcome Back</h2>
            <p className="mt-2 text-gray-400">
              Access your GAD Nexus dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="email" className="sr-only">
                  Email or Username
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Email or Username"
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  className="text-blue-500 focus:ring-blue-500"
                />
                <Label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-300"
                >
                  Stay connected
                </Label>
              </div>
              <Link
                href="#"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => setShowMFA(true)}
            >
              Sign In
            </Button>
          </form>
          {showMFA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold">Security Verification</h3>
              <Input
                type="text"
                placeholder="Enter 2FA code"
                className="bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors">
                Verify
              </Button>
            </motion.div>
          )}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
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
    </div>
  );
}
