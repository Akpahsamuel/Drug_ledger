import { Box, Container, Flex, Heading, Text, Button, Card, Grid, Separator } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import MedicineIllustration from "../components/MedicineIllustration";
import Navbar from "../components/Navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

// Color types
type ColorScheme = {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: string;
  accent: string;
  background: {
    main: string;
    light: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  gradient: {
    primary: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
};

// Color constants
const colors: ColorScheme = {
  primary: {
    main: "#00ACC1",
    light: "#4DD0E1",
    dark: "#006064",
  },
  secondary: "#FF5722",
  accent: "#4DD0E1",
  background: {
    main: "#F8FAFC",
    light: "#FFFFFF",
    dark: "#1A202C",
  },
  text: {
    primary: "#1A202C",
    secondary: "#4A5568",
    light: "#FFFFFF",
  },
  gradient: {
    primary: "linear-gradient(135deg, #00ACC1 0%, #006064 100%)",
  },
  shadow: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.05)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.08)",
  },
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Statistics data
const stats = [
  { value: "10K+", label: "Registered Users" },
  { value: "50M+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

// Updated testimonials data
const testimonials = [
  {
    quote: "DrugLedger has revolutionized how we manage our pharmaceutical supply chain. The platform's intuitive interface and robust tracking capabilities have significantly improved our operational efficiency by 85%. The blockchain integration provides unmatched security.",
    author: "John Doe",
    role: "Supply Chain Director",
    company: "PharmaCorp International",
    avatar: "JD",
    rating: 5,
    image: "/testimonials/pharma-lab.jpg",
    metrics: {
      efficiency: "+85%",
      savings: "$2.5M",
      compliance: "100%"
    }
  },
  {
    quote: "The transparency and security provided by this platform is unmatched. We can now track every product with complete confidence and maintain compliance effortlessly. Our stakeholders have never been more satisfied with our supply chain integrity.",
    author: "Jane Smith",
    role: "Quality Control Director",
    company: "MediTech Solutions",
    avatar: "JS",
    rating: 5,
    image: "/testimonials/quality-control.jpg",
    metrics: {
      accuracy: "99.9%",
      tracking: "Real-time",
      satisfaction: "98%"
    }
  },
  {
    quote: "Regulatory compliance has never been easier to track and maintain. The automated verification system has reduced our manual workload by 70% and eliminated documentation errors. The real-time alerts have been a game-changer for our operations.",
    author: "Robert Johnson",
    role: "Compliance Officer",
    company: "Global Pharmaceuticals",
    avatar: "RJ",
    rating: 5,
    image: "/testimonials/compliance.jpg",
    metrics: {
      reduction: "-70%",
      errors: "Zero",
      coverage: "100%"
    }
  },
  {
    quote: "The blockchain integration provides an unprecedented level of security and traceability. Our stakeholders have never been more confident in our supply chain. We've seen a significant reduction in counterfeit incidents and improved patient trust.",
    author: "Sarah Chen",
    role: "Operations Director",
    company: "AsiaPharma Ltd.",
    avatar: "SC",
    rating: 5,
    image: "/testimonials/operations.jpg",
    metrics: {
      security: "100%",
      trust: "+95%",
      incidents: "-99%"
    }
  }
];

// Get Started cards data
const getStartedCards = [
  {
    title: "For Manufacturers",
    description: "Create and manage product batches with complete traceability.",
    icon: "🏭",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
    features: ["Batch Management", "Quality Control", "Supply Chain Tracking"],
    path: "/manufacturer/register",
  },
  {
    title: "For Distributors",
    description: "Track and manage pharmaceutical distribution efficiently.",
    icon: "🚚",
    color: "#2196F3",
    gradient: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
    features: ["Real-time Tracking", "Inventory Management", "Delivery Optimization"],
    path: "/distributor/register",
  },
  {
    title: "For Regulators",
    description: "Monitor compliance and verify product authenticity.",
    icon: "📋",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
    features: ["Compliance Monitoring", "Audit Trails", "Authentication System"],
    path: "/regulator/register",
  },
  {
    title: "For Healthcare Providers",
    description: "Ensure authentic medicines and maintain records.",
    icon: "⚕️",
    color: "#FF5722",
    gradient: "linear-gradient(135deg, #FF5722 0%, #E64A19 100%)",
    features: ["Verification Tools", "Patient Safety", "Inventory Tracking"],
    path: "/healthcare/register",
  },
];

const features = [
  {
    title: "Safe & Secure",
    description: "Every transaction is recorded on the blockchain, ensuring data integrity and transparency.",
    icon: "🔒",
    color: "#4CAF50", // Green for security
  },
  {
    title: "Medical Equipment",
    description: "Secure access control based on user roles and permissions.",
    icon: "⚕️",
    color: "#2196F3", // Blue for medical
  },
  {
    title: "Urgent Service",
    description: "Real-time tracking of pharmaceutical products throughout the supply chain.",
    icon: "🚑",
    color: "#F44336", // Red for urgency
  },
];

const steps = [
  {
    number: "01",
    title: "Register & Verify",
    description: "Create your account and complete the verification process to ensure secure access to the platform.",
    icon: "🔐",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
  },
  {
    number: "02",
    title: "Set Up Your Profile",
    description: "Configure your organization's profile and role-specific settings for seamless operation.",
    icon: "⚙️",
    color: "#2196F3",
    gradient: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
  },
  {
    number: "03",
    title: "Start Managing",
    description: "Begin tracking and managing your pharmaceutical supply chain with full transparency and compliance.",
    icon: "🚀",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
  },
];

// Minimal footer links
const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

// Add responsive styles
const footerResponsiveStyles = {
  mobile: {
    padding: "32px 16px",
    fontSize: "0.875rem",
  },
  tablet: {
    padding: "40px 24px",
    fontSize: "0.9rem",
  },
  desktop: {
    padding: "48px 0",
    fontSize: "1rem",
  },
};

export default function Home() {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Box style={{ width: "100%", background: colors.background.main }}>
      {/* <Navbar /> */}
      
      {/* Hero Section */}
    <Box style={{
      minHeight: "100vh",
        background: colors.gradient.primary,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background Elements */}
        <Box
          style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
            background: "radial-gradient(circle at 0% 0%, rgba(77, 208, 225, 0.15) 0%, rgba(0, 172, 193, 0) 50%)",
          }}
        />
        <Box
          style={{
            position: "absolute",
            top: "50%",
            right: "-10%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(0, 172, 193, 0.1) 0%, rgba(0, 172, 193, 0) 70%)",
            transform: "translateY(-50%)",
            borderRadius: "50%",
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "5%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(77, 208, 225, 0.08) 0%, rgba(77, 208, 225, 0) 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <Container size="4" style={{ position: "relative", height: "100%" }}>
          <Flex
            direction="row"
            gap="8"
            align="center"
            justify="between"
            style={{ 
              minHeight: "100vh",
              padding: "0 24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ flex: 1, maxWidth: "600px" }}
            >
              <Text
                size="3"
                style={{
                  color: colors.text.light,
                  opacity: 0.9,
                  marginBottom: "16px",
                  fontWeight: "500",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Blockchain-Powered Pharmaceutical Tracking
              </Text>
              <Heading
                size="9"
                style={{
                  color: colors.text.light,
                  lineHeight: "1.1",
                marginBottom: "24px",
                letterSpacing: "-0.02em",
                  fontSize: "4rem",
                  fontWeight: "800",
                }}
              >
                Secure Medicine Supply Chain Management
              </Heading>
              <Text
                size="5"
                style={{
                  color: colors.text.light,
                  opacity: 0.9,
                marginBottom: "32px",
                  maxWidth: "500px",
                lineHeight: "1.6",
                  fontSize: "1.25rem",
                }}
              >
                Ensure authenticity, track distribution, and maintain compliance with our blockchain-based solution.
              </Text>
              <Flex gap="4" align="center">
                <ConnectButton />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Text size="2" style={{ color: colors.text.light, opacity: 0.8 }}>
                  Connect your wallet to get started
                </Text>
                </motion.div>
              </Flex>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ 
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <Box style={{
                position: "relative",
                width: "100%",
                maxWidth: "600px",
                aspectRatio: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Box style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle, rgba(77, 208, 225, 0.1) 0%, rgba(0, 172, 193, 0) 70%)",
                  borderRadius: "50%",
                  animation: "pulse 3s infinite",
                }} />
                <MedicineIllustration />
                </Box>
            </motion.div>
            </Flex>
          </Container>

        {/* Decorative Bottom Wave */}
        {/* <Box style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }} /> */}
      </Box>
      
      {/* Statistics Section - Floating Cards */}
      {/* <Container size="4" style={{ transform: "translateY(-80px)" }}>
        <Grid columns="4" gap="6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
          <Card style={{ 
                background: "#FFFFFF",
                boxShadow: colors.shadow.lg,
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0, 172, 193, 0.1)",
              }}>
                <Box p="5" style={{ textAlign: "center" }}>
                  <Text size="8" weight="bold" style={{ 
                    color: colors.primary.main,
                    fontSize: "2.5rem",
                    marginBottom: "8px",
                  }}>
                    {stat.value}
                  </Text>
                  <Text size="2" style={{ color: colors.text.secondary }}>
                    {stat.label}
                  </Text>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Container> */}

      {/* Get Started Section */}
      <Box style={{ 
        padding: "120px 0",
        background: "#FFFFFF",
                position: "relative",
        overflow: "hidden",
              }}>
        {/* Background decoration */}
              <Box style={{
                position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.343-3 3 1.343 3 3 3zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${colors.primary.main.substring(1)}' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
        
        <Container size="4">
          <Box style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 64px" }}>
            <Text
              size="3"
              style={{
                color: colors.primary.main,
                fontWeight: "500",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Get Started Today
            </Text>
            <Heading
              size="8"
              style={{
                color: colors.text.primary,
                marginBottom: "24px",
                fontSize: "3rem",
                lineHeight: "1.2",
              }}
            >
              Choose Your Role to Get Started
            </Heading>
            <Text
              size="4"
              style={{
                color: colors.text.secondary,
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Select your role in the pharmaceutical supply chain and start managing your operations with blockchain-powered security.
            </Text>
          </Box>

          <Grid columns="2" gap="6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {getStartedCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    height: "100%",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  }}
                >
                  <Box>
                  <Box style={{ 
                      background: card.gradient,
                      padding: "32px",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <Box style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "radial-gradient(circle at 70% -10%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
                      }} />
                      <Box
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "20px",
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                          fontSize: "32px",
                    marginBottom: "16px",
                        }}
                      >
                        {card.icon}
                  </Box>
                      <Heading size="5" style={{ color: "#FFFFFF", marginBottom: "8px" }}>
                        {card.title}
                      </Heading>
                      <Text size="2" style={{ color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>
                        {card.description}
                  </Text>
              </Box>
                    <Box p="5">
                      <Text size="2" style={{ color: colors.text.secondary, marginBottom: "16px" }}>
                        Key Features:
                      </Text>
                      {card.features.map((feature, idx) => (
                        <Flex key={idx} align="center" gap="2" style={{ marginBottom: "8px" }}>
                  <Box style={{ 
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: `${card.color}15`,
                            color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                            fontSize: "12px",
                          }}>
                            ✓
                  </Box>
                          <Text size="2" style={{ color: colors.text.primary }}>
                            {feature}
                  </Text>
                </Flex>
                      ))}
                      <Button
                        onClick={() => navigate(card.path)}
                        style={{
                          width: "100%",
                          background: card.gradient,
                          color: "#FFFFFF",
                          padding: "12px",
                          marginTop: "24px",
                          borderRadius: "12px",
                          border: "none",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Get Started
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
              </Box>
              
      {/* Features Section */}
      <Box style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <Container size="4">
          <Box style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 64px" }}>
            <Text
              size="3"
              style={{
                color: colors.primary.main,
                fontWeight: "500",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Our Features
            </Text>
            <Heading
              size="6"
              style={{
                color: colors.text.primary,
                fontSize: "2.5rem",
                lineHeight: "1.2",
                marginBottom: "16px",
              }}
            >
              We Are Providing World's Best Listed Medicine
            </Heading>
            <Text
              size="3"
              style={{
                color: colors.text.secondary,
                lineHeight: "1.6",
              }}
            >
              Experience secure, transparent, and efficient pharmaceutical supply chain management
            </Text>
          </Box>

          <Grid columns="3" gap="6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  style={{
                    background: "#FFFFFF",
                    boxShadow: colors.shadow.md,
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "100%",
                    border: `1px solid ${feature.color}15`,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = colors.shadow.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = colors.shadow.md;
                  }}
                >
                  <Box p="5">
                    <Box
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: `${feature.color}10`,
                        color: feature.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                        marginBottom: "24px",
                        fontSize: "28px",
                      }}
                    >
                      {feature.icon}
                  </Box>
                    <Heading
                      size="4"
                      style={{
                        color: colors.text.primary,
                        marginBottom: "12px",
                      }}
                    >
                      {feature.title}
                    </Heading>
                    <Text
                      size="2"
                      style={{
                        color: colors.text.secondary,
                        lineHeight: "1.6",
                      }}
                    >
                      {feature.description}
                  </Text>
              </Box>
          </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
        </Box>
        
      {/* How It Works Section */}
      <Box style={{ 
        padding: "120px 0",
        background: "#FFFFFF",
            position: "relative",
        overflow: "hidden",
          }}>
        {/* Background decoration */}
            <Box style={{
              position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `linear-gradient(135deg, ${colors.primary.main}05 0%, ${colors.primary.main}02 100%)`,
          zIndex: 0,
        }} />
        
        <Container size="4" style={{ position: "relative", zIndex: 1 }}>
          <Box style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 80px" }}>
            <Text
              size="3"
              style={{
                color: colors.primary.main,
                fontWeight: "500",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Simple Steps
            </Text>
            <Heading
              size="8"
              style={{
                color: colors.text.primary,
                marginBottom: "24px",
                fontSize: "3rem",
                lineHeight: "1.2",
              }}
            >
              How It Works
          </Heading>
            <Text
              size="4"
              style={{
                color: colors.text.secondary,
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Get started with our platform in three simple steps and transform your pharmaceutical supply chain management
            </Text>
          </Box>

          <Grid columns="3" gap="6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderRadius: "24px",
              overflow: "hidden",
              height: "100%",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  }}
                >
                  <Box style={{
                    background: step.gradient,
                    padding: "32px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                  <Box style={{ 
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "radial-gradient(circle at 70% -10%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
                    }} />
                    <Flex justify="between" align="center" style={{ marginBottom: "24px" }}>
                      <Box
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                          fontSize: "28px",
                        }}
                      >
                        {step.icon}
                  </Box>
                      <Text
                        size="8"
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontWeight: "800",
                          fontSize: "3rem",
                          lineHeight: "1",
                        }}
                      >
                        {step.number}
                      </Text>
                </Flex>
                    <Heading size="5" style={{ color: "#FFFFFF", marginBottom: "12px" }}>
                      {step.title}
                    </Heading>
                    <Text size="2" style={{ color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>
                      {step.description}
                </Text>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Grid>

          <Box style={{ textAlign: "center", marginTop: "64px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Button
                size="4"
                onClick={() => navigate("/register")}
                style={{
                  background: colors.primary.main,
                  color: "#FFFFFF",
                  padding: "0 32px",
                  height: "56px",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0, 172, 193, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 172, 193, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 172, 193, 0.2)";
                }}
              >
                Get Started Now
                </Button>
            </motion.div>
              </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box style={{ 
        padding: "120px 0",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Pattern */}
        <Box style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary.main.substring(1)}' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <Container size="4">
          <Box style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 80px" }}>
            <Text
              size="3"
              style={{
                color: colors.primary.main,
                fontWeight: "500",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Success Stories
            </Text>
            <Heading
              size="8"
              style={{
                color: colors.text.primary,
                marginBottom: "24px",
                fontSize: "3rem",
                lineHeight: "1.2",
              }}
            >
              Trusted by Industry Leaders
            </Heading>
            <Text
              size="4"
              style={{
                color: colors.text.secondary,
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              See how DrugLedger is transforming pharmaceutical supply chains and setting new standards in the industry
            </Text>
          </Box>

          <Box style={{ 
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
          }}>
            <div style={{ width: "100%" }}>
            <Card style={{ 
                background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                borderRadius: "24px",
              overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
              }}>
                <Grid columns="2" gap="6">
                  {/* Left Column - Quote and Author */}
                  <Box p="6">
                    <Box style={{ marginBottom: "32px" }}>
                      {/* Rating Stars */}
                      <Flex gap="1" style={{ marginBottom: "24px" }}>
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Text key={i} style={{ color: "#FFB800", fontSize: "24px" }}>★</Text>
                        ))}
                      </Flex>
                      
                      <Text size="6" style={{
                        color: colors.text.primary,
                        lineHeight: "1.6",
                        marginBottom: "32px",
                        fontStyle: "italic",
                        position: "relative",
                      }}>
                        <Text style={{
                          fontSize: "64px",
                          position: "absolute",
                          top: "-20px",
                          left: "-8px",
                          color: `${colors.primary.main}20`,
                          fontFamily: "serif",
                        }}>
                          "
                        </Text>
                        {testimonials[currentTestimonial].quote}
                      </Text>
                    </Box>

                    <Flex align="center" gap="4">
                  <Box style={{ 
                        width: "64px",
                        height: "64px",
                        borderRadius: "20px",
                        background: colors.gradient.primary,
                        color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: "600",
                      }}>
                        {testimonials[currentTestimonial].avatar}
                  </Box>
                  <Box>
                        <Text weight="bold" size="4" style={{ 
                          color: colors.text.primary,
                          marginBottom: "4px"
                        }}>
                          {testimonials[currentTestimonial].author}
                        </Text>
                        <Text size="2" style={{ 
                          color: colors.text.secondary,
                          marginBottom: "4px"
                        }}>
                          {testimonials[currentTestimonial].role}
                        </Text>
                        <Text size="2" style={{ color: colors.primary.main }}>
                          {testimonials[currentTestimonial].company}
                        </Text>
                  </Box>
                </Flex>

                    {/* Key Metrics */}
                    <Grid columns="3" gap="4" style={{ marginTop: "32px" }}>
                      {Object.entries(testimonials[currentTestimonial].metrics).map(([key, value], idx) => (
                        <Box key={idx} style={{
                          padding: "16px",
                          background: `${colors.primary.main}08`,
                          borderRadius: "12px",
                          textAlign: "center"
                        }}>
                          <Text size="5" weight="bold" style={{ 
                            color: colors.primary.main,
                            marginBottom: "4px"
                          }}>
                            {value}
                </Text>
                          <Text size="1" style={{ 
                            color: colors.text.secondary,
                            textTransform: "capitalize"
                          }}>
                            {key}
                          </Text>
              </Box>
                      ))}
                    </Grid>
                  </Box>

                  {/* Right Column - Image */}
                  <Box style={{
                    background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.main}05 100%)`,
                    borderRadius: "24px",
              overflow: "hidden",
                    position: "relative",
                    minHeight: "500px",
                  }}>
                  <Box style={{ 
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80%",
                      textAlign: "center",
                    }}>
                      <Text size="8" style={{ color: colors.primary.main }}>
                        {testimonials[currentTestimonial].avatar}
                      </Text>
                    </Box>
                  </Box>
                </Grid>
              </Card>
            </div>

            {/* Navigation Controls */}
            <Flex justify="between" style={{
              position: "absolute",
              top: "50%",
              left: "-80px",
              right: "-80px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}>
              <Button
                onClick={previousTestimonial}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  color: colors.text.primary,
                  pointerEvents: "auto",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <ChevronLeftIcon width={24} height={24} />
              </Button>
              <Button
                onClick={nextTestimonial}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.text.primary,
                  pointerEvents: "auto",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <ChevronRightIcon width={24} height={24} />
              </Button>
            </Flex>

            {/* Testimonial Indicators */}
            <Flex justify="center" gap="3" style={{ marginTop: "48px" }}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  style={{
                    width: index === currentTestimonial ? "32px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: currentTestimonial === index ? colors.primary.main : `${colors.primary.main}40`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Flex>
                  </Box>
        </Container>
                  </Box>

      {/* Featured Products Section */}

      {/* Call to Action Section */}
      <Box style={{ 
        padding: "120px 0",
        background: colors.gradient.primary,
        color: "#FFFFFF",
        position: "relative",
            overflow: "hidden",
          }}>
        <Container size="4">
          <Box style={{
              textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            <Heading size="8" style={{ 
              marginBottom: "24px",
              color: "#FFFFFF",
              fontSize: "3.5rem",
              lineHeight: "1.2",
              fontWeight: "800",
            }}>
              Ready to Get Started?
            </Heading>
            <Text size="4" style={{ 
              marginBottom: "40px",
              opacity: 0.9,
              color: "#FFFFFF",
              lineHeight: "1.6",
            }}>
              Join thousands of pharmaceutical companies ensuring safety and compliance with DrugLedger.
              </Text>
            <Flex gap="4" justify="center" align="center">
              <Button
                size="4"
                onClick={() => navigate("/register")}
                style={{
                  background: "#FFFFFF",
                  color: colors.primary.main,
                  padding: "0 32px",
                  height: "56px",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }}
              >
                Get Started
                </Button>
              <Button
                size="4"
                variant="outline"
                onClick={() => navigate("/contact")}
                style={{
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "#FFFFFF",
                  padding: "0 32px",
                  height: "56px",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.borderColor = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                }}
              >
                  Contact Us
                </Button>
              </Flex>
          </Box>
        </Container>
        </Box>
        
      {/* Modern Minimal Footer */}
      <Box style={{ 
        background: "linear-gradient(to right, #FFFFFF, #F8FAFC)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: footerResponsiveStyles.desktop.padding,
        "@media (max-width: 768px)": {
          padding: footerResponsiveStyles.tablet.padding,
        },
        "@media (max-width: 480px)": {
          padding: footerResponsiveStyles.mobile.padding,
        },
      }}>
        <Container size="4">
          <Flex 
            direction="column" 
            align="center" 
            gap="6"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
              "@media (max-width: 480px)": {
                gap: "4",
              },
            }}
          >
            {/* Logo and Description */}
            <Box style={{
              width: "100%",
              "@media (max-width: 480px)": {
                padding: "0 16px",
              },
            }}>
              <Heading 
                size="6" 
                style={{
                  background: colors.gradient.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "16px",
                  fontWeight: "800",
                  "@media (max-width: 480px)": {
                    fontSize: "1.75rem",
                    marginBottom: "12px",
                  },
                }}
              >
                DrugLedger
              </Heading>
              <Text 
                size="2" 
                style={{
                  color: colors.text.secondary,
                  maxWidth: "400px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                  "@media (max-width: 480px)": {
                    fontSize: "0.875rem",
                    maxWidth: "100%",
                  },
                }}
              >
                Secure pharmaceutical supply chain management powered by blockchain
                </Text>
              </Box>

            {/* Social Links */}
            <Flex 
              gap="4" 
              style={{ 
                margin: "8px 0",
                "@media (max-width: 480px)": {
                  margin: "4px 0",
                  gap: "3",
                },
              }}
            >
              {["Twitter", "LinkedIn", "GitHub"].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => navigate(`/${social.toLowerCase()}`)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    padding: "0",
                display: "flex",
                alignItems: "center",
                    justifyContent: "center",
                    color: colors.text.secondary,
                    background: "rgba(0,0,0,0.03)",
                    transition: "all 0.2s ease",
                    "@media (max-width: 480px)": {
                      width: "36px",
                      height: "36px",
                      fontSize: "0.8rem",
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                    e.currentTarget.style.color = colors.primary.main;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                >
                  {social[0]}
              </Button>
              ))}
            </Flex>

            {/* Navigation Links */}
            <Flex 
              gap="4" 
              wrap="wrap" 
              justify="center"
              style={{
                padding: "8px 0",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                width: "100%",
                "@media (max-width: 768px)": {
                  gap: "2",
                  padding: "12px 16px",
                },
                "@media (max-width: 480px)": {
                  flexDirection: "column",
                  gap: "1",
                  padding: "16px",
                },
              }}
            >
              {footerLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => navigate(link.href)}
                  style={{
                    color: colors.text.secondary,
                    fontSize: footerResponsiveStyles.desktop.fontSize,
                    padding: "8px 12px",
                    transition: "all 0.2s ease",
                    "@media (max-width: 768px)": {
                      fontSize: footerResponsiveStyles.tablet.fontSize,
                      padding: "6px 10px",
                    },
                    "@media (max-width: 480px)": {
                      fontSize: footerResponsiveStyles.mobile.fontSize,
                      padding: "8px",
                      width: "100%",
                      textAlign: "center",
                      borderRadius: "6px",
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.primary.main;
                    if (window.innerWidth <= 480) {
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.text.secondary;
                    if (window.innerWidth <= 480) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Flex>

            {/* Copyright */}
            <Text 
              size="1" 
              style={{ 
                color: colors.text.secondary,
                opacity: 0.8,
                padding: "0 16px",
                "@media (max-width: 480px)": {
                  fontSize: "0.75rem",
                },
              }}
            >
              © {new Date().getFullYear()} DrugLedger. All rights reserved.
            </Text>
          </Flex>
      </Container>
      </Box>
    </Box>
  );
}

const roles = [
  {
    title: "Admin Dashboard",
    description: "Comprehensive control center for managing the entire platform ecosystem.",
    path: "/admin",
    icon: "⚙️",
    color: "#6366F1", // Indigo
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    features: [
      "User Management & Access Control",
      "System Configuration & Settings",
      "Analytics & Reporting Dashboard",
      "Audit Trail Monitoring"
    ],
    stats: {
      users: "1.2K+",
      actions: "50K+",
      uptime: "99.9%"
    }
  },
  {
    title: "Manufacturer Portal",
    description: "Streamlined interface for pharmaceutical manufacturing and batch management.",
    path: "/manufacturer",
    icon: "🏭",
    color: "#10B981", // Emerald
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    features: [
      "Batch Creation & Management",
      "Quality Control Tracking",
      "Production Analytics",
      "Compliance Documentation"
    ],
    stats: {
      batches: "10K+",
      products: "500+",
      compliance: "100%"
    }
  },
  {
    title: "Regulatory Compliance",
    description: "Comprehensive tools for monitoring and maintaining regulatory standards.",
    path: "/regulator",
    icon: "📋",
    color: "#F59E0B", // Amber
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    features: [
      "Real-time Compliance Monitoring",
      "Automated Verification System",
      "Regulatory Documentation",
      "Alert & Notification System"
    ],
    stats: {
      verified: "1M+",
      standards: "100+",
      accuracy: "99.9%"
    }
  },
  {
    title: "Distribution Network",
    description: "End-to-end supply chain visibility and distribution management system.",
    path: "/distributor",
    icon: "🚚",
    color: "#EC4899", // Pink
    gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
    features: [
      "Real-time Shipment Tracking",
      "Inventory Management",
      "Route Optimization",
      "Temperature Monitoring"
    ],
    stats: {
      shipments: "25K+",
      locations: "1000+",
      ontime: "98%"
    }
  }
];