import { useContext } from "react";
import {
  CalendarMonth,
  Edit,
  FileCopyOutlined,
  Handshake,
  Home,
  Interests,
  People,
  Schedule,
  Slideshow,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { EventContext } from "@/context/EventContext";

type FooterItem = {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
};

interface Props {
  admin?: boolean;
}

const Footer = (props: Props) => {
  const context = useContext(EventContext);

  const page = useSearchParams().get("page");
  const pathname = usePathname();

  const navItems: FooterItem[] = props.admin
    ? [
        {
          id: "details",
          label: "Details",
          path: "",
          icon: <Edit />,
        },
        {
          id: "interests",
          label: "Interests",
          path: "interests",
          icon: <Interests />,
        },
        {
          id: "users",
          label: "Users",
          path: "users",
          icon: <People />,
        },
        {
          id: "program",
          label: "Program",
          path: "program",
          icon: <Schedule />,
        },
        {
          id: "partners",
          label: "Partners",
          path: "partners",
          icon: <Handshake />,
        },
        {
          id: "materials",
          label: "Materials",
          path: "materials",
          icon: <FileCopyOutlined />,
        },
      ]
    : [
        {
          id: "home",
          label: "Lobby",
          path: "",
          icon: <Home />,
        },
        {
          id: "stage",
          label: "Stage",
          path: "stage",
          icon: <Slideshow />,
        },
        {
          id: "people",
          label: "People",
          path: "people",
          icon: <People />,
        },
        {
          id: "meetings",
          label: "Meetings",
          path: "meetings",
          icon: <CalendarMonth />,
        },
        {
          id: "exhibition",
          label: "Exhibition",
          path: "exhibition",
          icon: <Handshake />,
        },
      ];

  const renderNavItem = (item: FooterItem) => {
    return (
      <Link
        href={
          item.path == ""
            ? pathname
            : {
                query: {
                  page: item.path,
                },
              }
        }
        key={item.id}
        className="relative"
      >
        <li
          key={item.id}
          className={`relative flex bg-white flex-col xl:flex-row items-center justify-center font-bold cursor-pointer h-full opacity-60 ${
            (page || "") == item.path ? "!opacity-100" : ""
          }`}
        >
          {item.icon}
          <p className="text-xs md:text-sm mt-1 xl:mt-0 xl:ml-2">
            {item.label}
          </p>
        </li>
        {item.id == "meetings" && (context.waitingMeetings || 0) > 0 && (
          <div className="absolute font-bold top-[6px] xl:top-[8px] left-1/2 xl:left-2/3 w-6 h-6 flex items-center justify-center bg-wf-violet rounded-full text-xs text-white">
            {context.waitingMeetings}
          </div>
        )}
        {item.id == "stage" &&
          context.event?.currentProgram &&
          !context.event?.currentProgram?.break && (
            <div className="absolute font-bold top-[7px] xl:top-[14px] left-1/2 xl:left-1/2 xl:ml-10 py-0.5 px-1.5 flex items-center justify-center bg-red-800 rounded text-xs text-white">
              Live
            </div>
          )}
      </Link>
    );
  };

  return (
    <footer className="w-full h-[70px] border-t-[1px] fixed bottom-0 bg-white z-30">
      <ul
        className={`grid ${
          props.admin ? "grid-cols-6" : "grid-cols-5"
        } divide-x gap-0.5 w-full h-full`}
      >
        {navItems.map(renderNavItem)}
      </ul>
    </footer>
  );
};

export default Footer;
