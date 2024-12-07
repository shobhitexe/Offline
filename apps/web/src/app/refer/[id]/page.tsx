"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackendURL } from "@/config/env";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [viewCounted, setViewCounted] = useState(false);

  useEffect(() => {
    if (!viewCounted) {
      fetch(`${BackendURL}/api/referral/update/views`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id: params.id }),
      }).then(() => {
        setViewCounted(true);
      });
    }

    localStorage.setItem("referId", params.id);
    router.push(`/auth/register?referId=${params.id}`);
  }, [params.id, router, viewCounted]);

  return <div className="min-h-screen"></div>;
}
