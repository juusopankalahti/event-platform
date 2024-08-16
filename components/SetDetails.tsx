import { RefObject, useContext, useEffect, useRef, useState } from "react";

import RequestHandler from "@/helpers/RequestHandler";

import Button from "@/components/Button";
import Fields, { CustomEvent, Field } from "@/components/Fields";
import InterestSelector from "@/components/InterestSelector";
import AvailabilitySelector from "@/components/AvailabilitySelector";
import { SomeUserDetails } from "@/components/EventPage";

import { EventContext } from "@/context/EventContext";
import { UserDetails } from "@/types";

interface Props {
  onSaveDetails: (details: SomeUserDetails) => void;
}

const SetDetails = (props: Props) => {
  const context = useContext(EventContext);

  const { onSaveDetails } = props;

  const [currentStage, setCurrentStage] = useState(0);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState<any>([]);
  const [selectedTimes, setSelectedTimes] = useState<any>([]);
  const [saving, setSaving] = useState(false);

  const container: RefObject<HTMLDivElement> = useRef(null);

  const stages = [
    {
      name: "Details",
    },
    {
      name: "Interests",
    },
    {
      name: "Availability",
    },
  ];

  const fields: Field[] = [
    {
      id: "picture",
      label: "Profile picture",
      type: "image",
    },
    {
      id: "firstName",
      label: "First name*",
    },
    {
      id: "lastName",
      label: "Last name*",
    },
    {
      id: "company",
      label: "Company name",
    },
    {
      id: "title",
      label: "Job title",
    },
    {
      id: "description",
      label: "About me",
      type: "textarea",
    },
    {
      id: "email",
      label: "E-mail address*",
    },
    {
      id: "phone",
      label: "Phone",
    },
    {
      id: "linkedin",
      label: "LinkedIn profile URL",
    },
    {
      id: "hidden",
      label: "Hide yourself from other users",
      description:
        "By activating this toggle, others in the event won't be able to see you.",
      type: "toggle",
    },
  ];

  const [values, setValues] = useState<UserDetails>(
    fields.reduce(
      (prev, val) => {
        const user = context.user;
        const map = {
          ...prev,
          [val.id]: user?.[val.id as keyof UserDetails],
        };
        return map;
      },
      {
        firstName: "",
        lastName: "",
        company: "",
        email: "",
      }
    )
  );

  const getInterests = async () => {
    const interests = await RequestHandler.get(
      `interests/${context.event?._id}`
    );
    setInterests(interests);
  };

  useEffect(() => {
    getInterests();
  }, []);

  const onInterestSelected = (interestId: string) => {
    const index = (selectedInterests || []).indexOf(interestId);
    const interests = [...(selectedInterests || [])];
    index == -1 ? interests.push(interestId) : interests.splice(index, 1);
    setSelectedInterests(interests);
  };

  const onTimeSelected = (time: string) => {
    const index = (selectedTimes || []).indexOf(time);
    const times = [...(selectedTimes || [])];
    index == -1 ? times.push(time) : times.splice(index, 1);
    setSelectedTimes(times);
  };

  const onTimesSelected = (times: string[]) => {
    setSelectedTimes(times);
  };

  const onInputChange = (e: CustomEvent) => {
    let value = e.target.value;
    setValues({
      ...values,
      [e.target.name || ""]: value,
    });
  };

  const renderContent = () => {
    switch (currentStage) {
      case 0:
        return (
          <>
            <h1 className="text-xl font-bold">
              Hi {context.user?.firstName}, and welcome to {context.event?.name}
              ! 👋
            </h1>
            <p className="text-gray-600 mt-1 mb-2 text-sm">
              {`Please fill in your personal details below. Once you're done, hit the 'Save details' button!`}
            </p>
            <div className="my-2 w-full">
              <Fields
                fields={fields}
                values={values}
                onInputChange={onInputChange}
              />
            </div>
            <Button
              className="mt-4 w-full text-center lg:w-fit"
              onClick={() => {
                setCurrentStage(currentStage + 1);
                container.current && container.current.scrollTo(0, 0);
              }}
            >
              Save details
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <h1 className="text-xl font-bold">Great job! 🎉</h1>
            <p className="text-gray-600 mt-1 mb-2 text-sm">
              {`Next, let's fill in your interests. Selecting your interests helps us connect you with other users in
              the event.`}
            </p>
            <div className="w-full mt-2">
              <InterestSelector
                interests={interests}
                values={selectedInterests}
                onInterestSelected={onInterestSelected}
              />
              <Button
                className="mt-6 w-full text-center lg:w-fit"
                onClick={() => {
                  setCurrentStage(currentStage + 1);
                  container.current && container.current.scrollTo(0, 0);
                }}
              >
                Save interests
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="text-xl font-bold">Almost there! 😎</h1>
            <p className="text-gray-600 mt-1 mb-2 text-sm">
              {`Lastly, please define your availability during the event. Other users can propose meetings on the times you mark yourself as
              available.`}
            </p>
            <div className="w-full mt-2">
              <AvailabilitySelector
                values={selectedTimes || []}
                onTimeSelected={onTimeSelected}
                onAllSelected={onTimesSelected}
              />
              <Button
                className="mt-6 w-full text-center lg:w-fit"
                loading={saving}
                onClick={() => {
                  setSaving(true);
                  onSaveDetails({
                    ...values,
                    interests: selectedInterests,
                    availableTimes: selectedTimes,
                  });
                }}
              >
                Save availability
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <main className="flex min-h-screen h-screen flex-col justify-stretch bg-wf-dark-violet p-4 lg:p-16">
      <div
        ref={container}
        className="px-8 py-16 lg:p-24 lg:pt-8 flex flex-col items-start w-full z-10 bg-white rounded h-full overflow-y-auto"
      >
        <div className="w-full flex flex-col items-center">
          <img
            src={context.event?.logo}
            className="w-40 lg:w-40 h-auto mb-16 lg:mt-8 rounded"
          />
        </div>
        <div className="flex items-center w-full mb-8">
          {stages.map((stage, i) => (
            <div
              className="flex-1 flex flex-col items-center justify-center relative"
              key={stage.name}
            >
              <div
                onClick={() => {
                  setCurrentStage(i);
                  container.current && container.current.scrollTo(0, 0);
                }}
                className={`rounded-full bg-gray-200 text-wf-violet w-8 h-8 flex items-center justify-center z-10 mb-2 cursor-pointer ${
                  currentStage == i ? "!text-white !bg-wf-violet" : ""
                }`}
              >
                {i + 1}
              </div>
              <div className="absolute h-[1px] w-full bg-gray-200 top-4 z-0" />
              <p className="text-xs">{stage.name}</p>
            </div>
          ))}
        </div>
        {renderContent()}
      </div>
    </main>
  );
};

export default SetDetails;
