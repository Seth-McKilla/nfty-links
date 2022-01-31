import Link from "next/link";
import { useState, ElementType } from "react";
import {
  MdMenu,
  MdClose,
  MdDashboard,
  MdCreate,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import { FaStamp, FaCog } from "react-icons/fa";
import { Logo } from "..";

interface RouteLinkProps {
  Icon: ElementType;
  name: string;
  href: string;
  secondary?: boolean;
}

const secondaryStyles =
  "flex items-center justify-start w-full px-3 py-2 space-x-6 text-gray-400 rounded hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 md:w-52";

const RouteLink = ({ Icon, name, href, secondary }: RouteLinkProps) => (
  <Link href={href} passHref>
    <button
      className={
        secondary
          ? secondaryStyles
          : "flex items-center w-full space-x-6 text-white rounded jusitfy-start focus:outline-none focus:text-indigo-400"
      }
    >
      <Icon />
      <p className="text-base leading-4">{name}</p>
    </button>
  </Link>
);

const LogoLink = () => (
  <Link href="/" passHref>
    <a>
      <Logo height={75} />
    </a>
  </Link>
);

const nftLinks = [
  { name: "Create NFT", href: "/nfts/create", Icon: MdCreate },
  {
    name: "Created NFTs",
    href: "/nfts/created",
    Icon: MdOutlineDocumentScanner,
  },
  {
    name: "Minted NFTs",
    href: "/nfts/minted",
    Icon: FaStamp,
  },
];

const accountLinks = [
  { name: "Account Profile", href: "/account/profile", Icon: MdCreate },
  {
    name: "Account Settings",
    href: "/account/settings",
    Icon: FaCog,
  },
];

export default function SideNav() {
  let menuArray = [true, true];
  const [menu, setMenu] = useState<boolean[]>(menuArray);
  const [show, setShow] = useState<boolean>(true);

  const setMenuValue = (value: number) => {
    let newArr = [...menu];
    newArr[value] = !newArr[value];
    setMenu(newArr);
  };

  interface MenuDropdownProps {
    name: string;
    idx: number;
  }

  const MenuDropdown = ({ name, idx }: MenuDropdownProps) => (
    <button
      onClick={() => setMenuValue(idx)}
      className="flex items-center justify-between w-full py-5 text-white focus:outline-none focus:text-indigo-400 space-x-14 "
    >
      <p className="text-sm leading-5 uppercase">{name}</p>
      <svg
        id="icon1"
        className={`${menu[idx] ? "" : "rotate-180"} transform duration-100`}
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 15L12 9L6 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  return (
    <div className="fixed h-screen">
      <div className="flex items-center justify-between w-full p-4 bg-gray-900 rounded-r lg:hidden">
        <div className="flex items-center justify-between space-x-3">
          <LogoLink />
        </div>
        <div aria-label="toggler" className="flex items-center justify-center">
          <button
            aria-label="open"
            id="open"
            onClick={() => setShow(true)}
            className={`${
              show ? "hidden" : ""
            } focus:outline-none focus:ring-2`}
          >
            <MdMenu className="text-xl text-white" />
          </button>
          <button
            aria-label="close"
            id="close"
            onClick={() => setShow(false)}
            className={`${
              show ? "" : "hidden"
            } focus:outline-none focus:ring-2`}
          >
            <MdClose className="text-xl text-white" />
          </button>
        </div>
      </div>
      <div
        id="Main"
        className={`${
          show ? "translate-x-0" : "-translate-x-full"
        } lg:rounded-r transform  lg:translate-x-0  ease-in-out transition duration-500 flex justify-start items-start h-full  w-full bg-gray-900 flex-col`}
      >
        <div className="items-center justify-center hidden w-full p-4 space-x-3 lg:flex">
          <LogoLink />
        </div>
        <div className="flex flex-col items-center justify-start w-full pb-5 pl-4 mt-6 space-y-3 border-b border-gray-600">
          <RouteLink Icon={MdDashboard} name="Dashboard" href="/dashboard" />
        </div>

        {/* NFT Section */}
        <div className="flex flex-col items-center justify-start w-full px-6 border-b border-gray-600">
          <MenuDropdown name="NFTs" idx={0} />
          <div
            id="menu1"
            className={`${
              menu[0] ? "flex" : "hidden"
            } justify-start  flex-col w-full md:w-auto items-start pb-1`}
          >
            {nftLinks.map((props, idx) => (
              <RouteLink
                key={`${idx + 1}-${props.name}`}
                {...props}
                secondary={true}
              />
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="flex flex-col items-center justify-start w-full px-6 border-b border-gray-600">
          <MenuDropdown name="Account" idx={1} />
          <div className="flex flex-col items-start justify-start hidden pb-5">
            <button className="flex items-center justify-start w-full px-3 py-2 space-x-6 text-gray-400 rounded hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 md:w-52">
              <svg
                className="fill-stroke"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 10L11 14L17 20L21 4L3 11L7 13L9 19L12 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-base leading-4 ">Messages</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
