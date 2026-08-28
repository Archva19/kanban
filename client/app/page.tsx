"use client";
import useFetchUser from "@/hooks/FetchUser/useFetchUser";

export default function Home() {
  const userData = useFetchUser();

  return (
  <>
    <h1>HomePage</h1>
  </>
  );
}
