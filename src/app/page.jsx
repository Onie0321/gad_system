"use client";

import { useState, useEffect, useRef } from "react";
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
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export default function ScrollableLandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const sectionRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("all");
  const [searchOrder, setSearchOrder] = useState("newest");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log(
      "Searching for:",
      searchQuery,
      searchOption,
      searchOrder,
      searchCategory
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      Object.entries(sectionRefs.current).forEach(([key, ref]) => {
        if (
          ref &&
          ref.offsetTop <= scrollPosition &&
          ref.offsetTop + ref.offsetHeight > scrollPosition
        ) {
          setActiveSection(key);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(
        (prevIndex) => (prevIndex + 1) % gradientColors.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const gradientColors = [
    "from-purple-400 via-pink-500 to-red-500",
    "from-blue-400 via-green-500 to-yellow-500",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-red-400 via-yellow-500 to-green-500",
  ];

  const currentGradient = gradientColors[currentColorIndex];

  const scrollToSection = (sectionId) => {
    const section = sectionRefs.current[sectionId];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-r ${currentGradient} transition-colors duration-1000`}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-10 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo/gad.png" alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-white drop-shadow-md">
              Gender and Development
            </span>
          </Link>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white bg-opacity-20 text-white-100 border-2 border-blue focus:border-purple-500 rounded-full pl-12 py-2  transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
          </form>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="fixed top-24 left-0 right-0 bg-black bg-opacity-80 text-white p-4 z-40"
              >
                <div className="container mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                  <p className="mb-6">Total: 0 results found.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Search for:
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="searchType"
                              className="mr-2"
                              defaultChecked
                            />
                            All words
                          </label>
                        </li>
                        <li>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="searchType"
                              className="mr-2"
                            />
                            Any words
                          </label>
                        </li>
                        <li>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="searchType"
                              className="mr-2"
                            />
                            Exact Phrase
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ordering:</h3>
                      <ul className="space-y-2">
                        <li>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="ordering"
                              className="mr-2"
                              defaultChecked
                            />
                            Newest First
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Search Only In:
                      </h3>
                      <ul className="space-y-2">
                        {[
                          "Comments",
                          "Categories",
                          "Contacts",
                          "Articles",
                          "News Feeds",
                          "Web Links",
                          "Tags",
                        ].map((category) => (
                          <li key={category}>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              {category}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <nav className="hidden md:flex space-x-4">
            {["Home", "About", "Archive", "Services", "News", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-white hover:text-purple-200 transition duration-300 drop-shadow ${
                    activeSection === item.toLowerCase()
                      ? "border-b-2 border-white"
                      : ""
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </nav>
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white bg-opacity-10 backdrop-blur-md"
            >
              {["Home", "About", "Archive", "Services", "News", "Contact"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full py-2 px-4 text-white hover:bg-white hover:bg-opacity-20 transition duration-300"
                  >
                    {item}
                  </button>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section
          id="home"
          ref={(el) => (sectionRefs.current.home = el)}
          className="min-h-screen flex items-center justify-between px-4 py-12 relative"
        >
          <div className="max-w-2xl">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Empowering Equality, Fostering Development
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl mb-8 text-white drop-shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Promoting gender equality and inclusive development for a better
              world
            </motion.p>
          </div>
          <motion.div
            className="hidden md:block"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <img
              src="/image/human.png"
              alt="Team collaboration illustration"
              width={600}
              height={600}
              className="object-contain"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="outline"
              onClick={() => router.push("/signin")}
              className="bg-white text-purple-600 hover:bg-purple-100 transition duration-300 px-8 py-3 text-lg"
            >
              Start
            </Button>
          </motion.div>
          <Button
            variant="ghost"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
            onClick={() => scrollToSection("about")}
          >
            <ChevronDown size={24} />
          </Button>
        </section>

        {/* About Section */}
        <section
          id="about"
          ref={(el) => (sectionRefs.current.about = el)}
          className="min-h-screen flex items-center py-20 bg-gradient-to-r from-purple-500 to-pink-500"
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

        {/* Archive Section */}
        <section
          id="archive"
          ref={(el) => (sectionRefs.current.archive = el)}
          className="min-h-screen flex items-center py-20 bg-gradient-to-r from-green-500 to-teal-500"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Archive
            </motion.h2>
            <Tabs defaultValue="guidelines" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white bg-opacity-20 rounded-t-lg overflow-hidden">
                <TabsTrigger
                  value="guidelines"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600"
                >
                  Guidelines
                </TabsTrigger>
                <TabsTrigger
                  value="competitions"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600"
                >
                  Competitions
                </TabsTrigger>
                <TabsTrigger
                  value="materials"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600"
                >
                  Other Materials
                </TabsTrigger>
              </TabsList>
              <TabsContent value="guidelines" className="mt-4">
                <Card className="bg-white bg-opacity-10 backdrop-blur-md overflow-hidden">
                  <div className="p-1 bg-gradient-to-r from-yellow-300 via-red-300 to-pink-300">
                    <CardContent className="p-6 bg-green-500 bg-opacity-90">
                      <h3 className="text-xl font-semibold mb-4 text-white">
                        Harmonized Gender and Development Guidelines
                      </h3>
                      <p className="text-white mb-4">
                        The HGDG is a tool to integrate gender concerns in
                        development programs and projects.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-white border-white hover:bg-white hover:text-green-600"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View HGDG
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Harmonized Gender and Development Guidelines
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <iframe
                              src="/placeholder.pdf"
                              className="w-full h-[70vh]"
                              title="HGDG Document"
                            ></iframe>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="competitions" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Essay Writing Contest 2023",
                      description:
                        "Winning piece on gender equality in education",
                    },
                    {
                      title: "Photo Contest 2022",
                      description: "Capturing moments of empowerment",
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-white bg-opacity-10 backdrop-blur-md overflow-hidden"
                    >
                      <div className="p-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                        <CardContent className="p-6 bg-green-500 bg-opacity-90">
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            {item.title}
                          </h3>
                          <p className="text-white mb-4">{item.description}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-white border-white hover:bg-white hover:text-green-600"
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Entry
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{item.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <iframe
                                  src="/placeholder.pdf"
                                  className="w-full h-[70vh]"
                                  title={item.title}
                                ></iframe>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="materials" className="mt-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Gender Mainstreaming Toolkit",
                      description: "A comprehensive guide for organizations",
                    },
                    {
                      title: "Annual Report 2023",
                      description: "Our impact and achievements",
                    },
                    {
                      title: "Policy Brief: Women in STEM",
                      description:
                        "Addressing gender gaps in science and technology",
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-white bg-opacity-10 backdrop-blur-md overflow-hidden"
                    >
                      <div className="p-1 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300">
                        <CardContent className="p-6 bg-green-500 bg-opacity-90">
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            {item.title}
                          </h3>
                          <p className="text-white mb-4">{item.description}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-white border-white hover:bg-white hover:text-green-600"
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Document
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{item.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <iframe
                                  src="/placeholder.pdf"
                                  className="w-full h-[70vh]"
                                  title={item.title}
                                ></iframe>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          ref={(el) => (sectionRefs.current.services = el)}
          className="min-h-screen flex items-center py-20 bg-gradient-to-r from-indigo-500 to-purple-500"
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
          ref={(el) => (sectionRefs.current.news = el)}
          className="min-h-screen flex items-center py-20 bg-gradient-to-r from-pink-500 to-red-500"
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
          ref={(el) => (sectionRefs.current.contact = el)}
          className="min-h-screen flex items-center py-20 bg-gradient-to-r from-yellow-500 to-orange-500"
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
                    <Mail className="mr-2" />
                    gad@ascot.edu.ph
                  </p>
                  <p className="flex items-center">
                    <Phone className="mr-2" /> +1 (555) 123-4567
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2" /> Brgy. Zabali, Baler, Aurora
                  </p>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    {[
                      {
                        Icon: Facebook,
                        href: "https://web.facebook.com/ascotgad",
                      },
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
                { Icon: Facebook, href: "https://web.facebook.com/ascotgad" },
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
