import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 6000);
  }, []);

  return (
    <div
      className="h-screen flex items-center justify-center
      bg-gradient-to-r from-[#004d1a] to-[#0073b3]"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2Icon className="size-10 animate-spin text-white" />

        <p className="text-white text-lg font-bold tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
