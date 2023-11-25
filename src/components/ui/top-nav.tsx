import clsx from "clsx";
import Container from "./container";
import Link from "./link";

const navLinksClassName = clsx(
  "z-20 mt-2 w-full grow gap-2 p-4 text-black md:mt-0 md:flex md:w-auto md:items-center md:bg-transparent md:p-0",
  "border-2 border-solid border-white md:border-0",
);

const links = [
  { name: "Clients", url: "/" },
  { name: "Servers", url: "/servers" },
  { name: "Global Settings", url: "/global-settings" },
  { name: "Status", url: "/status" },
];

const TopNav: React.FC = () => {
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
              Wireguard UI - s2s
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
