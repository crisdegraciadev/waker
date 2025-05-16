import type { PropsWithChildren } from "react";

export function CenteredLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-screen h-screen flex flex-col gap-6 items-center justify-center">
      {children}
    </div>
  );
}
