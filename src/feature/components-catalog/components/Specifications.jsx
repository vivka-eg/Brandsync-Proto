"use client";
import SpecificationCard from "./specifications/Specification";
import { useParams, useSearchParams } from "next/navigation";
import ChipsSpecification from "./specifications/ChipsSpecification";

function Specifications({ Specification }) {
  const params = useParams();
  const id = params?.id;

  if (id == "Chips") {
    return <ChipsSpecification Specification={Specification} />;
  }

  return <SpecificationCard Specification={Specification} />;
}

export default Specifications;
  
