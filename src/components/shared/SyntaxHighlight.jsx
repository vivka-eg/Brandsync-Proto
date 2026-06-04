"use client";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("javascript", javascript);

export default SyntaxHighlighter;
