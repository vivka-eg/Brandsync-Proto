"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Typography,
  Link,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  List,
  ListItem,
  Divider,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import dynamic from "next/dynamic";
import LazyImage from "@/components/shared/LazyImage";

const PrismCodeBlock = dynamic(() => import("@/components/shared/PrismCodeBlock"), { ssr: false });
import { getSignedUrl } from "@/strapi/utils";

/**
 * Renders Markdown content using ReactMarkdown and custom components.
 *
 * @param {Object} props The component props.
 * @param {string} props.content The Markdown content to render.
 *
 * @returns {ReactElement} The rendered Markdown content.
 * @example
 * <MarkdownRenderer content="This is a **test**" />
 */
export default function MarkdownRenderer({ content }) {
  const theme = useTheme();

  function replaceSpaceTokens(markdown) {
    return markdown.replace(
      /\{\{space:(\d+)(px)?\}\}/g,
      (match, value, isPx) => {
        const pxValue = isPx ? `${value}px` : `${value * 8}px`;
        return `<div style="height:${pxValue};"></div>`;
      },
    );
  }

  const processedMarkdown = replaceSpaceTokens(content || "");

  return (
    <Box
      sx={{
        width: "100%",
        overflowWrap: "break-word",
        color: theme.palette.text.primary,
      }}
    >
      <ReactMarkdown
        children={processedMarkdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ node, ...props }) => {
            const notEnableModelImagesAltText = [
              "input fileds-usage-sidebar layout-chip.svg",
              "input fileds-usage-wide screen-colums1-chips.svg",
              "input fileds-usage-wide screen-colums2-chips.svg",
              "input fileds-usage-small screens-chip.svg",
              "usage-chip 1.svg",
              "usage-chip 2.svg",
              "usage-chip 3.svg",
              "avatar-usage-chip1.svg",
              "avatar-usage-chip2.svg",
              "avatar-usage-chip3.svg",
            ];

            const [url, setUrl] = useState(null);
            const [isLoading, setIsLoading] = useState(true);
            const [error, setError] = useState(false);

            useEffect(() => {
              if (!props.src) {
                setError(true);
                setIsLoading(false);
                return;
              }

              setIsLoading(true);
              setError(false);

              let isMounted = true;
              let timeoutIds = [];

              const fetchSignedUrl = async (retryCount = 0) => {
                try {
                  // console.log(
                  //   `Fetching signed URL for: ${props.src} (attempt ${
                  //     retryCount + 1
                  //   })`
                  // );
                  const signedUrl = await getSignedUrl(props.src);
                  // console.log(`Successfully fetched signed URL: ${signedUrl}`);
                  if (isMounted) {
                    setUrl(signedUrl);
                    setIsLoading(false);
                  }
                } catch (error) {
                  console.error(
                    `Error fetching signed URL (attempt ${retryCount + 1}):`,
                    error,
                  );

                  // Retry up to 2 times with exponential backoff
                  if (retryCount < 2 && isMounted) {
                    const timeoutId = setTimeout(
                      () => {
                        fetchSignedUrl(retryCount + 1);
                      },
                      Math.pow(2, retryCount) * 1000,
                    ); // 1s, 2s delays
                    timeoutIds.push(timeoutId);
                    return;
                  }

                  // Final fallback to original URL
                  if (isMounted) {
                    setError(true);
                    setIsLoading(false);
                    setUrl(props.src);
                  }
                }
              };

              fetchSignedUrl();

              // Cleanup function
              return () => {
                isMounted = false;
                timeoutIds.forEach((id) => clearTimeout(id));
              };
            }, [props.src]);

            if (isLoading) {
              return (
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: 200,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
              );
            }

            if (error || !url) {
              return (
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    width: "100%",
                    // mb: 2,
                    height: 200,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark" ? "grey.700" : "grey.300",
                  }}
                >
                  <span
                    style={{
                      color: theme.palette.mode === "dark" ? "#999" : "#666",
                      fontSize: "14px",
                    }}
                  >
                    Failed to load image
                  </span>
                </Box>
              );
            }

            return (
              <Box
                component="span"
                sx={{
                  display: "block",
                  width: "100%",
                  // mb: 2,
                }}
              >
                <LazyImage
                  src={url}
                  alt={props.alt || ""}
                  width={100}
                  height={100}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "4px",
                    display: "block",
                  }}
                  enableModal={!notEnableModelImagesAltText.includes(props.alt)}
                />
              </Box>
            );
          },
          h1: ({ node, ...props }) => (
            <Typography
              variant="h1"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "80px",
                lineHeight: "96px",
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "60px",
                lineHeight: "72px",
                fontWeight: "bold",
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "48px",
                lineHeight: "56px",
                fontWeight: "bold",
              }}
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "40px",
                lineHeight: "48px",
                fontWeight: "bold",
              }}
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "32px",
                lineHeight: "40px",
                fontWeight: "bold",
              }}
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <Typography
              variant="h6"
              {...props}
              sx={{
                color: theme.palette.text.primary,
                fontSize: "24px",
                lineHeight: "28px",
                fontWeight: "bold",
              }}
              // fontWeight={700}
            />
          ),
          p: ({ node, ...props }) => (
            <Typography
              sx={{
                wordBreak: "break-word",
                color: theme.palette.text.body,
              }}
              {...props}
            />
          ),
          strong: ({ children, ...props }) => (
            <Box
              component="strong"
              sx={{
                fontWeight: 700,
                color: "inherit",
                // py: 1,
                display: "inline-block",
              }}
              {...props}
            >
              {children}
            </Box>
          ),

          a: ({ href, children, ...props }) => (
            <Link
              href={href}
              // target="_blank"
              rel="noopener noreferrer"
              sx={{
                wordBreak: "break-word",
              }}
              {...props}
            >
              {children}
            </Link>
          ),
          ul: ({ node, ...props }) => (
            <List
              component="ul"
              dense
              sx={{
                color: theme.palette.text.body,
                listStyleType: "disc",
                pl: 2,
              }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <List
              component="ol"
              dense
              sx={{
                color: theme.palette.text.body,
                listStyleType: "decimal",
                pl: 2,
              }}
              {...props}
            />
          ),

          li: ({ node, ordered, ...props }) => (
            <ListItem
              component="li"
              sx={{
                display: "list-item",
                pl: 2,
                wordBreak: "break-word",
                color: theme.palette.text.body,
              }}
              {...props}
            />
          ),
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <Box sx={{ my: 2, maxWidth: "100%", overflowX: "auto" }}>
                  <PrismCodeBlock language={match[1]} {...props}>
                    {String(children).replace(/\n$/, "")}
                  </PrismCodeBlock>
                </Box>
              );
            }
            return (
              <Box
                component="code"
                sx={{
                  backgroundColor: theme.palette.action.hover,
                  px: 0.5,
                  py: 0.3,
                  borderRadius: 1,
                  fontFamily: "Monospace",
                  fontSize: "0.875rem",
                  wordBreak: "break-word",
                  color: theme.palette.text.body,
                }}
                {...props}
              >
                {children}
              </Box>
            );
          },
          blockquote: ({ children, ...props }) => (
            <Paper
              variant="outlined"
              sx={{
                borderLeft: 4,
                borderColor: "primary.main",
                pl: 2,
                my: 2,
                bgcolor: "action.hover",
                fontStyle: "italic",
                wordBreak: "break-word",
                color: theme.palette.text.body,
              }}
              {...props}
            >
              {children}
            </Paper>
          ),
          table: ({ children, ...props }) => (
            <Table
              size="small"
              sx={{
                my: 2,
                tableLayout: "auto",
                maxWidth: "100%",
                overflowX: "auto",
                color: theme.palette.text.body,
              }}
              {...props}
            >
              {children}
            </Table>
          ),
          thead: ({ children, ...props }) => (
            <TableHead {...props}>{children}</TableHead>
          ),
          tbody: ({ children, ...props }) => (
            <TableBody {...props}>{children}</TableBody>
          ),
          tr: ({ children, ...props }) => (
            <TableRow {...props}>{children}</TableRow>
          ),
          th: ({ children, ...props }) => (
            <TableCell
              sx={{
                fontWeight: "bold",
                bgcolor: "grey.100",
                color: theme.palette.text.primary,
              }}
              {...props}
            >
              {children}
            </TableCell>
          ),
          td: ({ children, ...props }) => (
            <TableCell sx={{ color: theme.palette.text.body }} {...props}>
              {children}
            </TableCell>
          ),
          hr: ({ ...props }) => <Divider sx={{ my: 3 }} {...props} />,
          s64: () => <Box sx={{ height: "64px" }}> </Box>,
          s56: () => <Box sx={{ height: "56px" }}> </Box>,
        }}
      />
    </Box>
  );
}
