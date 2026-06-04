"use client";
import { Box, Modal, IconButton, Avatar, Typography } from "@mui/material";
import { X } from "phosphor-react";

function MemberModal({ member, open, onClose }) {
  if (!member) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "#FFFFFF",
          borderRadius: 4,
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          maxWidth: 600,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          outline: "none",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.1)",
            },
          }}
        >
          <X size={24} />
        </IconButton>

        {/* Header Section with Photo */}
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(100, 149, 237, 0.08) 0%, rgba(135, 206, 250, 0.12) 100%)",
            p: 4,
            pb: 6,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottom: "1px solid rgba(229, 231, 235, 0.6)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ p: "2px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(100, 149, 237, 0.6), rgba(135, 206, 250, 0.6))" }}>
              <Avatar
                src={member.photo}
                alt={member.name}
                sx={{
                  width: 100,
                  height: 100,
                  border: "3px solid #FFFFFF",
                }}
              >
                {member.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </Avatar>
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#111827",
                textAlign: "center",
              }}
            >
              {member.name}
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 4 }}>
          {/* Role Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#111827",
                mb: 2,
              }}
            >
              {member.title}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    color: "#6B7280",
                    minWidth: 120,
                  }}
                >
                  Department:
                </Typography>
                <Typography variant="body2" sx={{ color: "#111827", fontWeight: 600 }}>
                  {member.department}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    color: "#6B7280",
                    minWidth: 120,
                  }}
                >
                  Business Unit:
                </Typography>
                <Typography variant="body2" sx={{ color: "#111827", fontWeight: 600 }}>
                  {member.businessUnit}
                </Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </Modal>
  );
}

export default MemberModal;


