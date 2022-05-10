import cn from "classnames";
import React, { useState } from "react";
import Container from "../Container";
import Link from "../Link";

const TopNav: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navLinksClassName = cn(
    "bg-primary w-full flex-grow md:flex md:items-center md:w-auto mt-2 md:mt-0 md:bg-transparent text-black p-4 md:p-0 z-20",
    "border-2 border-solid border-white md:border-0",
    {
      ["hidden"]: !showMenu,
    }
  );

  const links = [
    { name: "Clients", url: "/" },
    { name: "Server", url: "/servers" },
    { name: "Settings", url: "/settings" },
  ];

  return (
    <nav>
      <Container>
        <div className="flex items-center content-center justify-between h-16 bg-gray-700 px-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-white no-underline hover:no-underline md:text-3xl">
                Wireguard Manager
              </a>
            </Link>
          </div>

          <div className={navLinksClassName}>
            {links.map((item) => (
              <Link href={item.url} key={item.url}>
                <a className="inline-block px-4 py-2 font-medium text-white no-underline first:ml-4 mt-1 hover:text-gray-800">
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default TopNav;