"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Facebook,
  Twitter,
  AlertTriangle,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { account, ID } from "@/app/appwrite";

export default function EnhancedSignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [quote, setQuote] = useState(
    "Empowering communities through data-driven gender equality initiatives."
  );

  useEffect(() => {
    // Simulating quote change every 10 seconds
    const interval = setInterval(() => {
      setQuote(
        "Bridging the gap between gender statistics and actionable insights."
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (validateEmail(email) && password) {
      try {
        await account.createEmailSession(email, password);
        // Redirect to dashboard or handle successful login
      } catch (error) {
        console.error("Login failed:", error);
        // Handle login error
      }
    }
  };

  const handleCaptchaVerification = (value) => {
    if (value) {
      setShowCaptchaModal(false);
      setShowSecurityModal(true);
    }
  };

  const handleSecurityVerification = () => {
    // Implement security verification logic here
    setShowSecurityModal(false);
    // Proceed with sign-in
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Left Column */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-50" />
        <div className="relative z-10 text-center w-full max-w-md">
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
          <motion.div
            className="mb-8 text-xl font-light leading-relaxed bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-blur-sm relative"
            style={{
              width: "300px",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <div className="absolute inset-0 bg-blue-500 opacity-20 blur-md" />
            <div className="relative z-10">{quote}</div>
          </motion.div>
          <Button
            variant="outline"
            onClick={() => router.push("/signup/signin")}
            className="w-full max-w-xs bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            Signup
          </Button>
        </div>
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
          <form onSubmit={handleSignIn} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-10 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
              <div className="relative">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  checked={rememberDevice}
                  onCheckedChange={setRememberDevice}
                />
                <Label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-300"
                >
                  Remember this device
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
            >
              Sign In
            </Button>
          </form>
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
                <Facebook className="mr-2 h-4 w-4 text-blue-500" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <FaDiscord className="mr-2 h-4 w-4 text-indigo-500" />
                Discord
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CAPTCHA Modal */}
      <AnimatePresence>
        {showCaptchaModal && (
          <Dialog open={showCaptchaModal} onOpenChange={setShowCaptchaModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>CAPTCHA Challenge</DialogTitle>
                <DialogDescription>
                  Please complete the CAPTCHA to verify you are human.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center my-4">
                <ReCAPTCHA
                  sitekey="your-recaptcha-site-key"
                  onChange={handleCaptchaVerification}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Security Verification Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <Dialog open={showSecurityModal} onOpenChange={setShowSecurityModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Security Verification</DialogTitle>
                <DialogDescription>
                  Please verify your identity by answering the security
                  question.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-gray-300">
                  What is the name of your first pet?
                </div>
                <Input
                  type="text"
                  placeholder="Answer"
                  className="bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSecurityVerification}
                >
                  Verify
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
