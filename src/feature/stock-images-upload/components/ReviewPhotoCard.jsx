import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  LinearProgress,
} from "@mui/material";
import { CheckCircle, XCircle, CircleNotch } from "@phosphor-icons/react";

const getUploadStatusColor = (status) => {
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "uploading":
      return "primary";
    default:
      return "inherit";
  }
};

const getUploadStatusIcon = (status) => {
  switch (status) {
    case "success":
      return <CheckCircle size={20} weight="fill" color="#4caf50" />;
    case "error":
      return <XCircle size={20} weight="fill" color="#f44336" />;
    case "uploading":
      return <CircleNotch size={20} className="spin" color="#1976d2" />;
    default:
      return null;
  }
};

export default function ReviewPhotoCard({ file, metadata, progress, categories }) {
  const isCurrentlyUploading = progress?.status === "uploading";
  const isSuccess = progress?.status === "success";
  const isError = progress?.status === "error";

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "2px solid",
        borderColor: isSuccess
          ? "success.main"
          : isError
          ? "error.main"
          : isCurrentlyUploading
          ? "primary.main"
          : "divider",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease",
      }}
    >
      {(isCurrentlyUploading || isSuccess || isError) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: isSuccess
              ? "rgba(76, 175, 80, 0.1)"
              : isError
              ? "rgba(244, 67, 54, 0.1)"
              : "rgba(25, 118, 210, 0.1)",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              boxShadow: 2,
            }}
          >
            {getUploadStatusIcon(progress?.status)}
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 600,
                color: getUploadStatusColor(progress?.status) + ".main",
              }}
            >
              {isSuccess
                ? "Uploaded!"
                : isError
                ? "Failed"
                : "Uploading..."}
            </Typography>
            {isCurrentlyUploading && (
              <Typography variant="caption" color="text.secondary">
                {progress?.progress}%
              </Typography>
            )}
            {isError && progress?.error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 0.5, maxWidth: 150 }}
              >
                {progress.error.substring(0, 50)}
                {progress.error.length > 50 ? "..." : ""}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {isCurrentlyUploading && (
        <LinearProgress
          variant="determinate"
          value={progress?.progress || 0}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            zIndex: 2,
            bgcolor: "rgba(25, 118, 210, 0.15)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "primary.main",
            },
          }}
        />
      )}

      <CardMedia
        component="img"
        height="160"
        image={file.preview}
        alt={metadata?.title}
        sx={{
          objectFit: "cover",
          opacity: isCurrentlyUploading ? 0.7 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {metadata?.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1.5,
            minHeight: 40,
          }}
        >
          {metadata?.description}
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {Array.isArray(metadata?.category) && metadata.category.length > 0 ? (
            metadata.category.map((catId) => {
              const category = categories?.find((c) => c.id === catId);
              return (
                <Chip
                  key={catId}
                  label={category?.label || "Uncategorized"}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem", height: 24, mb: 0.5 }}
                />
              );
            })
          ) : null}
        </Stack>
        {metadata?.tags?.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {metadata?.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.65rem", height: 20, mr: 0.5, mb: 0.5 }}
              />
            ))}
            {metadata?.tags.length > 3 && (
              <Chip
                label={`+${metadata.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.65rem", height: 20 }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
