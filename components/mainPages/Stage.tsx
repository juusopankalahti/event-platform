import { useContext } from "react";
import { EventContext } from "@/context/EventContext";
import Linkify from "react-linkify";

const Stage = () => {
  const context = useContext(EventContext);

  const renderStream = () => {
    return (
      <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white flex items-center justify-center stream-height">
        {context.event?.currentProgram && context.event.streamUrl ? (
          <iframe
            title="VES Event Stream"
            src={context.event.streamUrl}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-sm">
            Nothing on the stage right now. Come back later!
          </p>
        )}
      </div>
    );
  };

  const renderProgramInformation = () => {
    if (!context.event?.currentProgram) {
      return (
        <div className="p-8 lg:p-16 flex items-center">
          <div className="bg-gray-200 font-bold px-2 py-1 rounded w-fit text-sm mr-4">
            Offline
          </div>
          <h2 className="text-xl">No live event.</h2>
        </div>
      );
    }

    return (
      <div className="p-6 md:p-8 lg:p-12 flex items-start">
        {context.event.currentProgram?.break ? (
          <div className="bg-gray-200 font-bold px-2 py-1 rounded w-fit text-sm mr-4 mt-[1px]">
            Break
          </div>
        ) : (
          <div className="bg-red-800 text-white font-bold px-2 py-1 rounded w-fit text-sm mr-4 mt-[1px]">
            Live
          </div>
        )}
        <div>
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
                    className="underline text-wf-violet"
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
      </div>
    );
  };

  return (
    <div className="w-full flex-1">
      {renderStream()}
      {renderProgramInformation()}
    </div>
  );
};

export default Stage;
