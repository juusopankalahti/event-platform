import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Linkify from "react-linkify";
import ExportedImage from "next-image-export-optimizer";
import { KeyboardArrowRight } from "@mui/icons-material";

import RequestHandler from "@/helpers/RequestHandler";

import { Partner, User } from "@/types";
import { EventContext } from "@/context/EventContext";

const Lobby = () => {
  const context = useContext(EventContext);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [relevantUsers, setRelevantUsers] = useState<User[]>([]);

  const getPartners = async () => {
    const partners = await RequestHandler.get(`partners/${context.event?._id}`);
    setPartners(partners);
  };

  const getRelevantUsers = async () => {
    const relevantUsers = await RequestHandler.get(
      `people/${context.event?._id}/relevant`
    );
    setRelevantUsers(relevantUsers);
  };

  useEffect(() => {
    getPartners();
    getRelevantUsers();
  }, []);

  const renderCurrentProgram = () => {
    if (context.event?.currentProgram) {
      return (
        <Link
          href={{
            query: {
              page: "stage",
            },
          }}
        >
          <div className="bg-gradient-to-r from-wf-violet to-fuchsia-950 text-white py-6 px-5 md:py-6 md:px-6 rounded mt-4 lg:mt-6 flex items-start cursor-pointer">
            {context.event.currentProgram?.break ? (
              <div className="bg-fuchsia-950 font-bold px-2 py-1 rounded w-fit text-xs md:text-sm mr-4 mt-[1px]">
                Break
              </div>
            ) : (
              <div className="bg-fuchsia-950 text-white font-bold px-2 py-1 rounded w-fit text-xs md:text-sm mr-4 mt-[1px]">
                Live
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <h2 className="text-xl font-bold">
                {context.event.currentProgram?.name}
              </h2>
              {context.event.currentProgram?.description && (
                <p className="mt-2 text-sm">
                  <Linkify
                    componentDecorator={(
                      href: string,
                      text: string,
                      key: number
                    ) => (
                      <a
                        href={href}
                        key={key}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-white"
                      >
                        {text}
                      </a>
                    )}
                  >
                    {context.event.currentProgram?.description}
                  </Linkify>
                </p>
              )}
            </div>
            <KeyboardArrowRight className="mr-[-2px]" />
          </div>
        </Link>
      );
    }

    return (
      <div className="bg-gradient-to-r from-wf-violet to-fuchsia-950 py-6 px-8 rounded text-white mt-4 lg:mt-6">
        <h3 className="font-bold">You're nice and early!</h3>
        <p className="text-sm">
          The event hasn't started yet – go ahead and check the{" "}
          <Link
            className="underline"
            href={{
              query: {
                page: "people",
              },
            }}
          >
            people page
          </Link>{" "}
          for interesting connections and potential conversations.
        </p>
        <p className="text-sm">
          Also, make sure to fill in your personal details to be ready when the
          action starts!
        </p>
      </div>
    );
  };

  const renderRelevantUsers = () => {
    if (!relevantUsers || relevantUsers.length == 0) return null;
    return (
      <div className="mt-8">
        <h2 className="font-bold text-xl">People with similar interests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full mt-4">
          {relevantUsers.map((user) => (
            <Link
              href={{
                query: {
                  user: user._id,
                },
              }}
              key={user._id}
            >
              <div
                key={user._id}
                className="w-full shadow-sm border flex items-center bg-white rounded z-2 relative mr-4 py-6 px-6 hover:bg-wf-violet/10 cursor-pointer"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 mr-1 flex items-center justify-center">
                  {user.picture && (
                    <img
                      className="object-cover absolute top-0 left-0 w-full h-full"
                      src={user.picture}
                    />
                  )}
                  <p className="text-xs">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </p>
                </div>
                <div className="ml-4 flex-1 mr-8">
                  <h3 className="font-bold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-800 text-sm">
                    {user.title
                      ? `${user.title}, ${user.company}`
                      : `${user.company || ""}`}
                  </p>
                  {!!user.similarInterests && (
                    <div className="text-sm mt-1 text-wf-violet font-bold rounded">
                      {user.similarInterests} shared interest(s)
                    </div>
                  )}
                </div>
                <KeyboardArrowRight className="mr-[-4px]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderPartners = () => {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-xl">
          Making {context.event?.name} together with:
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 w-full mt-4 gap-2">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="outline-none h-28 lg:h-32 w-full flex-shrink-0 shadow-sm border flex items-center bg-white justify-center rounded z-2 relative mr-4 pointer-events-none select-none cursor-pointer"
            >
              <img
                className="h-auto w-20 lg:w-24 overflow-hidden object-cover rounded pointer-events-none"
                src={partner.logo}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 lg:py-4 lg:px-16 w-full flex-1 mb-[100px]">
      <div className="relative h-40 w-full rounded overflow-hidden flex flex-col justify-center p-8 text-white shadow-md">
        <ExportedImage
          src={"/networking-bg.jpg"}
          alt="WF banner"
          layout="fill"
          objectFit="cover"
          className="z0"
        />
        <div className="bg-black/20 absolute top-0 left-0 w-full h-full" />
        <h2 className="font-bold text-xl z-10">
          Hi, {context.user?.firstName} 👋
        </h2>
        <p className="z-10">{`Here's what's currently going on at ${context.event?.name}:`}</p>
      </div>
      {renderCurrentProgram()}
      {renderRelevantUsers()}
      {renderPartners()}
    </div>
  );
};

export default Lobby;
