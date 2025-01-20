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
      <section className="pink_container min-h-[230px]">
        <h1 className="heading">Have doubts????</h1>
      </section>
      <LegalForm/>
    </>
  );
};

export default Page;
