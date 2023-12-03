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
  return <div>{!session?.user ? <SignIn /> : <SignOut />}</div>;
};

const TopNav: React.FC = () => {
  return (
    <Container>
      <div className="flex h-16 w-full content-center items-center justify-between bg-gray-700 px-4">
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
              className="mt-1 inline-block px-4 py-2 font-medium text-white no-underline first:ml-4 hover:bg-white hover:text-gray-800"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <UserButtons />
      </div>
    </Container>
  );
};

export default TopNav;
