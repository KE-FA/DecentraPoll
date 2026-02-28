import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import BlockchainCube from "../components/BlockchainCube";
import AnimatedCounter from "../components/AnimatedCounter";
import GlitchText from "../components/GlitchText";

const stats = [
    { value: "250+", label: "Active Polls" },
    { value: "15000+", label: "Student Votes Cast" },
    { value: "100%", label: "Tamper-Proof Results" },
];

const features = [
    {
        icon: "🔐",
        title: "Secure Voting",
        description:
            "Students can completely vote securely. No one can trace votes back to individuals. Privacy is guaranteed by cryptographic zero-knowledge proofs.",
    },
    {
        icon: "👨‍💼",
        title: "Admin Poll Creation",
        description:
            "Administrators create polls with multiple-choice options. Students simply select their preferred answers and submit with one click.",
    },
    {
        icon: "⚡",
        title: "Instant Results",
        description:
            "Real-time vote counting with a live results dashboard accessible to poll creators and participants the moment voting closes.",
    },
    {
        icon: "🎯",
        title: "Tamper-Proof",
        description:
            "All votes are recorded on an immutable blockchain ledger. Results cannot be altered or manipulated after submission ever.",
    },
];

const steps = [
    {
        number: "01",
        title: "Admin Creates Poll",
        description:
            "Institution administrators log in and create polls with close-ended multiple-choice options and set voting deadlines.",
        icon: "📝",
    },
    {
        number: "02",
        title: "Students Vote Securely",
        description:
            "Students authenticate, cast their vote and the system uses ZK proofs before recording on-chain for privacy.",
        icon: "🗳️",
    },
    {
        number: "03",
        title: "Results Secured on Blockchain",
        description:
            "Each vote is written to a smart contract. Results are publicly verifiable by anyone, tamper-proof forever.",
        icon: "⛓️",
    },
];

const faqs: { q: string; a: string }[] = [
    {
        q: "How is my security guaranteed?",
        a: "Your vote is separated from your identity using zero-knowledge proofs before being submitted to the blockchain. Not even admins can trace a vote back to you.",
    },
    {
        q: "Who can create polls?",
        a: "Only verified administrators of registered institutions can create and manage polls. Students are restricted to voting only.",
    },
    {
        q: "Can votes be changed after submission?",
        a: "No. Once a vote is recorded on the blockchain it is immutable. Smart contract logic prevents double-voting or vote modification.",
    },
    {
        q: "Which blockchain does DecentraPoll use?",
        a: "DecentraPoll is deployed on an EVM-compatible Layer 2 network for fast, low-cost transactions without sacrificing security.",
    },
];

/* FAQ Item */
const FAQItem = ({
    faq,
    index,
}: {
    faq: { q: string; a: string };
    index: number;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
        >
            <div
                onClick={() => setOpen(!open)}
                style={{
                    padding: "24px 28px",
                    borderRadius: 16,
                    background: open ? "rgba(99,102,241,0.12)" : "rgba(17,24,39,0.6)",
                    border: `1px solid ${open ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.15)"
                        }`,
                    cursor: "pointer",
                    transition: "background 0.3s, border 0.3s",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: "1rem" }}>{faq.q}</span>
                    <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            fontSize: "1.4rem",
                            color: "#6366f1",
                            flexShrink: 0,
                            display: "inline-block",
                        }}
                    >
                        +
                    </motion.span>
                </div>
                <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                >
                    <p
                        style={{
                            marginTop: 16,
                            color: "rgba(255,255,255,0.6)",
                            lineHeight: 1.7,
                            fontSize: "0.95rem",
                            margin: "16px 0 0",
                        }}
                    >
                        {faq.a}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* Animated background elements */
