import { Box, Container, Heading, Text, Flex, Card, Button, Link, Badge, Grid } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function Home() {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  return (
    <Box style={{
      background: "linear-gradient(135deg, #f0f6ff 0%, #e4f0ff 100%)",
      minHeight: "100vh",
      padding: "0",
      margin: "0"
    }}>
      {/* Hero Section with improved spacing and typography */}
      <Box style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1576671414121-aa0c81c869e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "650px",
        position: "relative",
        marginBottom: "80px"
      }}>
        <Box style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 32, 96, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 20px"
        }}>
          <Container size="3">
            <Flex direction="column" align="center">
              <Heading size="9" style={{ 
                textAlign: "center", 
                color: "white", 
                marginBottom: "24px",
                fontWeight: "900",
                letterSpacing: "-0.02em",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                maxWidth: "900px",
                lineHeight: "1.1"
              }}>
                Transforming Pharmaceutical Supply Chains
              </Heading>
              <Text size="5" as="p" style={{ 
                textAlign: "center", 
                maxWidth: "800px", 
                color: "white",
                marginBottom: "24px",
                opacity: "0.9",
                fontWeight: "500",
                letterSpacing: "0.01em",
                lineHeight: "1.4"
              }}>
                Transparent, Secure DrugLedger on Sui Blockchain
              </Text>
              <Box style={{
                width: "60px",
                height: "4px",
                backgroundColor: "#3a8eff",
                marginBottom: "32px",
                borderRadius: "2px"
              }} />
              <Text size="3" as="p" style={{ 
                textAlign: "center", 
                maxWidth: "700px", 
                color: "white",
                marginBottom: "48px",
                opacity: "0.8",
                lineHeight: "1.6",
                fontWeight: "400"
              }}>
                Connecting regulators, manufacturers, and distributors for end-to-end drug traceability and compliance.
              </Text>
              
              <Flex direction="column" align="center" gap="3">
                <Text size="3" as="p" style={{ 
                  color: "white", 
                  marginBottom: "16px",
                  fontWeight: "600"
                }}>
                  Connect your wallet to get started
                </Text>
                <Box style={{
                  transform: "scale(1.2)",
                  padding: "6px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}>
                  <ConnectButton />
                </Box>
              </Flex>
              
              <Flex gap="3" mt="5" wrap="wrap" justify="center">
                <Badge color="green" variant="soft" style={{ padding: "8px 12px", fontSize: "14px" }}>Immutable Records</Badge>
                <Badge color="blue" variant="soft" style={{ padding: "8px 12px", fontSize: "14px" }}>Real-time Tracking</Badge>
                <Badge color="amber" variant="soft" style={{ padding: "8px 12px", fontSize: "14px" }}>Regulatory Compliance</Badge>
                <Badge color="crimson" variant="soft" style={{ padding: "8px 12px", fontSize: "14px" }}>Enhanced Security</Badge>
              </Flex>
            </Flex>
          </Container>
        </Box>
      </Box>
      
      {/* What is DrugLedger section with improved card design */}
      <Container size="3">
        <Box style={{ marginTop: "-120px", marginBottom: "80px" }}>
          <Card style={{ 
            boxShadow: "0 20px 40px rgba(0, 32, 96, 0.12)",
            padding: "50px",
            borderRadius: "24px",
            background: "white"
          }}>
            <Heading size="6" style={{ 
              color: "#0a2463", 
              marginBottom: "32px", 
              textAlign: "center",
              position: "relative",
              paddingBottom: "16px"
            }}>
              <span style={{ 
                position: "relative",
                zIndex: "1"
              }}>
                What is DrugLedger?
              </span>
              <Box style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "3px",
                background: "linear-gradient(90deg, #3a8eff 0%, #0057ff 100%)",
                borderRadius: "2px"
              }} />
            </Heading>
            <Text as="p" style={{ 
              color: "#475569", 
              lineHeight: "1.8", 
              textAlign: "center", 
              marginBottom: "40px",
              fontSize: "18px",
              maxWidth: "800px",
              margin: "0 auto 40px"
            }}>
              DrugLedger is a blockchain-based platform on Sui designed to ensure transparency, 
              regulatory compliance, and efficiency in the pharmaceutical supply chain from manufacturing to distribution.
            </Text>
            
            <Flex gap="6" direction={{ initial: "column", sm: "row" }} wrap="wrap">
              <Box style={{ flex: 1, minWidth: "250px" }}>
                <Flex direction="column" gap="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #e6f0ff 0%, #d4e5ff 100%)", 
                    width: "70px", 
                    height: "70px", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    boxShadow: "0 8px 16px rgba(58, 142, 255, 0.1)"
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16L16 12L12 8" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H16" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                  <Heading size="4" style={{ color: "#0a2463", marginBottom: "12px" }}>Immutable Records</Heading>
                  <Text as="p" style={{ color: "#475569", lineHeight: "1.7" }}>
                    All drug records and transactions are stored on the Sui blockchain, providing an 
                    immutable and transparent audit trail.
                  </Text>
                </Flex>
              </Box>
              
              <Box style={{ flex: 1, minWidth: "250px" }}>
                <Flex direction="column" gap="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #e6f0ff 0%, #d4e5ff 100%)", 
                    width: "70px", 
                    height: "70px", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    boxShadow: "0 8px 16px rgba(58, 142, 255, 0.1)"
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12H15" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 9V15" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                  <Heading size="4" style={{ color: "#0a2463", marginBottom: "12px" }}>Role-Based Access</Heading>
                  <Text as="p" style={{ color: "#475569", lineHeight: "1.7" }}>
                    Secure role-based permissions for manufacturers, regulators, and distributors, 
                    ensuring appropriate access control.
                  </Text>
                </Flex>
              </Box>
              
              <Box style={{ flex: 1, minWidth: "250px" }}>
                <Flex direction="column" gap="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #e6f0ff 0%, #d4e5ff 100%)",
                    width: "70px", 
                    height: "70px", 
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    boxShadow: "0 8px 16px rgba(58, 142, 255, 0.1)"
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10L12 14L16 10" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0057ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                  <Heading size="4" style={{ color: "#0a2463", marginBottom: "12px" }}>End-to-End Tracking</Heading>
                  <Text as="p" style={{ color: "#475569", lineHeight: "1.7" }}>
                    Complete visibility of pharmaceuticals from manufacturing to distribution,
                    reducing counterfeits and ensuring patient safety.
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </Box>
        
        {/* User-Specific Sections with enhanced card design */}
        <Box mb="9">
          <Heading size="6" style={{ 
            color: "#0a2463", 
            marginBottom: "32px", 
            fontWeight: "700", 
            textAlign: "center",
            position: "relative",
            paddingBottom: "16px"
          }}>
            <span style={{position: "relative", zIndex: "1"}}>
              Empowering Every Stakeholder in the Supply Chain
            </span>
            <Box style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100px",
              height: "3px",
              background: "linear-gradient(90deg, #3a8eff 0%, #0057ff 100%)",
              borderRadius: "2px"
            }} />
          </Heading>
          
          <Grid columns={{ initial: "1", sm: "2" }} gap="6" mb="5">
            <Card style={{ 
              border: "none", 
              boxShadow: "0 10px 30px rgba(0, 32, 96, 0.08)",
              overflow: "hidden",
              borderRadius: "20px",
              height: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ':hover': {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 35px rgba(0, 32, 96, 0.12)"
              }
            }}>
              <Box style={{ padding: "32px" }}>
                <Flex gap="5" align="center" mb="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #0057ff 0%, #3a8eff 100%)",
                    color: "white", 
                    width: "72px", 
                    height: "72px", 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    boxShadow: "0 8px 16px rgba(0, 87, 255, 0.2)"
                  }}>
                    Admin
                  </Box>
                  <Box>
                    <Heading size="3" style={{ color: "#0a2463", marginBottom: "8px", fontWeight: "600" }}>Administrator</Heading>
                  </Box>
                </Flex>
                <Text as="p" style={{ color: "#475569", lineHeight: "1.7", marginBottom: "28px" }}>
                  Manage platform access, oversee user activity, and maintain system integrity. Control roles and permissions across the entire supply chain.
                </Text>
                <Button size="3" style={{ 
                  background: "linear-gradient(90deg, #3a8eff 0%, #0057ff 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 24px",
                  height: "44px",
                  boxShadow: "0 4px 12px rgba(0, 87, 255, 0.15)",
                  fontWeight: "600",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ':hover': {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0, 87, 255, 0.25)"
                  }
                }} onClick={() => navigate("/admin")}>
                  Admin Portal
                </Button>
              </Box>
            </Card>
            
            <Card style={{ 
              border: "none", 
              boxShadow: "0 10px 30px rgba(0, 32, 96, 0.08)",
              overflow: "hidden",
              borderRadius: "20px",
              height: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ':hover': {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 35px rgba(0, 32, 96, 0.12)"
              }
            }}>
              <Box style={{ padding: "32px" }}>
                <Flex gap="5" align="center" mb="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #00a86b 0%, #1AD1A5 100%)",
                    color: "white", 
                    width: "72px", 
                    height: "72px", 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    boxShadow: "0 8px 16px rgba(0, 168, 107, 0.2)"
                  }}>
                    Mfg
                  </Box>
                  <Box>
                    <Heading size="3" style={{ color: "#0a2463", marginBottom: "8px", fontWeight: "600" }}>Manufacturer</Heading>
                  </Box>
                </Flex>
                <Text as="p" style={{ color: "#475569", lineHeight: "1.7", marginBottom: "28px" }}>
                  Register and authenticate drug batches, ensure regulatory compliance, and maintain detailed records of all production information.
                </Text>
                <Button size="3" style={{ 
                  background: "linear-gradient(90deg, #00a86b 0%, #1AD1A5 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 24px",
                  height: "44px",
                  boxShadow: "0 4px 12px rgba(0, 168, 107, 0.15)",
                  fontWeight: "600",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ':hover': {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0, 168, 107, 0.25)"
                  }
                }} onClick={() => navigate("/manufacturer")}>
                  Get Started
                </Button>
              </Box>
            </Card>
            
            <Card style={{ 
              border: "none", 
              boxShadow: "0 10px 30px rgba(0, 32, 96, 0.08)",
              overflow: "hidden",
              borderRadius: "20px",
              height: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ':hover': {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 35px rgba(0, 32, 96, 0.12)"
              }
            }}>
              <Box style={{ padding: "32px" }}>
                <Flex gap="5" align="center" mb="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #FF9900 0%, #FFCC00 100%)",
                    color: "white", 
                    width: "72px", 
                    height: "72px", 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    boxShadow: "0 8px 16px rgba(255, 153, 0, 0.2)"
                  }}>
                    Reg
                  </Box>
                  <Box>
                    <Heading size="3" style={{ color: "#0a2463", marginBottom: "8px", fontWeight: "600" }}>Regulator</Heading>
                  </Box>
                </Flex>
                <Text as="p" style={{ color: "#475569", lineHeight: "1.7", marginBottom: "28px" }}>
                  Monitor compliance, access real-time audit trails, enforce safety standards, and verify drug authenticity across the entire supply chain.
                </Text>
                <Button size="3" style={{ 
                  background: "linear-gradient(90deg, #FF9900 0%, #FFCC00 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 24px",
                  height: "44px",
                  boxShadow: "0 4px 12px rgba(255, 153, 0, 0.15)",
                  fontWeight: "600",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ':hover': {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(255, 153, 0, 0.25)"
                  }
                }} onClick={() => navigate("/regulator")}>
                  Learn More
                </Button>
              </Box>
            </Card>
            
            <Card style={{ 
              border: "none", 
              boxShadow: "0 10px 30px rgba(0, 32, 96, 0.08)",
              overflow: "hidden",
              borderRadius: "20px",
              height: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ':hover': {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 35px rgba(0, 32, 96, 0.12)"
              }
            }}>
              <Box style={{ padding: "32px" }}>
                <Flex gap="5" align="center" mb="4">
                  <Box style={{ 
                    background: "linear-gradient(135deg, #7B61FF 0%, #9B88FF 100%)",
                    color: "white", 
                    width: "72px", 
                    height: "72px", 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    boxShadow: "0 8px 16px rgba(123, 97, 255, 0.2)"
                  }}>
                    Dist
                  </Box>
                  <Box>
                    <Heading size="3" style={{ color: "#0a2463", marginBottom: "8px", fontWeight: "600" }}>Distributor</Heading>
                  </Box>
                </Flex>
                <Text as="p" style={{ color: "#475569", lineHeight: "1.7", marginBottom: "28px" }}>
                  Track shipments, verify product authenticity, streamline logistics, and maintain the complete chain of custody for pharmaceutical products.
                </Text>
                <Button size="3" style={{ 
                  background: "linear-gradient(90deg, #7B61FF 0%, #9B88FF 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 24px",
                  height: "44px",
                  boxShadow: "0 4px 12px rgba(123, 97, 255, 0.15)",
                  fontWeight: "600",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ':hover': {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(123, 97, 255, 0.25)"
                  }
                }} onClick={() => navigate("/distributor")}>
                  Sign Up
                </Button>
              </Box>
            </Card>
          </Grid>
        </Box>
        
        {/* Trust Building Section with improved visual design */}
        <Box mb="8">
          <Card style={{ 
            border: "none", 
            boxShadow: "0 15px 30px rgba(0, 32, 96, 0.08)",
            overflow: "hidden",
            borderRadius: "24px",
            padding: "48px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)"
          }}>
            <Heading size="6" style={{ 
              color: "#0a2463", 
              marginBottom: "32px", 
              textAlign: "center",
              position: "relative",
              paddingBottom: "16px"
            }}>
              <span style={{position: "relative", zIndex: "1"}}>
                Trusted, Secure, and Compliant
              </span>
              <Box style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "3px",
                background: "linear-gradient(90deg, #3a8eff 0%, #0057ff 100%)",
                borderRadius: "2px"
              }} />
            </Heading>
            
            <Flex gap="6" direction="column" align="center">
              <Flex gap="3" wrap="wrap" justify="center">
                <Badge size="2" color="crimson" variant="solid" style={{padding: "10px 16px", fontSize: "14px", fontWeight: "600"}}>Blockchain-Secured</Badge>
                <Badge size="2" color="green" variant="solid" style={{padding: "10px 16px", fontSize: "14px", fontWeight: "600"}}>HIPAA Compliant</Badge>
                <Badge size="2" color="blue" variant="solid" style={{padding: "10px 16px", fontSize: "14px", fontWeight: "600"}}>FDA 21 CFR Part 11</Badge>
                <Badge size="2" color="amber" variant="solid" style={{padding: "10px 16px", fontSize: "14px", fontWeight: "600"}}>End-to-End Encrypted</Badge>
              </Flex>
              
              <Text as="p" style={{ 
                color: "#475569", 
                lineHeight: "1.8", 
                textAlign: "center", 
                maxWidth: "850px",
                fontSize: "18px",
                marginBottom: "16px"
              }}>
                DrugLedger leverages the power of Sui blockchain to provide an immutable, transparent, and secure platform
                for pharmaceutical supply chain management. Our solution ensures compliance with industry regulations while
                enhancing efficiency and trust among all stakeholders.
              </Text>
              
              <Flex gap="4" mt="4">
                <Button size="3" style={{ 
                  background: "linear-gradient(90deg, #3a8eff 0%, #0057ff 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 28px",
                  height: "48px",
                  fontWeight: "600",
                  boxShadow: "0 8px 16px rgba(0, 87, 255, 0.15)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ':hover': {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 20px rgba(0, 87, 255, 0.25)"
                  }
                }}>
                  Request a Demo
                </Button>
                
                <Button variant="outline" size="3" style={{ 
                  borderColor: "#0057ff", 
                  color: "#0057ff", 
                  borderRadius: "10px",
                  padding: "0 28px",
                  height: "48px",
                  fontWeight: "600",
                  transition: "background 0.2s ease",
                  ':hover': {
                    background: "rgba(0, 87, 255, 0.05)"
                  }
                }}>
                  Contact Us
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Box>
        
        {/* Improved Footer */}
        <Box style={{ marginBottom: "80px" }}>
          <Card style={{ 
            border: "none", 
            boxShadow: "0 8px 24px rgba(0, 32, 96, 0.05)",
            background: "linear-gradient(135deg, #f8faff 0%, #f2f6ff 100%)",
            padding: "36px",
            borderRadius: "16px"
          }}>
            <Flex justify="between" align="center" wrap="wrap" gap="4">
              <Box>
                <Text as="p" size="2" style={{ 
                  color: "#475569", 
                  lineHeight: "1.7",
                  maxWidth: "600px"
                }}>
                  DrugLedger is built on the Sui blockchain, providing a secure and scalable solution for pharmaceutical supply chain management.
                  <br />
                  <strong style={{ color: "#0a2463", marginTop: "8px", display: "block" }}>Blockchain-powered. Fully compliant. Designed for the future of pharma.</strong>
                </Text>
              </Box>
              <Button variant="outline" size="3" style={{ 
                borderColor: "#0057ff", 
                color: "#0057ff", 
                borderRadius: "10px",
                padding: "0 20px",
                height: "44px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }} onClick={() => window.open("https://github.com/", "_blank")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.475 2 2 6.475 2 12C2 16.425 4.8625 20.1625 8.8375 21.4875C9.3375 21.575 9.525 21.275 9.525 21.0125C9.525 20.775 9.5125 19.9875 9.5125 19.15C7 19.6125 6.35 18.5375 6.15 17.975C6.0375 17.6875 5.55 16.8 5.125 16.5625C4.775 16.375 4.275 15.9125 5.1125 15.9C5.9 15.8875 6.4625 16.625 6.65 16.925C7.55 18.4375 8.9875 18.0125 9.5625 17.75C9.65 17.1 9.9125 16.6625 10.2 16.4125C7.975 16.1625 5.65 15.3 5.65 11.475C5.65 10.3875 6.0375 9.4875 6.675 8.7875C6.575 8.5375 6.225 7.5125 6.775 6.1375C6.775 6.1375 7.6125 5.875 9.525 7.1625C10.325 6.9375 11.175 6.825 12.025 6.825C12.875 6.825 13.725 6.9375 14.525 7.1625C16.4375 5.8625 17.275 6.1375 17.275 6.1375C17.825 7.5125 17.475 8.5375 17.375 8.7875C18.0125 9.4875 18.4 10.375 18.4 11.475C18.4 15.3125 16.0625 16.1625 13.8375 16.4125C14.2 16.725 14.5125 17.325 14.5125 18.2625C14.5125 19.6 14.5 20.675 14.5 21.0125C14.5 21.275 14.6875 21.5875 15.1875 21.4875C19.1375 20.1625 22 16.4125 22 12C22 6.475 17.525 2 12 2Z" fill="#0057ff"/>
                </svg>
                View on GitHub
              </Button>
            </Flex>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}