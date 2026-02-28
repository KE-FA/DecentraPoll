import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountBalanceWallet,
  Logout,
  Person,
  MoreVert,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleConnectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setWalletConnected(true);
          console.log("Wallet connected:", address);
        }
      } else {
        alert(
          "MetaMask not detected! Please install MetaMask to connect your wallet."
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRegno");
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(11, 17, 32, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 900,
              background: "linear-gradient(90deg,#6366f1,#14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DecentraPoll
          </Typography>
        </Box>

        {/* Right Side Actions */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Connect Wallet Button */}
          {!walletConnected ? (
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<AccountBalanceWallet />}
                onClick={handleConnectWallet}
                sx={{
                  borderRadius: "15px",
                  px: 3,
                  py: 1,
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #6366f1, #14b8a6)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 30px rgba(99,102,241,0.6)",
                  },
                }}
              >
                Connect Wallet
              </Button>
            </MotionBox>
          ) : (
            <Chip
              icon={<AccountBalanceWallet />}
              label={formatAddress(walletAddress)}
              onClick={handleMenuOpen}
              sx={{
                background: "rgba(99, 102, 241, 0.2)",
                color: "#6366f1",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                fontWeight: "bold",
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(99, 102, 241, 0.3)",
                },
              }}
            />
          )}

          {/* Profile Menu */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: "white",
              background: "rgba(99, 102, 241, 0.2)",
              "&:hover": {
                background: "rgba(99, 102, 241, 0.3)",
              },
            }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: "rgba(17, 24, 39, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "15px",
                color: "white",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 1 }} fontSize="small" />
              Profile
            </MenuItem>
            {walletConnected && (
              <MenuItem onClick={handleDisconnectWallet}>
                <AccountBalanceWallet sx={{ mr: 1 }} fontSize="small" />
                Disconnect Wallet
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout} sx={{ color: "#f87171" }}>
              <Logout sx={{ mr: 1 }} fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
  }
}

export default DashboardNavbar;
