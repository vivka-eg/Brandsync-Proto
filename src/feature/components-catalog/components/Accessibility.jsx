"use client";
import { CustomChip } from "@/constants";
import { getStrapiURL } from "@/strapi/utils";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import LazyImage from "@/components/shared/LazyImage";
import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import SyntaxHighlighter from "@/components/shared/SyntaxHighlight";
import CheckIcon from "@mui/icons-material/Check";

// Section Component
const AccessibilitySection = ({ title, description, children, id }) => (
  <Stack spacing="12px" id={id}>
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    <Stack spacing={"32px"}>
      {" "}
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
      {children}
    </Stack>
  </Stack>
);

const Section = ({ title, children, id }) => (
  <Stack spacing={"40px"} id={id}>
    <Typography variant="h5" color="text.primary">
      {title}
    </Typography>
    {children}
  </Stack>
);

function ThemedCodeBlock({ code }) {
  const theme = useTheme();

  return (
    <SyntaxHighlighter
      language="javascript"
      customStyle={{
        backgroundColor: theme.palette.neutral.light,
        borderRadius: 8,
        padding: "16px",
        fontSize: 14,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontFamily: "inherit",
        color: theme.palette.mode == "dark" ? "#fff" : "#000",
      }}
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
}

const CodeSnippetCard = ({ codeString, fileType, doItem }) => {
  const [copied, setCopied] = useState(false);
  const CurrentIcon = copied ? CheckIcon : ContentCopyIcon;
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "16px",
        backgroundColor: theme.palette.neutral.light,
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: theme.palette.neutral.light,
        }}
      >
        <Stack
          sx={{
            paddingBlock: 1,
            paddingInline: 2,
          }}
          justifyContent={"space-between"}
          alignItems={"center"}
          direction={"row"}
        >
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {fileType ? `${fileType.toLowerCase()}` : "-"}
          </Typography>
          {doItem && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CurrentIcon
                sx={{ height: "20px", width: "20px", cursor: "pointer" }}
                color={copied ? "success" : "action"}
                onClick={() => {
                  navigator.clipboard.writeText(codeString);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                {copied ? "Copied!" : "Copy"}
              </Typography>
            </Stack>
          )}
        </Stack>
        <Divider sx={{ backgroundColor: "divider" }} />
      </Box>
      {/* <SyntaxHighlighter
        language="javascript"
        wrapLongLines
        // style={dark}
        customStyle={{ backgroundColor: "inherit", padding: "16px" }}
      >
        {codeString}
      </SyntaxHighlighter> */}
      <Box
        sx={{
          height: "230px",
          overflow: "auto",
          position: "relative",
          "@media (max-width: 600px)": {
            height: "auto",
          },
        }}
      >
        <ThemedCodeBlock code={codeString} />
      </Box>
    </Box>
  );
};

const SingleAssetCard = ({ Item, isImage, doItem }) => {
  return (
    <Stack
      width={"50%"}
      sx={{
        "@media (max-width: 600px)": {
          width: "100%",
        },
        gap: "12px",
      }}
    >
      {isImage && (
        <LazyImage
          src={getStrapiURL(Item.Image)}
          alt={""}
          width={100}
          height={100}
          style={{ width: "100%", height: "auto" }}
        />
      )}
      {!isImage && (
        <CodeSnippetCard
          codeString={Item.CodeSnippet}
          fileType={Item.CodeExtension}
          doItem={doItem}
        />
      )}
      <Stack sx={{ gap: "6px" }}>
        <CustomChip variant={doItem ? "Do" : "Dont"} />
        <Typography variant="body2" color="text.secondary" fontSize={"16px"}>
          {Item.Description}
        </Typography>
      </Stack>
    </Stack>
  );
};

const MultiAssetCard = ({ Item, doItem }) => {
  const theme = useTheme();
  return (
    <Stack sx={{ "@media (max-width: 600px)": {}, gap: "12px" }}>
      <Stack>
        <Stack
          spacing={"12px"}
          sx={{ backgroundColor: "#F6F7F7" }}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={4}
        >
          {Item.CodeSnippet && (
            <Box sx={{ width: "50%" }}>
              <CodeSnippetCard
                codeString={Item.CodeSnippet}
                fileType={Item.CodeExtension}
              />
            </Box>
          )}
          {Item.Image && (
            <LazyImage
              src={getStrapiURL(Item.Image)}
              alt={""}
              width={100}
              height={100}
              style={{ width: "50%", height: "auto", flexGrow: 1 }}
            />
          )}
        </Stack>
      </Stack>
      <Stack spacing="6px">
        <CustomChip variant={doItem ? "Do" : "Dont"} />
        <Typography variant="body2" color="text.secondary" fontSize={"16px"}>
          {Item.Description}
        </Typography>
      </Stack>
    </Stack>
  );
};

// Do and Don't Component
const DoDontCard = ({ Item, doItem }) => {
  const isOnlyCodeSnippet = Item.CodeSnippet && !Item.Image;
  const isOnlyImage = Item.Image && !Item.CodeSnippet;
  const isBoth = Item.CodeSnippet && Item.Image;

  if (!isBoth) {
    return (
      <SingleAssetCard Item={Item} isImage={isOnlyImage} doItem={doItem} />
    );
  }

  return <MultiAssetCard Item={Item} doItem={doItem} />;
};

function Accessibility({ Accessibility }) {
  // return (
  //   // This is the main container for the Accessibility component
  //   <Stack spacing={6}>
  //     {Accessibility.map(({ Title, Description, DoAndDont }, index) => (
  //       <Section title={Title} description={Description} key={Title} id={Title}>
  //         {/* Do and Dont section */}
  //         <Stack spacing={4} sx={{ marginTop: 4 }}>
  //           {DoAndDont.map(({ Do, Dont }, index) => {
  //             const isBoth = Do.CodeSnippet && Do.Image;
  //             return (
  //               <Stack
  //                 key={index}
  //                 spacing={2}
  //                 direction={isBoth ? "column" : "row"}
  //               >
  //                 <DoDontCard Item={Do} doItem />
  //                 <DoDontCard Item={Dont} />
  //               </Stack>
  //             );
  //           })}
  //         </Stack>
  //       </Section>
  //     ))}
  //   </Stack>
  // );

  return (
    <Stack spacing={8}>
      {Accessibility.map(
        ({ Title, AccessiblityElement: AccessibilityElements }) => (
          <Section title={Title} key={Title} id={Title}>
            <Stack spacing={8}>
              {AccessibilityElements.map(
                ({ ElementTitle, Description, DoAndDont }, index) => (
                  <AccessibilitySection
                    title={ElementTitle}
                    description={Description}
                    key={ElementTitle}
                    id={ElementTitle}
                  >
                    {/* Do and Dont section */}
                    <Stack spacing={6} sx={{ marginTop: 4 }}>
                      {DoAndDont.map(({ Do, Dont }, index) => {
                        const isBoth = Do.CodeSnippet && Do.Image;
                        return (
                          <Stack
                            key={index}
                            direction={isBoth ? "column" : "row"}
                            sx={{
                              "@media (max-width: 600px)": {
                                flexDirection: "column",
                              },
                              gap: "16px",
                            }}
                          >
                            <DoDontCard Item={Do} doItem />
                            <DoDontCard Item={Dont} />
                          </Stack>
                        );
                      })}
                    </Stack>
                  </AccessibilitySection>
                )
              )}
            </Stack>
          </Section>
        )
      )}
    </Stack>
  );
}

export default Accessibility;
