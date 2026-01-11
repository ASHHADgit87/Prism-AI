import { useParams } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";

export default function AuthPage() {
  const { pathname } = useParams();

  return (
    <main className="p-6 flex flex-col justify-center items-center h-screen bg-[#004d1a]">
      <AuthView
        pathname={pathname}
        classNames={{
          base: "bg-[#00391a] ring ring-[#006633] text-white placeholder-gray-300",
          footer: "bg-[#00391a] ring ring-[#006633] text-white",
        }}
      />
    </main>
  );
}
