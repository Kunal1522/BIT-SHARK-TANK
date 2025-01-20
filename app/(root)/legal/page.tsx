import { auth } from "@/auth";
import StartupForm from "@/components/StartupForm";
import { redirect } from "next/navigation";
import LegalForm from "@/components/LegalForm";
const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");
  return (
    <>
      {" "}
      <LegalForm/>
    </>
  );
};

export default Page;
