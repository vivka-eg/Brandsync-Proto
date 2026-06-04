"use client";
import { CustomChip } from "@/constants";
import { getStrapiURL } from "@/strapi/utils";
import { CheckCircleOutlineOutlined, HighlightOff } from "@mui/icons-material";
import { Chip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import LazyImage from "@/components/shared/LazyImage";

// Section Component
const Section = ({ title, children, id, variant = "h5" }) => (
  <Stack spacing={"40px"} id={id}>
    {title && (
      <Typography variant={variant} color="text.primary">
        {title}
      </Typography>
    )}
    {children}
  </Stack>
);

const GuidelineSection = ({
  title,
  description,
  children,
  id,
  variant = "h5",
}) => (
  <Stack spacing={4} id={id}>
    <Stack spacing="12px">
      <Typography variant={variant} color="text.primary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.body">
          {description}
        </Typography>
      )}
    </Stack>
    {children}
  </Stack>
);

const DoAndDontCard = ({ Item, doItem }) => (
  <Box
    sx={{
      width: "50%",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      "@media (max-width: 600px)": {
        width: "100%",
        gap: "24px",
      },
    }}
  >
    <LazyImage
      src={getStrapiURL(Item.Image)}
      alt={doItem ? "Do" : "Don't"}
      width={100}
      height={100}
      style={{ width: "100%", height: "100%" }}
    />
    <Stack spacing="6px">
      <CustomChip variant={doItem ? "Do" : "Dont"} />
      <Typography variant="body2" color="text.secondary" fontSize={"16px"}>
        {Item.Description}
      </Typography>
    </Stack>
  </Box>
);

// Do and Don't Component
const DoAndDontSection = ({ doItem, dontItem }) => (
  <Stack
    direction="row"
    alignItems="start"
    sx={{
      gap: 2,
      "@media (max-width: 600px)": {
        flexDirection: "column",
      },
    }}
  >
    <DoAndDontCard Item={doItem} doItem />
    <DoAndDontCard Item={dontItem} />
  </Stack>
);

function Guidelines({ Guidelines }) {
  // const { GuidelineElement: GuidelineElements } = Guidelines;

  return (
    <Stack spacing={8}>
      {Guidelines.map(
        ({ Title, GuidelineElement: GuidelineElements }, index) => (
          <Section key={index} title={Title} id={Title}>
            <Stack spacing={8}>
              {GuidelineElements.map(
                ({ ElementTitle, Description, DoAndDont }, index) => (
                  <GuidelineSection
                    key={index}
                    title={ElementTitle}
                    description={Description}
                    id={ElementTitle}
                    variant="h6"
                  >
                    {DoAndDont.map(({ Do, Dont }, index) => (
                      <DoAndDontSection
                        key={index}
                        doItem={Do}
                        dontItem={Dont}
                      />
                    ))}
                  </GuidelineSection>
                )
              )}
            </Stack>
          </Section>
        )
      )}
    </Stack>
  );
}

export default Guidelines;
