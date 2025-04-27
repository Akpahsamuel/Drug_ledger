import { Box, Container, Flex, Button } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import Logo from '../assets/hero.png'

const colors = {
  primary: {
    main: "#00ACC1",
    light: "#4DD0E1",
    dark: "#006064",
  },
  background: {
    light: "#FFFFFF",
    transparent: "rgba(255, 255, 255, 0.98)",
  },
  text: {
    primary: "#263238",
    secondary: "#546E7A",
    light: "#FFFFFF",
  },
  shadow: {
    navbar: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
};

interface NavLinkProps {
  to: string;
  children: ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => (
  <Link
    to={to}
    style={{
      color: colors.text.secondary,
      textDecoration: "none",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "color 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = colors.primary.main;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = colors.text.secondary;
    }}
  >
    {children}
  </Link>
);

interface NavbarProps {
  children?: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  return (
    <Box
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: colors.background.transparent,
        backdropFilter: "blur(8px)",
        boxShadow: colors.shadow.navbar,
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container size="4">
        <Flex
          justify="between"
          align="center"
          style={{
            height: "72px",
            padding: "0 24px",
          }}
        >
          {/* Logo and Navigation Links */}
          <Flex align="center" gap="8">
            <Link to="/" style={{ textDecoration: "none" }}>
              <Box
                style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "700",
                  color: colors.primary.main,
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  letterSpacing: "-0.02em",
                }}
              >
                <img src={Logo} alt="logo" style={{width: 60}} />
                DrugLedger
              </Box>
            </Link>
          </Flex>

          {/* Right Side Actions */}
          <Flex align="center" gap="4">
            {children}
            <ConnectButton />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 