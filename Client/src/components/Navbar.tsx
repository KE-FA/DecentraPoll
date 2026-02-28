import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(2, 6, 23, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          DecentraPoll
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            color="inherit"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: "20px",
              px: 3,
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            Log In
          </Button>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
