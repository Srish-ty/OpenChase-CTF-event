"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Round1() {
  const router = useRouter();
  const { group } = router.query;

  useEffect(() => {
    if (!group) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [group]);

  return (
    <div>
      <h1>Welcome to Round 1!</h1>
      {group && <p>Your group is: {group}</p>}
      {/* Add your round-specific content here */}
    </div>
  );
}
