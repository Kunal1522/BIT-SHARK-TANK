// page.server.tsx (Server Component)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PitchPage from "@/components/Pitchpage"

const Page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return <PitchPage />;
};

export default Page;
