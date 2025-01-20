import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { MdCreateNewFolder } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={75}
            height={78}
            className="rounded-lg bg-blend-normal flex justify-center"
          />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">
                  <MdCreateNewFolder
                    size={30}
                    className="text-black hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:translate-y-1"
                  />
                </span>
              </Link>
              <Link href="/legal">
                <span className="max-sm:hidden">
                  <GoLaw
                    size={30}
                    className="text-black hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:translate-y-1"
                  />
                </span>
              </Link>
              <Link href="/pitch">
                <span className="max-sm:hidden">
                  <FaMicrophone
                    size={30}
                    className="text-black hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:translate-y-1"
                  />
                </span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">
                    <GrLogout
                      size={40}
                      className="text-black hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:translate-y-1"
                    />
                  </span>
                </button>
              </form>
              <Link href={`/user/${session?.id}`}>
                <span>{session?.user.name}</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
