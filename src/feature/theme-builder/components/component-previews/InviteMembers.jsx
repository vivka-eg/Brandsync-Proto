"use client";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Paper,
  Radio,
} from "@mui/material";

const InviteMembers = ({ primaryColor }) => {
  const members = [
    { name: "Mark Alvarez", avatar: "/avatars/mark.jpg" },
    { name: "Melinda", avatar: "/avatars/melinda.jpg" },
  ];
  const accessMembers = [
    { name: "Leanne", avatar: "/avatars/leanne.jpg" },
    { name: "Emma", avatar: "/avatars/emma.jpg" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        // maxWidth: 360,
      }}
    >
      <Typography sx={{ fontSize: "0.875rem", color: "#6B7280", mb: 1 }}>
        Invite Members
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flex: 1,
            flexWrap: "wrap",
            p: 1,
            border: "1px solid #E5E7EB",
            borderRadius: 1.5,
            minHeight: 40,
          }}
        >
          {members.map((member, idx) => (
            <Chip
              key={idx}
              avatar={<Avatar src={member.avatar}>{member.name[0]}</Avatar>}
              label={member.name}
              onDelete={() => {}}
              size="small"
              sx={{ backgroundColor: "#F3F4F6" }}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: primaryColor,
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: 0.9,
            },
          }}
        >
          Invite
        </Button>
      </Box>

      <Typography sx={{ fontSize: "0.875rem", color: "#6B7280", mb: 1.5 }}>
        Members with access
      </Typography>
      {accessMembers.map((member, idx) => (
        <Box
          key={idx}
          sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
        >
          <Avatar src={member.avatar} sx={{ width: 32, height: 32 }}>
            {member.name[0]}
          </Avatar>
          <Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>
            {member.name}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default InviteMembers;
