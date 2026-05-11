"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button, Label } from "./styles";

type BackNavButtonProps = {
  fallbackHref: string;
};

export function BackNavButton({ fallbackHref }: BackNavButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <Button type="button" onClick={handleClick} aria-label="Voltar">
      <ArrowLeft size={22} strokeWidth={2} aria-hidden />
      <Label>Voltar</Label>
    </Button>
  );
}
