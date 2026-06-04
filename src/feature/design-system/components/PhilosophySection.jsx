"use client";
import LazyImage from "@/components/shared/LazyImage";
import { getStrapiURL } from "@/strapi/utils";
import { Box, Stack, Typography } from "@mui/material";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

const Type = ({ title, description, asset }) => (
  <Stack
    direction="row"
    // spacing="24px"
    alignItems="flex-start"
    mb={4}
    sx={{
      gap: "24px",
      "@media (max-width: 600px)": { flexDirection: "column" },
    }}
  >
    <Box flexShrink={0} flex={1}>
      {getStrapiURL(asset) ? (
        <LazyImage
          src={getStrapiURL(asset)}
          alt={title}
          width={400}
          height={400}
          style={{ width: "100%", height: "auto" }}
        />
      ) : (
        <Box
          sx={{
            width: 100,
            height: 100,
            backgroundColor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            No Image
          </Typography>
        </Box>
      )}
    </Box>
    <Stack spacing={"12px"} flex={1}>
      <Typography
        variant="body2"
        fontWeight={700}
        color="text.primary"
        fontSize={20}
      >
        {title}
      </Typography>

      <MarkdownRenderer content={description} />
    </Stack>
  </Stack>
);

function PhilosophySection({ Section }) {
  if (!Section) {
    return null;
  }
  const { Title, Description, Subsection } = Section;
  return (
    <Stack spacing="64px">
      {/* content */}
      <Stack spacing="12px">
        {/* title */}
        <Typography
          variant="h6"
          fontWeight={600}
          color="text.primary"
          fontSize={24}
        >
          {Title}
        </Typography>

        {/* description */}
        {Description.split("\n").map((line, index) => (
          <Typography
            variant="body2"
            key={index}
            color="text.body"
            fontSize={16}
          >
            {line}
          </Typography>
        ))}
      </Stack>

      {/* subsection */}
      <Stack spacing="40px" mt={4}>
        {Subsection.map((item, index) => (
          <Type
            key={index}
            title={item.Title}
            description={item.Description}
            asset={item.Image}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default PhilosophySection;
