import { Suspense } from "react";
import HomePage from "@/feature/icons";
import Loader from "@/components/shared/Loader";

export const metadata = {
  title: "Icons | EG Brandsync",
  description: "EG Brandsync Digital Assets — Icons",
};

function page() {
  return (
    <Suspense fallback={<Loader />}>
      <HomePage />
    </Suspense>
  );
}

export default page;