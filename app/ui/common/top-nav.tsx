import clsx from "clsx";
import { useState } from "react";
import Container from "./container";
import Link from "./link";

const TopNav: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navLinksClassName = clsx(
    "bg-primary z-20 mt-2 w-full grow gap-2 p-4 text-black md:mt-0 md:flex md:w-auto md:items-center md:bg-transparent md:p-0",
    "border-2 border-solid border-white md:border-0",
    {
      ["hidden"]: !showMenu,
    },
  );

  const links = [
    { name: "Clients", url: "/" },
    { name: "Servers", url: "/servers" },
  ];

  return (
    <nav>
      <Container>
        <div className="flex h-16 content-center items-center justify-between bg-gray-700 px-4">
          <div className="flex items-center">
            <Link
              href="/"
              activeClassName=""
              className="text-2xl font-bold text-white no-underline hover:no-underline md:text-3xl"
            >
              Wireguard Site to Site Manager
            </Link>
          </div>

          <div className={navLinksClassName}>
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
        </div>
      </Container>
    </nav>
  );
};

export default TopNav;
