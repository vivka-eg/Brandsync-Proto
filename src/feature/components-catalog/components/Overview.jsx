"use client";
import React, { useEffect, useRef } from "react";
import { Box, Typography, Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { PaintBrush, Wheelchair } from "phosphor-react";
import { getStrapiURL } from "@/strapi/utils";
import LazyImage from "@/components/shared/LazyImage";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

// Section Component
const Section = ({ title, description, children, id }) => (
  <Stack spacing={"12px"} id={id}>
    {title && (
      <Typography variant="h5" color="text.primary">
        {title}
      </Typography>
    )}
    <Stack spacing={"32px"}>
      {description && description.trim() && (
        <MarkdownRenderer content={description} />
      )}
      {children}
    </Stack>
  </Stack>
);

// Type Component
const Type = ({ token, title, description, assetURL }) => (
  <Stack
    direction="row"
    // spacing={2}
    alignItems="flex-start"
    mb={4}
    sx={{
      gap: 2,
      "@media (max-width: 600px)": {
        flexDirection: "column",
        gap: "40px",
      },
    }}
  >
    <Box
      flexShrink={0}
      flex={1}
      sx={{ "@media (max-width: 600px)": { order: 1 } }}
    >
      {getStrapiURL(assetURL) ? (
        <LazyImage
          src={getStrapiURL(assetURL)}
          alt={title}
          width={100}
          height={100}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
    <Stack spacing={1} flex={1} marginLeft={0}>
      <Typography
        variant="caption"
        fontWeight={400}
        color="text.caption"
        fontSize={14}
      >
        {token}
      </Typography>
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>

      <Typography variant="body2" color="text.body" fontSize={16}>
        {description}
      </Typography>
    </Stack>
  </Stack>
);

// Main Overview Component
const Overview = ({ Overview }) => {
  if (!Overview) return null;

  const { Anatomy: AnatomyList, Type: Types, States } = Overview;

  return (
    <Stack spacing={8}>
      {/* Anatomy Section */}
      {AnatomyList && AnatomyList.length > 0 && (
        <Section title="Anatomy">
          {AnatomyList.map((Anatomy, index) => (
            <Section description={Anatomy?.Description || ""} key={index}>
              {getStrapiURL(Anatomy?.AnatomyImage) ? (
                <LazyImage
                  src={getStrapiURL(Anatomy?.AnatomyImage)}
                  alt="anatomy"
                  width={100}
                  height={100}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    backgroundColor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No Anatomy Image Available
                  </Typography>
                </Box>
              )}
            </Section>
          ))}
        </Section>
      )}

      {/* Types Section */}
      {Types &&
        Types.map((TypeElement, index) => (
          <Section
            title={TypeElement?.Title || "Types"}
            description={TypeElement?.Description || ""}
            id={"types"}
            key={index}
          >
            <Stack spacing={3} sx={{ marginTop: 4 }}>
              {(TypeElement?.TypeElements || []).map((type, index) => (
                <Type
                  key={index}
                  title={type.PrimaryTitle}
                  token={type.SecondaryTitle}
                  description={type.Decription}
                  assetURL={type.Image}
                />
              ))}
            </Stack>
          </Section>
        ))}

      {/* States */}
      {States && States.length > 0 && States.length == 1 && (
        <Section title="States">
          {States.map((State, index) => (
            <Section description={State?.Description || ""} key={index}>
              {getStrapiURL(State.Image) ? (
                <LazyImage
                  src={getStrapiURL(State.Image)}
                  alt="States"
                  width={100}
                  height={100}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    backgroundColor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No States Image Available
                  </Typography>
                </Box>
              )}
            </Section>
          ))}
        </Section>
      )}

      {/* States Section */}
      {States && States.length > 0 && States.length > 1 && (
        <Section title={"States"} description={""}>
          <Stack spacing={4} sx={{ marginTop: 4 }}>
            {(States || []).map((state, index) => (
              <Type
                key={index}
                token={state.PrimaryTitle}
                title={state.SecondaryTitle}
                description={state.Description}
                assetURL={state.Image}
              />
            ))}
          </Stack>
        </Section>
      )}

      {/* Resources Callout for SEO and Navigation */}
      <Box sx={{ pt: 4, pb: 4, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Additional Resources</Typography>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ mt: 0.5, color: "text.secondary" }}>
              <PaintBrush size={20} weight="duotone" />
            </Box>
            <Typography variant="body1">
              <strong>Designers:</strong> Ready to design? Grab the{" "}
              <Link href="/figma-kit" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Figma Components
              </Link>{" "}
              to use in your mockups.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ mt: 0.5, color: "text.secondary" }}>
              <Wheelchair size={20} weight="duotone" />
            </Box>
            <Typography variant="body1">
              <strong>Accessibility:</strong> Ensure your implementations are inclusive by reviewing our core{" "}
              <Link href="/design-system/accessibility" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Accessibility Principles
              </Link>.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Overview;
