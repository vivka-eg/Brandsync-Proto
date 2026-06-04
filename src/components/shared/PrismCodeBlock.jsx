"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@mui/material/styles";

export default function PrismCodeBlock({ language, children, ...props }) {
  const theme = useTheme();
  return (
    <SyntaxHighlighter
      style={oneDark}
      language={language}
      PreTag="div"
      wrapLongLines
      customStyle={{
        borderRadius: 8,
        padding: "1rem",
        maxWidth: "100%",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        color: theme.palette.text.primary,
        background: theme.palette.background.paper,
      }}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  );
}
