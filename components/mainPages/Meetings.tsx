import { useContext, useEffect, useState } from "react";
import ExportedImage from "next-image-export-optimizer";
import { TimerOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Link from "next/link";

import RequestHandler from "@/helpers/RequestHandler";

import Button from "@/components/Button";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { Meeting } from "@/types";
import { EventContext } from "@/context/EventContext";

const Meetings = () => {
  const context = useContext(EventContext);

  const [waitingMeetings, setWaitingMeetings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [meetingToDecline, setMeetingToDecline] = useState<any>(undefined);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const getMeetings = async () => {
    setLoading(true);
    const meetings = await RequestHandler.get(`meetings/${context.event?._id}`);
    const waitingMeetings = meetings.filter(
      (meeting: Meeting) =>
        meeting.status == 0 && meeting.creator._id != context.user?._id
    );
    setWaitingMeetings(waitingMeetings);
    context.setWaitingMeetings &&
      context.setWaitingMeetings((waitingMeetings || []).length);
    const decidedMeetings = meetings.filter(
      (meeting: Meeting) =>
        meeting.status != 0 || meeting.creator._id == context.user?._id
    );
    setMeetings(decidedMeetings);
    setLoading(false);
  };

  const handleVisibilityChanged = () => {
    if (document.visibilityState == "visible") {
      getMeetings();
    }
  };

  useEffect(() => {
    getMeetings();
    document.addEventListener("visibilitychange", handleVisibilityChanged);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChanged);
  }, []);

  const acceptMeeting = async (meeting: Meeting) => {
    const _ = await RequestHandler.patch(`meetings/${meeting._id}`, {
      status: 1,
    });
    getMeetings();
  };

  const onDeclinePressed = (meeting: Meeting) => {
    setMeetingToDecline(meeting);
  };

  const declineMeeting = async (meeting: Meeting) => {
    setDeclineLoading(true);
    const _ = await RequestHandler.patch(`meetings/${meeting._id}`, {
      status: -1,
    });
    setDeclineLoading(false);
    setMeetingToDecline(undefined);
    getMeetings();
  };

  const renderWaitingMeetings = (meeting: Meeting) => {
    const user =
      meeting.creator._id == context.user?._id
        ? meeting.receiver
        : meeting.creator;
    return (
      <div
        key={meeting._id}
        className={`w-full shadow-sm border ${
          meeting.status == 0 && meeting.creator._id == context.user?._id
            ? "border-wf-violet/40 border-2 border-dashed"
            : ""
        } flex flex-col md:flex-row items-start md:items-center bg-white rounded z-2 relative mr-4 py-6 px-6`}
      >
        <div className="flex flex-col flex-1">
          <div className="flex flex-col md:flex-row md:items-center flex-1">
            <div className="mr-2 max-w-[100px]">
              <div className="font-bold text-sm mr-4">{meeting.time}</div>
              <div className="text-xs ">{meeting.location}</div>
            </div>
            <div className="flex mt-2 md:mt-0">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 mr-2 flex items-center justify-center">
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
              <div className="ml-2 flex-1">
                <h3 className="font-bold text-sm">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm">
                  {user.title
                    ? `${user.title}, ${user.company}`
                    : `${user.company || ""}`}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">{meeting.message}</p>
        </div>
        {meeting.status == 0 && meeting.creator._id == context.user?._id && (
          <div className="flex flex-col md:flex-row w-full md:ml-6 md:w-fit items-center">
            <div className="mt-4 w-full md:w-fit text-center md:mt-0 text-xs rounded bg-wf-violet/20 text-wf-violet px-3 py-2">
              <TimerOutlined className="!h-4 !w-4 mt-[-2px] mr-1" />
              Waiting for approval
            </div>
            <Button
              className="mt-2 md:mt-0 md:ml-4 w-full md:w-fit"
              onClick={() => onDeclinePressed(meeting)}
            >
              Cancel proposal
            </Button>
          </div>
        )}
        {meeting.status == 0 && meeting.creator._id != context.user?._id && (
          <div className="flex w-full md:w-fit flex-col md:flex-row items-stretch md:items-center justify-end ml-0 mt-4 lg:mt-0 lg:ml-8">
            <Button
              className="mb-2 md:mb-0 md:mr-2 !bg-wf-green"
              onClick={() => acceptMeeting(meeting)}
            >
              Accept
            </Button>
            <Button
              className="!bg-red-800"
              onClick={() => onDeclinePressed(meeting)}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderMeetings = (meeting: Meeting) => {
    return renderWaitingMeetings(meeting);
  };

  return (
    <div className="px-4 pb-8 lg:px-16 w-full flex-1 mb-16">
      {loading ? (
        <div className="w-full flex items-center mt-12 justify-center">
          <CircularProgress style={{ color: "#991b1b" }} />
        </div>
      ) : waitingMeetings.length == 0 && meetings.length == 0 ? (
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
            <h3 className="font-bold">No meetings to show!</h3>
            <p className="text-sm">
              You haven't booked any meetings yet – go ahead and check the{" "}
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
              for interesting connections and potential meetings.
            </p>
          </div>
        </div>
      ) : (
        <>
          {waitingMeetings.length > 0 && (
            <div className="bg-wf-violet px-6 py-6 rounded mb-8">
              <div className="mb-4">
                <h2 className="font-bold text-xl text-white">
                  Waiting for actions
                </h2>
                <p className="font-semibold text-sm text-white/80">
                  Here are the meeting proposals that are waiting for your
                  answer:
                </p>
              </div>
              <div className="flex flex-col w-full gap-4">
                {waitingMeetings.map(renderWaitingMeetings)}
              </div>
            </div>
          )}
          {meetings.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="font-bold text-xl">Your meetings</h2>
                <p className="font-semibold text-sm text-gray-400">
                  Here are your meetings for this event
                </p>
              </div>
              <div className="flex flex-col w-full gap-2">
                {meetings.map(renderMeetings)}
              </div>
            </div>
          )}
          <ConfirmationDialog
            title="Decline meeting"
            description="Are you sure you want to decline this meeting?"
            open={!!meetingToDecline}
            onConfirm={() => declineMeeting(meetingToDecline)}
            onClose={() => setMeetingToDecline(undefined)}
            loading={declineLoading}
            confirmText="Decline"
          />
        </>
      )}
    </div>
  );
};

export default Meetings;
