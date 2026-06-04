"use client";
import { Box, Card, CardContent, Avatar, Stack, Typography } from "@mui/material";

function MemberCard({ name, title, department, photo, onClick }) {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        minWidth: 300,
        maxWidth: 300,
        borderRadius: 3,
        position: "relative",
        background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
        border: "1px solid rgba(229,231,235,0.8)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
        backdropFilter: "saturate(140%) blur(6px)",
        transition: "transform .3s ease, box-shadow .3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box sx={{ p: "2px", borderRadius: "50%", background: "linear-gradient(135deg, #6AA2FF, #A78BFA)" }}>
            <Avatar src={photo} alt={name} sx={{ width: 56, height: 56 }}>
              {name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </Avatar>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#0F172A", lineHeight: 1.2 }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {title}
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: "#111827", mt: 0.75 }}>
              {department}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default MemberCard;


