"use client";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BreadcrumbsNav({ customPath = "" }) {
  const usePathNameVar = usePathname();
  const pathname = customPath || usePathNameVar;
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

        return isLast ? (
          <Typography fontWeight={700} color="text.primary">
            {segment}{" "}
          </Typography>
        ) : (
          <Typography color="text.primary">
            {" "}
            <Link
              href={path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {segment}
            </Link>{" "}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}
