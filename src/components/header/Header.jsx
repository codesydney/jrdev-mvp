import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../img/logo.png";
import { useSession, signOut } from "next-auth/react";
import { signIn } from "next-auth/react";
import { sendError } from "next/dist/server/api-utils";

function Header() {
  const { data: session } = useSession();

  const [navIsVisible, setNavIsVisible] = useState(false);
  const handleClick = () => {
    setNavIsVisible(!navIsVisible);
  };
  return (
    <>
      {/* Tablet */}
      <div className="hidden sm:flex justify-between px-10 py-3 items-center">
        <Link className="flex gap-3 items-center" href="/">
          <Image src={Logo} alt="" className="h-[70px] w-[70px] " />
          <div className="">
            <h3 className=" text-2xl text-dark font-semibold">Jr-dev</h3>
            <p>Code.Sydeny</p>
          </div>
        </Link>
        <div className="flex gap-3 items-center ">
          <Link className=" text-black  text-lg" href="/">
            Home
          </Link>
          {session && (
            <Link
              className=" text-black  text-lg"
              href={`/dashboard/profile/${session?.user.id}`}
            >
              Dashboard
            </Link>
          )}

          <Link
            className="hidden text-primary font-semibold text-md"
            href="/about"
          >
            About Us
          </Link>
          <div className={session ? "hidden" : "flex gap-2"}>
            <Link
              className="border-[2px] m-auto rounded-full px-3 border-primary  text-lg"
              href="/signin"
            >
              Sign In
            </Link>
            <Link
              className="border-[2px] m-auto rounded-full bg-primary text-white border-primary px-3 text-lg"
              href="/signin"
            >
              Sign Up
            </Link>
          </div>
          <div
            className={
              session ? "flex flex-col-reverse items-center" : "hidden"
            }
          >
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                // localStorage.clear()

                // set 1 Jan, 1970 expiry for every cookies
                // for (var i = 0; i < Cookies.length; i++)
                //   document.cookie = Cookies[i] + '=;expires=' + new Date(0).toUTCString()
                // showCookies()
              }}
              className="bg-primary h-1/2 w-full rounded-b-xl flex-1 px-3 py-1 text-white hover:bg-dark transition-colors-[2sec]  text-center duration-300"
            >
              Log out
            </button>
            <div className="h-1/2 border-[1px] w-full border-dark px-3 py-1 rounded-t-xl text-white bg-primary font-semibold ">
              <h3>Hey {session && session.user.name}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <div className=" bg-primary w-screen h-[60px] flex items-center justify-between px-5">
          <Link className="flex gap-3 items-center" href="/">
            <Image src={Logo} alt="" className="h-[50px] w-[50px]" />
            <div className="">
              <h3 className="text-2xl text-white font-semibold">Jr-dev</h3>
              <p className="text-white">Code.Sydney</p>
            </div>
          </Link>
          <div onClick={handleClick} className="px-5 flex flex-col gap-[8px]">
            <div className="bg-white w-[40px] h-[4px] rounded-t-sm"></div>
            <div className="bg-white w-[40px] h-[4px]"></div>
            <div className="bg-white w-[40px] h-[4px] rounded-b-sm"></div>
          </div>
        </div>
        <div className={navIsVisible ? "flex items-end" : "hidden"}>
          <div className="border-[1.5px] shadow-lg border-t-0 border-primary z-10 absolute right-0 bg-white top-[60px]  justify-center items-center flex flex-col px-5 pt-6 rounded-bl-3xl pb-10 gap-3">
            <div className="px-3 py-1 font-semibold ">
              <h3>Hey: {session && session.user.name}</h3>
            </div>
            <Link className=" text-black text-lg" href="/">
              Home
            </Link>

            {session && (
              <Link
                className=" text-black text-lg"
                href={`/dashboard/profile/${session?.user.id}`}
              >
                Dashboard
              </Link>
            )}
            {session && (
              <button
                className="text-black text-lg"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              >
                Log out
              </button>
            )}

            <Link className="hidden text-black text-lg" href="/about">
              About Us
            </Link>

            <Link
              className={`border-[2px] shadow-lg my-auto rounded-full px-3 border-primary text-lg ${
                session ? "hidden" : ""
              }`}
              href="/signin"
            >
              Sign In
            </Link>
            <Link
              className={`border-[2px] shadow-lg my-auto rounded-full bg-primary text-white border-primary px-3 text-lg ${
                session ? "hidden" : ""
              }`}
              href="/signin"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
