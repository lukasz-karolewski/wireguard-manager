import { clsx } from "clsx";
import Image from "next/image";

import { auth } from "~/auth";

import { SignIn, SignOut } from "./buttons-auth";
import Container from "./container";
import Link from "./link";

const links = [
  { name: "Clients", url: "/" },
  { name: "Sites", url: "/sites" },
  { name: "Settings", url: "/global-settings" },
  { name: "Users", url: "/users" },
];

const UserButtons: React.FC = async () => {
  const session = await auth();
  return (
    <>
      {session?.user ? (
        <div className="inline-flex items-center gap-4">
          {session.user.image && (
            <Image
              alt="avatar"
              className="hidden size-9 rounded-full ring-2 ring-white lg:block"
              height={36}
              src={session.user.image}
              width={36}
            />
          )}
          <SignOut variant={"secondary"} />
        </div>
      ) : (
        <SignIn />
      )}
    </>
  );
};

const TopNav: React.FC = () => {
  return (
    <div className="w-full bg-accent">
      <Container>
        <div className="flex h-16 w-full content-center items-center justify-between bg-accent shadow-md">
          <div className="flex items-center">
            <Link
              activeClassName=""
              className="text-2xl font-bold text-white no-underline hover:no-underline"
              href="/"
            >
              Wireguard Manager
            </Link>
          </div>

          <div className={clsx("flex grow items-center justify-start gap-2 p-4 text-black")}>
            {links.map((item) => (
              <Link
                className={clsx(
                  "px-4 py-2 font-medium text-white no-underline first:ml-4 hover:bg-gray-300/20",
                  "hidden md:block",
                )}
                href={item.url}
                key={item.url}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <UserButtons />
        </div>
      </Container>
    </div>
  );
};

export default TopNav;
