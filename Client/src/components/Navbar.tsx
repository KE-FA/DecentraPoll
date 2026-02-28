import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Stats", href: "#stats" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 24px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(2, 6, 23, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.15)",
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          🗳️
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.25rem",
            background: "linear-gradient(90deg, #6366f1, #14b8a6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DecentraPoll
        </span>
      </motion.div>

      {/* Desktop Links */}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
        }}
        className="hidden md:flex"
      >
        {navLinks.map((link) => (
          <motion.button
            key={link.label}
            onClick={() => scrollTo(link.href)}
            whileHover={{ color: "#6366f1" }}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.95rem",
              cursor: "pointer",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </motion.button>
        ))}
      </div>

      {/* Log In */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          style={{
            background: "linear-gradient(135deg, #6366f1, #14b8a6)",
            border: "none",
            borderRadius: 50,
            padding: "10px 24px",
            color: "white",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          }}
        >
          Launch App
        </motion.button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            top: 72,
            left: 0,
            right: 0,
            background: "rgba(2, 6, 23, 0.97)",
            borderBottom: "1px solid rgba(99,102,241,0.2)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            backdropFilter: "blur(20px)",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: 500,
                padding: "8px 0",
              }}
            >
              {link.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
