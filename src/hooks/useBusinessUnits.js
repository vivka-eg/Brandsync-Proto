"use client";
import { useState, useEffect } from "react";

export function useBusinessUnits() {
  const [businessUnits, setBusinessUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/business-units?pageSize=200")
      .then((res) => res.json())
      .then((result) => {
        if (result?.data) {
          setBusinessUnits(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { businessUnits, loading };
}
