import clsx from "clsx";

import { auth } from "~/auth";
import { SignIn, SignOut } from "./buttons-auth";
import Container from "./container";
import Link from "./link";

const links = [
  { name: "Clients", url: "/" },
  { name: "Sites", url: "/sites" },
  { name: "Global Settings", url: "/global-settings" },
  // { name: "Status", url: "/status" },
];

const UserButtons: React.FC = async () => {
  const session = await auth();
  return (
    <>
      {!session?.user ? (
        <SignIn />
      ) : (
        <div className="inline-flex items-center gap-4">
          {session.user.image && (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-9 rounded-full ring-2 ring-white"
            />
          )}
          <SignOut variant={"secondary"} />
        </div>
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
              href="/"
              activeClassName=""
              className="text-2xl font-bold text-white no-underline hover:no-underline"
            >
              Wireguard UI - s2s
            </Link>
          </div>

          <div className={clsx("flex grow items-center justify-start gap-2 p-4 text-black")}>
            {links.map((item) => (
              <Link
                href={item.url}
                key={item.url}
                className="inline-block px-4 py-2 font-medium text-white no-underline first:ml-4 hover:bg-gray-300/20"
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
