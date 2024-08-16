import { useContext } from "react";
import ExportedImage from "next-image-export-optimizer";
import Link from "next/link";
import { Popover } from "@headlessui/react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowDropDown,
  Business,
  Chat,
  Logout,
  Person,
} from "@mui/icons-material";

import { EventContext } from "@/context/EventContext";

interface Props {
  admin?: boolean;
  onLogout?: () => void;
}

const Header = (props: Props) => {
  const context = useContext(EventContext);

  const page = useSearchParams().get("page");
  const pageParam = page ? { page } : {};
  const pathname = usePathname();
  const currentQuery = page ? { page } : {};

  const renderDropdown = () => {
    return (
      <Popover className="relative outline-none">
        {() => (
          <>
            <Popover.Button className={`flex items-center outline-none`}>
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                {context.user?.picture && (
                  <img
                    className="object-cover absolute top-0 left-0 w-full h-full"
                    src={context.user?.picture}
                  />
                )}
                <p className="text-xs">
                  {context.user?.firstName[0]}
                  {context.user?.lastName[0]}
                </p>
              </div>
              <ArrowDropDown className="!h-4 mr-[-8px]" />
            </Popover.Button>
            <Popover.Overlay className="fixed inset-0 bg-black opacity-0" />
            <Popover.Panel className="absolute right-0 mt-3 w-44 z-30">
              <div className="overflow-hidden rounded-lg shadow-lg z-10 relative">
                <div className="relative flex flex-col justify-center bg-white px-3 py-2">
                  <Link
                    href={{
                      query: {
                        ...currentQuery,
                        edit: "details",
                      },
                    }}
                  >
                    <div className="flex items-center mb-1 hover:bg-gray-200 rounded p-1 cursor-pointer">
                      <Person />
                      <p className="text-sm ml-2">Personal details</p>
                    </div>
                  </Link>
                  {context.user?.partnerAdmin && (
                    <Link
                      href={{
                        query: {
                          ...currentQuery,
                          edit: "partner",
                        },
                      }}
                    >
                      <div className="flex items-center mb-1 hover:bg-gray-200 rounded p-1 cursor-pointer">
                        <Business />
                        <p className="text-sm ml-2">Company details</p>
                      </div>
                    </Link>
                  )}

                  <div
                    className="flex items-center mb-1 hover:bg-gray-200 rounded p-1 cursor-pointer"
                    onClick={props.onLogout}
                  >
                    <Logout />
                    <p className="text-sm ml-2">Log out</p>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    );
  };

  return (
    <nav className="w-full bg-white text-black flex items-center justify-between px-4 lg:px-8 py-6">
      <div className="flex items-center">
        <Link href={{ pathname, query: undefined }}>
          {context.event?.logo ? (
            <img
              src={context.event?.logo}
              style={{ height: 50, width: "auto", objectFit: "contain" }}
              className="rounded overflow-hidden"
            />
          ) : (
            <ExportedImage
              src={"/ves_logo_dark.svg"}
              height={80}
              width={80}
              alt="VES Logo"
            />
          )}
        </Link>
        {props.admin && <p className="ml-8">{context.event?.name}</p>}
      </div>
      <div className="flex items-center relative">
        {!props.admin && (
          <Link
            href={{
              query: {
                ...pageParam,
                view: "conversations",
              },
            }}
          >
            <div className="mr-6 text-gray-600 cursor-pointer relative">
              {!!context.unreadConversations && (
                <div className="absolute top-[-8px] right-[-10px] bg-wf-violet py-1 px-2 rounded-full text-white text-xs">
                  {context.unreadConversations}
                </div>
              )}
              <Chat />
            </div>
          </Link>
        )}
        {!props.admin && renderDropdown()}
        {props.admin && (
          <button onClick={props.onLogout} className="opacity-50">
            <Logout />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
