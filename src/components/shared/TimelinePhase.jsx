import { Stack, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

export default function TimelinePhase({
  date,
  title,
  description,
  features = [],
  isActive = false,
  isCompleted = false,
  isLast = false,
}) {
  const dotSx = {
    width: "18px",
    height: "18px",
    margin: "16px 0",
    ...(isCompleted
      ? { bgcolor: "success.main", border: "none", borderColor: "transparent", boxShadow: "none" }
      : isActive
        ? { bgcolor: "#1976D2", border: "none", borderColor: "transparent", boxShadow: "0 0 0 3px white" }
        : { bgcolor: "white", border: "2px solid", borderColor: "divider", boxShadow: "none" }),
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot sx={dotSx} />
        {!isLast && <TimelineConnector sx={{ bgcolor: "divider", width: "2px" }} />}
      </TimelineSeparator>
      <TimelineContent>
        <Stack
          gap={features.length > 0 ? 2.5 : 1.5}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            mb: 3,
          }}
        >
          <Stack gap={features.length > 0 ? 1 : 0.5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Typography
                variant="overline"
                color={isCompleted ? "success.main" : isActive ? "primary" : "text.secondary"}
                fontWeight={600}
                sx={{ fontSize: "0.7rem" }}
              >
                {date}
              </Typography>
              {isCompleted && (
                <Typography variant="caption" color="success.main" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  Completed
                </Typography>
              )}
            </Stack>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {title}
            </Typography>
          </Stack>

          {features.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          ) : (
            <Stack gap={1.5}>{features}</Stack>
          )}
        </Stack>
      </TimelineContent>
    </TimelineItem>
  );
}
