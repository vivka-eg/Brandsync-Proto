import React from "react";
import { Card, CardContent, Stack, Skeleton } from "@mui/material";

/**
 * Loading skeleton for mobile logo cards
 */
const MobileLoadingSkeleton = () => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width="100%" height={80} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width={50} height={50} />
            <Skeleton variant="rectangular" width={70} height={50} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MobileLoadingSkeleton;
