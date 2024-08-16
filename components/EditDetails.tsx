import { ChangeEvent, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tab } from "@headlessui/react";

import RequestHandler from "@/helpers/RequestHandler";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Fields, { CustomEvent, Field } from "@/components/Fields";
import InterestSelector from "@/components/InterestSelector";
import AvailabilitySelector from "@/components/AvailabilitySelector";

import { EventContext } from "@/context/EventContext";
import { Interest, UserDetails } from "@/types";
import { classNames } from "@/helpers/GeneralHelpers";

interface Props {
  onSaveDetails: (details: UserDetails) => void;
  onSaveInterests: (interestIds: string[]) => void;
  onSaveAvailabilities: (times: string[]) => void;
  open?: boolean;
}

const EditDetails = (props: Props) => {
  const context = useContext(EventContext);

  const { onSaveDetails, onSaveInterests, onSaveAvailabilities, open } = props;

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [selectedTab, setSelectedTab] = useState(0);
  const [interests, setInterests] = useState<Interest[]>([]);

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

  const [selectedInterests, setSelectedInterests] = useState(
    context.user?.interests || []
  );
  const [selectedTimes, setSelectedTimes] = useState(
    context.user?.availableTimes || []
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

  const onInputChange = (e: CustomEvent) => {
    let value = e.target?.value;
    setValues({
      ...values,
      [e.target.name || ""]: value,
    });
  };

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

  const closeModal = () => {
    const page = params.get("page");
    const query = page ? `?page=${page}` : "";
    router.push(`${pathname}${query}`);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            <Fields
              fields={fields}
              onInputChange={onInputChange}
              values={values}
            />
            <Button
              className="mt-6 w-full text-center lg:w-fit"
              onClick={() => {
                onSaveDetails(values);
                closeModal();
              }}
            >
              Save details
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <p className="text-gray-600 mt-1 text-sm mb-4">
              Selecting your interests helps us connect you with other users in
              the event.
            </p>
            <InterestSelector
              interests={interests}
              values={selectedInterests || []}
              onInterestSelected={onInterestSelected}
            />
            <Button
              className="mt-6 w-full text-center lg:w-fit"
              onClick={() => {
                onSaveInterests(selectedInterests);
                closeModal();
              }}
            >
              Save interests
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <p className="text-gray-600 mt-1 text-sm mb-4">
              Other users can propose meetings on the times you mark yourself as
              available.
            </p>
            <AvailabilitySelector
              values={selectedTimes || []}
              onTimeSelected={onTimeSelected}
              onAllSelected={onTimesSelected}
            />
            <Button
              className="mt-6 w-full text-center lg:w-fit"
              onClick={() => {
                onSaveAvailabilities(selectedTimes);
                closeModal();
              }}
            >
              Save availability
            </Button>
          </>
        );
    }
  };

  return (
    <Modal
      title="Edit personal details"
      description={`Please fill in your personal details below.`}
      open={open}
    >
      <div className="my-2 w-full">
        <div className="mt-2 mb-4 w-full lg:w-fit max-w-full">
          <Tab.Group
            onChange={(index) => {
              setSelectedTab(index);
            }}
          >
            <Tab.List className="flex space-x-1 rounded-xl bg-wf-violet/20 p-1 w-full overflow-hidden">
              {["Details", "Interests", "Availability"].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "rounded-lg py-2 w-full lg:w-fit px-4 lg:px-8 text-sm font-medium leading-5 text-wf-violet outline-none",
                      selected ? "bg-white shadow" : "text-wf-violet/50"
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        {renderContent()}
      </div>
    </Modal>
  );
};

export default EditDetails;
