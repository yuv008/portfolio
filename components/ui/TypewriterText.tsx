"use client";

import { useEffect, useState } from "react";

type TypewriterTextProps = {
  text: string;
  className?: string;
};

export function TypewriterText({ text, className = "" }: TypewriterTextProps) {
  const [value, setValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        if (!isDeleting && value.length < text.length) {
          setValue(text.slice(0, value.length + 1));
          return;
        }

        if (!isDeleting && value.length === text.length) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && value.length > 0) {
          setValue(text.slice(0, value.length - 1));
          return;
        }

        setIsDeleting(false);
      },
      !isDeleting && value.length === text.length ? 1800 : isDeleting ? 55 : 95,
    );

    return () => window.clearTimeout(timeout);
  }, [isDeleting, text, value]);

  return (
    <span aria-label={text} className={className}>
      {value}
      <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-px bg-neural-cyan align-middle cursor-blink" />
    </span>
  );
}
