"use client";
import { useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import { zoomInView, withDelay } from "@/utils/animations";
import { captureEvent } from "@/lib/analytics/posthog";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const BASE = "/figma-kit/landing/Section%205(CTA)";

export default function CTASection() {
  const woahRef = useRef(null);

  useEffect(() => {
    const el = woahRef.current;
    if (!el) return;

    // Start hidden
    gsap.set(el, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({ paused: true });

    // 1; Pop in
    tl.to(el, { opacity: 1, scale: 1.15, duration: 0.4, ease: "power3.out" })
      .to(el, { scale: 1, duration: 0.25, ease: "power2.in" })

    // 2; Float up/down continuously
      .to(el, { y: -12, duration: 1.1, ease: "sine.inOut", repeat: -1, yoyo: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => { observer.disconnect(); tl.kill(); };
  }, []);
  return (
    <Box sx={{ py: { xs: 6, md: 8, lg: 10 } }}>
      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          borderRadius: "16px",
          background: "linear-gradient(to right, #ffffff 35%, rgba(122,166,242,0.18) 60%, rgba(122,166,242,0.32) 100%)",
          boxShadow: "-2px 2px 16.3px 0 rgba(0,0,0,0.12)",
          overflow: "hidden",
          minHeight: { xs: "auto", md: "320px", lg: "350px" },
          "@media (min-width: 1596px)": { minHeight: "460px" },
        }}
      >
        {/* ── Left: Text ── */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: { xs: "16px", md: "20px", lg: "24px" },
            p: { xs: "36px 28px", md: "44px 36px", lg: "56px 48px" },
          }}
        >
          <MotionTypography
            component="h2"
            {...zoomInView}
            sx={{
              fontFamily: "Roboto",
              fontSize: { xs: "26px", sm: "30px", md: "34px", lg: "42px" },
              fontWeight: 700,
              lineHeight: "120%",
              color: "#000",
            }}
          >
            Start Designing with BrandSync
          </MotionTypography>

          <MotionTypography
            {...withDelay(zoomInView, 0.1)}
            sx={{
              fontFamily: "Roboto",
              fontSize: { xs: "14px", md: "15px", lg: "16px" },
              fontWeight: 400,
              lineHeight: "150%",
              color: "#4D535F",
              maxWidth: { xs: "100%", lg: "480px" },
            }}
          >
            Download the Figma UI kit and start building consistent product
            experiences with our ready-to-use components.
          </MotionTypography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              component="a"
              href="https://www.figma.com/design/zF98rGtaPpBjSc2PpPK5vo/EG-Brand-Sync-UI-Kit---v1.0?m=auto&node-id=7009-158749&t=C8HsxOYFCwqOGwCj-1"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              disableElevation
              onClick={() => captureEvent("figma_kit_downloaded", { source: "cta_section" })}
              sx={{
                px: 3, py: 1.5, fontSize: "0.95rem", fontWeight: 600,
                borderRadius: "8px", textTransform: "none",
                bgcolor: "#121212", color: "#fff",
                "&:hover": { bgcolor: "#000000" },
              }}
            >
              Get the Figma Kit
            </Button>
            <Button
              component={Link}
              href="/figma-kit/figma-plugins/brandsync-studio"
              variant="outlined"
              disableElevation
              sx={{
                px: 3, py: 1.5, fontSize: "0.95rem", fontWeight: 600,
                borderRadius: "8px", textTransform: "none",
                borderColor: "#121212", borderWidth: "1.5px",
                color: "#121212", bgcolor: "#ffffff",
                "&:hover": { borderWidth: "1.5px", borderColor: "#121212", bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              Explore Plugins
            </Button>
          </Box>
        </Box>

        {/* ── Right: Image mockup ── */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "transparent",
            minHeight: { xs: "280px", sm: "auto" },
          }}
        >
          {/* Frame 351; left sidebar panel */}
          <Box
            component="img"
            src={`${BASE}/Frame%20351.svg`}
            alt=""
            aria-hidden
            sx={{
              position: "absolute",
              top: { xs: "20px", md: "70px", lg: "135px" },
              left: { xs: "10px", md: "20px", lg: "50px" },
              width: { xs: "80%", md: "95%", lg: "105%" },
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
              zIndex: 2,
              "@media (max-width: 1595px)": { top: "95px", left: "20px", width: "110%" },
            }}
          />

          {/* Frame 355; "WOAHH!!" badge, wavy GSAP motion */}
          <Box
            ref={woahRef}
            aria-hidden
            sx={{
              position: "absolute",
              top: { xs: "60px", md: "120px", lg: "190px" },
              left: { xs: "38%", md: "40%", lg: "43%" },
              width: "20%",
              zIndex: 3,
              "@media (max-width: 1595px)": { top: "160px", left: "42%" },
            }}
          >
            <svg width="100%" viewBox="0 0 131 84" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.1307 27.9385L14.8125 5.93848L33.8125 16.9385L24.3125 19.4769L19.1307 27.9385Z" fill="#3D53FF"/>
              <path d="M15.3135 5.07324L34.3135 16.0732L36.4014 17.2822L34.0703 17.9043L24.9561 20.3398L19.9834 28.4609L18.6436 30.6484L18.1494 28.1309L13.8311 6.13086L13.4072 3.96875L15.3135 5.07324Z" stroke="white" strokeWidth="2" strokeLinecap="square"/>
              <path d="M30.8125 25.9385H104.812C111.44 25.9385 116.812 31.3111 116.812 37.9385V47.9385C116.812 54.5659 111.44 59.9385 104.812 59.9385H42.8125C36.1851 59.9385 30.8125 54.5659 30.8125 47.9385V25.9385Z" fill="#3D53FF"/>
              <path d="M104.812 24.9385C111.992 24.9385 117.812 30.7588 117.812 37.9385V47.9385C117.812 55.1182 111.992 60.9385 104.812 60.9385H42.8125C35.6328 60.9385 29.8125 55.1182 29.8125 47.9385V24.9385H104.812Z" stroke="white" strokeWidth="2" strokeLinecap="square"/>
              <path d="M40.8984 47.9385L39.6824 36.5785H41.3624L42.3064 46.5625H42.1144L43.2984 37.8585H44.7704L45.9544 46.5625H45.7624L46.7064 36.5785H48.3864L47.1704 47.9385H44.9784L43.8424 39.6185H44.2264L43.0904 47.9385H40.8984ZM53.6281 48.1945C52.7215 48.1945 51.9535 47.9651 51.3241 47.5065C50.7055 47.0478 50.2308 46.3758 49.9001 45.4905C49.5695 44.6051 49.4041 43.5331 49.4041 42.2745C49.4041 40.9945 49.5695 39.9118 49.9001 39.0265C50.2308 38.1411 50.7055 37.4691 51.3241 37.0105C51.9535 36.5518 52.7215 36.3225 53.6281 36.3225C54.5348 36.3225 55.3028 36.5518 55.9321 37.0105C56.5615 37.4691 57.0361 38.1411 57.3561 39.0265C57.6868 39.9118 57.8521 40.9945 57.8521 42.2745C57.8521 43.5331 57.6868 44.6051 57.3561 45.4905C57.0361 46.3758 56.5615 47.0478 55.9321 47.5065C55.3028 47.9651 54.5348 48.1945 53.6281 48.1945ZM53.6281 46.6265C54.1615 46.6265 54.6095 46.4665 54.9721 46.1465C55.3455 45.8265 55.6281 45.3411 55.8201 44.6905C56.0121 44.0398 56.1081 43.2345 56.1081 42.2745C56.1081 41.3145 56.0121 40.5091 55.8201 39.8585C55.6281 39.1971 55.3455 38.7065 54.9721 38.3865C54.6095 38.0558 54.1615 37.8905 53.6281 37.8905C53.0948 37.8905 52.6415 38.0558 52.2681 38.3865C51.9055 38.7065 51.6281 39.1971 51.4361 39.8585C51.2441 40.5091 51.1481 41.3145 51.1481 42.2745C51.1481 43.2345 51.2441 44.0398 51.4361 44.6905C51.6281 45.3411 51.9055 45.8265 52.2681 46.1465C52.6415 46.4665 53.0948 46.6265 53.6281 46.6265ZM58.8059 47.9385L62.1339 36.5785H64.3099L67.6379 47.9385H65.8939L63.2219 38.3225L60.5499 47.9385H58.8059ZM60.6619 44.9785L61.1739 43.4265H65.2699L65.7819 44.9785H60.6619ZM68.9116 47.9385V36.5785H70.5916V42.0505L69.8396 41.4425H75.7916L75.0396 42.0505V36.5785H76.7196V47.9385H75.0396V42.4025L75.7916 43.0105H69.8396L70.5916 42.4025V47.9385H68.9116ZM78.5054 47.9385V36.5785H80.1854V42.0505L79.4334 41.4425H85.3854L84.6334 42.0505V36.5785H86.3134V47.9385H84.6334V42.4025L85.3854 43.0105H79.4334L80.1854 42.4025V47.9385H78.5054ZM91.4591 44.4985C91.4271 44.1358 91.3898 43.7038 91.3471 43.2025C91.3045 42.7011 91.2671 42.1891 91.2351 41.6665C91.2031 41.1331 91.1871 40.6531 91.1871 40.2265V36.5785H92.8191V40.2265C92.8191 40.6531 92.8031 41.1331 92.7711 41.6665C92.7391 42.1891 92.7018 42.7011 92.6591 43.2025C92.6271 43.7038 92.5898 44.1358 92.5471 44.4985H91.4591ZM90.9151 47.9385V45.8265H93.0911V47.9385H90.9151ZM101.053 44.4985C101.021 44.1358 100.984 43.7038 100.941 43.2025C100.898 42.7011 100.861 42.1891 100.829 41.6665C100.797 41.1331 100.781 40.6531 100.781 40.2265V36.5785H102.413V40.2265C102.413 40.6531 102.397 41.1331 102.365 41.6665C102.333 42.1891 102.296 42.7011 102.253 43.2025C102.221 43.7038 102.184 44.1358 102.141 44.4985H101.053ZM100.509 47.9385V45.8265H102.685V47.9385H100.509Z" fill="white"/>
            </svg>
          </Box>
        </Box>
      </MotionBox>
    </Box>
  );
}
