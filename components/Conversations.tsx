import { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { KeyboardArrowRight } from "@mui/icons-material";
import Link from "next/link";
import ExportedImage from "next-image-export-optimizer";
import { format } from "date-fns";

import Modal from "@/components/Modal";
import ChatView from "@/components/ChatView";

import { EventContext } from "@/context/EventContext";
import { AnotherUser } from "./UserView";

interface Props {
  open?: boolean;
}

const Conversations = (props: Props) => {
  const context = useContext(EventContext);
  const loadingConversations = context.loadingConversations;
  const [chatUser, setChatUser] = useState<AnotherUser | undefined>(undefined);

  useEffect(() => {
    context.getConversations && context.getConversations();
  }, []);

  if (loadingConversations) {
    return (
      <Modal open={props.open}>
        <div className="h-screen w-full flex items-center justify-center">
          <CircularProgress style={{ color: "#991b1b" }} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Conversations"
      description="Here are your active conversations with other users."
      open={props.open}
    >
      {(context.conversations || []).length == 0 ? (
        <div className="bg-gradient-to-r from-wf-violet to-fuchsia-950 py-6 px-8 rounded text-white mt-4 lg:mt-6 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-fit flex items-center justify-center md:justify-start mb-8 md:mb-0 md:mr-8">
            <ExportedImage
              src={"/nodata.svg"}
              height={120}
              width={120}
              alt="No data placeholder"
            />
          </div>
          <div>
            <h3 className="font-bold">No conversations to show!</h3>
            <p className="text-sm">
              You haven't started any conversations yet – go ahead and check the{" "}
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col divide-y w-full mt-4">
          {(context.conversations || []).map(
            ({ user, message, createdAt, unread }) => (
              <div
                key={user._id}
                className="flex items-center py-2 w-full cursor-pointer hover:bg-wf-violet/10 rounded"
                onClick={() => setChatUser(user)}
              >
                <div className="relative flex-shrink-0 h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full bg-gray-200 mr-4 flex items-center justify-center">
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
                <div className="flex flex-col items-start md:flex-row md:items-center flex-1 overflow-hidden">
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm lg:text-base">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p
                      className={`text-gray-800 text-sm ${
                        !!unread ? "font-bold" : ""
                      } whitespace-nowrap overflow-ellipsis`}
                    >
                      {message}
                    </p>
                  </div>
                </div>
                {!!unread && (
                  <div className="mr-0 ml-1 flex items-center justify-center flex-shrink-0 text-sm bg-wf-violet text-white h-6 w-6 rounded-full">
                    {unread}
                  </div>
                )}
                <div className="flex flex-col items-end text-xs mr-4 ml-4">
                  <p>{format(new Date(createdAt), "dd.MM.")}</p>
                  <p>{format(new Date(createdAt), "HH:mm")}</p>
                </div>
                <KeyboardArrowRight />
              </div>
            )
          )}
        </div>
      )}
      {chatUser && (
        <ChatView
          open={true}
          user={chatUser}
          onClose={() => {
            setChatUser(undefined);
            context.getConversations && context.getConversations();
          }}
        />
      )}
    </Modal>
  );
};

export default Conversations;