const AnimatedOrbs = () => (
    <>
        {[...Array(8)].map((_, i) => (
            <motion.div
                key={i}
                animate={{
                    y: [0, -60, 0],
                    x: [0, 30, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.25, 0.5, 0.25],
                }}
                transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                }}
                style={{
                    position: "fixed",
                    width: 300 + i * 50,
                    height: 300 + i * 50,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${i % 2 === 0
                            ? "rgba(99,102,241,0.22)"
                            : "rgba(20,184,166,0.22)"
                        }, transparent 70%)`,
                    top: `${(i * 13) % 100}%`,
                    left: `${(i * 17) % 100}%`,
                    filter: "blur(80px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
        ))}
    </>
);

const AnimatedGridLines = () => (
    <div
        style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `
        linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)
      `,
            backgroundSize: "50px 50px",
            pointerEvents: "none",
            zIndex: 0,
        }}
    />
);

/* Home page */
const Home = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
    const cubeY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at 20% 20%, #1e293b 0%, #0b1120 45%, #020617 100%)",
                color: "white",
                position: "relative",
                overflowX: "hidden",
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            <Navbar />
            <AnimatedOrbs />
            <AnimatedGridLines />

            {/* HERO */}
            <section
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 80,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        maxWidth: 1400,
                        margin: "0 auto",
                        padding: "60px 32px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 400,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Left copy */}
                    <motion.div
                        style={{ flex: 1, minWidth: 320, y: heroY, opacity: heroOpacity }}
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "8px 22px",
                                    borderRadius: 50,
                                    border: "1px solid rgba(99,102,241,0.4)",
                                    background: "rgba(99,102,241,0.1)",
                                    fontSize: "0.85rem",
                                    color: "#14b8a6",
                                    fontWeight: 700,
                                    marginBottom: 28,
                                    letterSpacing: "0.03em",
                                }}
                            >
                                🎓 Decentralized Student Polling Platform
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <GlitchText>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                style={{
                                    fontSize: "clamp(3rem, 7vw, 5.5rem)",
                                    fontWeight: 900,
                                    lineHeight: 1.05,
                                    margin: 0,
                                    background:
                                        "linear-gradient(135deg, #6366f1 0%, #14b8a6 50%, #a78bfa 100%)",
                                    backgroundSize: "200% 200%",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    animation: "gradientShift 4s ease infinite",
                                }}
                            >
                                DecentraPoll
                            </motion.h1>
                        </GlitchText>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            style={{
                                marginTop: 24,
                                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.75)",
                                maxWidth: 560,
                            }}
                        >
                            Admins craft polls with close-ended options.{" "}
                            <span
                                style={{
                                    background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontWeight: 700,
                                }}
                            >
                                Students vote securely. Results secured stored on blockchain.
                            </span>
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            style={{
                                marginTop: 40,
                                display: "flex",
                                gap: 16,
                                flexWrap: "wrap",
                            }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollTo("features")}
                                style={{
                                    borderRadius: 50,
                                    padding: "16px 42px",
                                    fontSize: "1.05rem",
                                    fontWeight: 700,
                                    border: "none",
                                    background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                                    color: "white",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 0 60px rgba(99,102,241,0.45), 0 10px 30px rgba(0,0,0,0.3)",
                                }}
                            >
                                Launch App →
                            </motion.button>


                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            style={{
                                marginTop: 48,
                                display: "flex",
                                gap: 28,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: "#14b8a6",
                                        boxShadow: "0 0 10px #14b8a6",
                                        display: "inline-block",
                                        animation: "livePulse 2s infinite",
                                    }}
                                />
                                <span style={{ fontSize: "0.85rem", opacity: 0.65 }}>
                                    Live on Mainnet
                                </span>
                            </div>
                            <span style={{ fontSize: "0.85rem", opacity: 0.65 }}>
                                👨‍💻 Developed by KeDevs
                            </span>
                            
                        </motion.div>
                    </motion.div>

                    {/* Right — 3D Cube */}
                    <motion.div
                        style={{ flex: 1, minWidth: 300, y: cubeY }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <BlockchainCube />
                    </motion.div>
                </div>
            </section>

            {/* STATS */}
            <section
                id="stats"
                style={{ padding: "80px 32px", position: "relative", zIndex: 1 }}
            >
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        display: "flex",
                        gap: 32,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.8 }}
                            whileHover={{ scale: 1.05, y: -6 }}
                            style={{
                                flex: "1 1 260px",
                                padding: "48px 32px",
                                borderRadius: 32,
                                background:
                                    "linear-gradient(145deg, rgba(17,24,39,0.85), rgba(15,23,42,0.85))",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                textAlign: "center",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                                cursor: "default",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                                }}
                            />
                            <div
                                style={{
                                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                                    fontWeight: 900,
                                    background: "linear-gradient(135deg, #6366f1, #14b8a6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    marginBottom: 12,
                                }}
                            >
                                <AnimatedCounter end={stat.value} duration={2.5} />
                            </div>
                            <div style={{ opacity: 0.65, fontSize: "1rem", fontWeight: 500 }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section
                id="features"
                style={{ padding: "80px 32px", position: "relative", zIndex: 1 }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            textAlign: "center",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 800,
                            marginBottom: 16,
                            background:
                                "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Why DecentraPoll?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            textAlign: "center",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "1.05rem",
                            maxWidth: 560,
                            margin: "0 auto 64px",
                            lineHeight: 1.7,
                        }}
                    >
                        Built for transparency, privacy and trust in educational
                        institutions worldwide.
                    </motion.p>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 30,
                        }}
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 30px 80px rgba(99,102,241,0.22)",
                                }}
                                style={{
                                    padding: "40px 32px",
                                    borderRadius: 24,
                                    background: "rgba(17,24,39,0.6)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(99,102,241,0.15)",
                                    cursor: "default",
                                    transition: "box-shadow 0.3s",
                                }}
                            >
                                <div style={{ fontSize: "2.8rem", marginBottom: 16 }}>
                                    {f.icon}
                                </div>
                                <h3
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "1.15rem",
                                        color: "#818cf8",
                                        margin: "0 0 12px",
                                    }}
                                >
                                    {f.title}
                                </h3>
                                <p
                                    style={{
                                        color: "rgba(255,255,255,0.6)",
                                        lineHeight: 1.75,
                                        margin: 0,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {f.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                id="how-it-works"
                style={{ padding: "80px 32px", position: "relative", zIndex: 1 }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            textAlign: "center",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 800,
                            marginBottom: 64,
                            background:
                                "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        How DecentraPoll Works
                    </motion.h2>

                    <div
                        style={{
                            display: "flex",
                            gap: 28,
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                style={{ flex: "1 1 280px", maxWidth: 360 }}
                            >
                                <div
                                    style={{
                                        padding: "40px 32px",
                                        borderRadius: 24,
                                        background:
                                            "linear-gradient(145deg, rgba(17,24,39,0.9), rgba(15,23,42,0.9))",
                                        border: "1px solid rgba(99,102,241,0.2)",
                                        height: "100%",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Watermark number */}
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 16,
                                            right: 20,
                                            fontSize: "4.5rem",
                                            fontWeight: 900,
                                            color: "rgba(99,102,241,0.07)",
                                            lineHeight: 1,
                                            pointerEvents: "none",
                                            userSelect: "none",
                                        }}
                                    >
                                        {step.number}
                                    </span>

                                    {/* Icon */}
                                    <div
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 18,
                                            background:
                                                "linear-gradient(135deg, rgba(99,102,241,0.28), rgba(20,184,166,0.28))",
                                            border: "1px solid rgba(99,102,241,0.3)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "2rem",
                                            marginBottom: 20,
                                        }}
                                    >
                                        {step.icon}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "0.72rem",
                                            fontWeight: 700,
                                            color: "#14b8a6",
                                            letterSpacing: "0.1em",
                                            marginBottom: 8,
                                        }}
                                    >
                                        STEP {step.number}
                                    </div>
                                    <h3
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "1.15rem",
                                            color: "white",
                                            margin: "0 0 12px",
                                        }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p
                                        style={{
                                            color: "rgba(255,255,255,0.6)",
                                            lineHeight: 1.75,
                                            margin: 0,
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section
                id="faq"
                style={{ padding: "80px 32px", position: "relative", zIndex: 1 }}
            >
                <div style={{ maxWidth: 780, margin: "0 auto" }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            textAlign: "center",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 800,
                            marginBottom: 56,
                            background:
                                "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} faq={faq} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Get Started Button */}
            <section
                style={{ padding: "80px 32px 120px", position: "relative", zIndex: 1 }}
            >
                <div style={{ maxWidth: 780, margin: "0 auto" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            padding: "72px 48px",
                            borderRadius: 40,
                            background:
                                "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(20,184,166,0.18))",
                            backdropFilter: "blur(30px)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* animated glow blob */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{
                                position: "absolute",
                                inset: -50,
                                background:
                                    "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)",
                                filter: "blur(40px)",
                                pointerEvents: "none",
                            }}
                        />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2
                                style={{
                                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                                    fontWeight: 800,
                                    margin: "0 0 16px",
                                }}
                            >
                                Ready to participate in polls?
                            </h2>
                            <p
                                style={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: "1.05rem",
                                    margin: "0 0 40px",
                                    lineHeight: 1.7,
                                }}
                            >
                                Join thousands of students voting on campus polls with complete
                                anonymity and blockchain-backed transparency.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    borderRadius: 50,
                                    padding: "18px 56px",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    border: "none",
                                    background: "white",
                                    color: "#020617",
                                    cursor: "pointer",
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                                }}
                            >
                                Get Started Now
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer
                style={{
                    borderTop: "1px solid rgba(99,102,241,0.15)",
                    padding: "40px 32px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.9rem",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div style={{ marginBottom: 10 }}>
                    <span
                        style={{
                            fontWeight: 800,
                            background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize: "1rem",
                        }}
                    >
                        DecentraPoll
                    </span>{" "}
                    — Decentralized Student Opinion Collection System
                </div>
                <div>
                    © {new Date().getFullYear()} DecentraPoll. All rights reserved.
                    Built on blockchain.
                </div>
            </footer>

            <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1;   box-shadow: 0 0 10px #14b8a6; }
          50%       { opacity: 0.4; box-shadow: 0 0 4px  #14b8a6; }
        }
      `}</style>
        </div>
    );
};

export default Home;
