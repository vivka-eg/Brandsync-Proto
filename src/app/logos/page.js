import LogosPage from "@/feature/logos";
import { Suspense } from "react";
import Loader from "@/components/shared/Loader";

export const metadata = {
  title: "Logos | EG Brandsync",
};

function page() {
  return (
    <Suspense fallback={<Loader />}>
      <LogosPage />
    </Suspense>
  );
}

export default page;
