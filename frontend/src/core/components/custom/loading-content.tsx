import { LoaderCircle } from "lucide-react";

export function LoadingContent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoaderCircle className="animate-spin w-16 h-16" />
    </div>
  );
}
