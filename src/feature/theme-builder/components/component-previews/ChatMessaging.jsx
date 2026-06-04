"use client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
} from "@mui/material";
import { MoreVert, Send } from "@mui/icons-material";

const ChatMessaging = ({ primaryColor }) => {
  const messages = [
    { id: 1, text: "Hi there! How can I help you today?", sender: "other", time: "10:30 AM" },
    { id: 2, text: "I need help with setting up my account", sender: "user", time: "10:32 AM" },
    { id: 3, text: "Of course! I'd be happy to help you with that. What specifically would you like to know?", sender: "other", time: "10:33 AM" },
    { id: 4, text: "How do I change my password?", sender: "user", time: "10:35 AM" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 400,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: primaryColor }}>S</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>
            Support Team
          </Typography>
          <Typography component="span" sx={{ fontSize: "0.75rem", color: "#22C55E", display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#22C55E", display: "inline-block" }} />
            Online
          </Typography>
        </Box>
        <IconButton size="small">
          <MoreVert sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: "75%",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: msg.sender === "user" ? primaryColor : "#F3F4F6",
                color: msg.sender === "user" ? "#FFFFFF" : "#374151",
                borderBottomRightRadius: msg.sender === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.sender === "user" ? 16 : 4,
              }}
            >
              <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.4 }}>
                {msg.text}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: msg.sender === "user" ? "rgba(255,255,255,0.7)" : "#9CA3AF",
                  mt: 0.5,
                  textAlign: "right",
                }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: "1px solid #E5E7EB", display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#F9FAFB",
            },
          }}
        />
        <IconButton
          sx={{
            bgcolor: primaryColor,
            color: "#FFFFFF",
            "&:hover": { bgcolor: primaryColor, opacity: 0.9 },
          }}
        >
          <Send sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatMessaging;
