import cn from "classnames";
import React, { useState } from "react";
import Container from "../Container";
import Link from "../Link";

const TopNav: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navLinksClassName = cn(
    "bg-primary w-full flex-grow md:flex md:items-center md:w-auto mt-2 md:mt-0 md:bg-transparent text-black p-4 md:p-0 z-20 gap-2",
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
