"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ScrollableLandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(
        (prevIndex) => (prevIndex + 1) % gradientColors.length
      );
    }, 5000); // Change color every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const gradientColors = [
    "from-purple-400 via-pink-500 to-red-500",
    "from-blue-400 via-green-500 to-yellow-500",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-red-400 via-yellow-500 to-green-500",
  ];

  const currentGradient = gradientColors[currentColorIndex];

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-r ${currentGradient} transition-colors duration-1000`}
    >
      <header
        className="sticky top-0 z-50 bg-white bg-opacity-10 backdrop-blur-md shadow-md transition-all duration-300"
        style={{ padding: `${scrollY > 50 ? "0.5rem" : "1rem"} 0` }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <span className="text-2xl font-bold text-white drop-shadow-md">
              G&D Initiative
            </span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            {["Home", "About", "Services", "News", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white hover:text-purple-200 transition duration-300 drop-shadow"
              >
                {item}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white bg-opacity-10 backdrop-blur-md"
          >
            {["Home", "About", "Services", "News", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 transition duration-300"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center text-center px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Empowering Equality, Fostering Development
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-white drop-shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Promoting gender equality and inclusive development for a better
              world
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={() => router.push("/signup")}
                className="w-1/1 bg-white text-purple-600 hover:bg-purple-100 transition duration-300"
              >
                Start
              </Button>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-20 bg-gradient-to-r from-purple-500 to-pink-500"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              About Us
            </motion.h2>
            <div className="md:flex md:space-x-8">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-white mb-4">
                  The Gender and Development Initiative is dedicated to
                  promoting gender equality and fostering inclusive development
                  worldwide. We believe in creating a world where everyone has
                  equal opportunities to thrive, regardless of their gender
                  identity.
                </p>
                <p className="text-white">
                  Our mission is to empower individuals, transform communities,
                  and influence policies to create lasting change in the realm
                  of gender equality and sustainable development.
                </p>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Our Key Objectives
                </h3>
                <ul className="space-y-2">
                  {[
                    "Promote gender equality in all aspects of life",
                    "Advocate for inclusive policies and practices",
                    "Empower marginalized communities",
                    "Foster sustainable development initiatives",
                    "Provide education and resources on gender issues",
                  ].map((objective, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center space-x-2 text-white"
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="h-2 w-2 bg-white rounded-full" />
                      <span>{objective}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="py-20 bg-gradient-to-r from-indigo-500 to-purple-500"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Services
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Education & Training",
                  description:
                    "Workshops, seminars, and courses on gender equality and development issues.",
                },
                {
                  title: "Policy Advocacy",
                  description:
                    "Working with governments and organizations to promote inclusive policies.",
                },
                {
                  title: "Community Projects",
                  description:
                    "Implementing grassroots initiatives to empower local communities.",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white bg-opacity-10 backdrop-blur-md hover:bg-opacity-20 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">
                        {service.title}
                      </h3>
                      <p className="text-white">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section
          id="news"
          className="py-20 bg-gradient-to-r from-pink-500 to-red-500"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Latest News
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "New Partnership Announced",
                  description:
                    "We've joined forces with Global Equality Now to expand our reach.",
                },
                {
                  title: "Upcoming Workshop Series",
                  description:
                    "Join our virtual workshops on gender-responsive budgeting.",
                },
                {
                  title: "Annual Report Released",
                  description:
                    "See the impact of our work over the past year in our latest report.",
                },
              ].map((news, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white bg-opacity-10 backdrop-blur-md hover:bg-opacity-20 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {news.title}
                      </h3>
                      <p className="text-white mb-4">{news.description}</p>
                      <Button
                        variant="outline"
                        className="text-white border-white hover:bg-white hover:text-purple-600"
                      >
                        Read more
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 bg-gradient-to-r from-yellow-500 to-orange-500"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Contact Us
            </motion.h2>
            <div className="md:flex md:space-x-8">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <form className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    className="bg-white bg-opacity-20 text-white placeholder-white"
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    className="bg-white bg-opacity-20 text-white placeholder-white"
                  />
                  <Textarea
                    placeholder="Your Message"
                    rows={4}
                    className="bg-white bg-opacity-20 text-white placeholder-white"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-white text-orange-600 hover:bg-orange-100"
                  >
                    Send Message
                  </Button>
                </form>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-4 text-white">
                  <p className="flex items-center">
                    <Mail className="mr-2" /> info@genderdevelopment.org
                  </p>
                  <p className="flex items-center">
                    <Phone className="mr-2" /> +1 (555) 123-4567
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2" /> 123 Equality Street, Progress
                    City, 12345
                  </p>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    {[
                      { Icon: Facebook, href: "#" },
                      { Icon: Twitter, href: "#" },
                      { Icon: Instagram, href: "#" },
                      { Icon: Youtube, href: "#" },
                    ].map(({ Icon, href }, index) => (
                      <Link
                        key={index}
                        href={href}
                        className="text-white hover:text-orange-200 transition duration-300"
                      >
                        <Icon size={24} />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-black bg-opacity-30 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} G&D Initiative. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="hover:text-purple-300 transition duration-300"
                >
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
