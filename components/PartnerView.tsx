import { useContext, useEffect, useState } from "react";
import RequestHandler from "@/helpers/RequestHandler";
import { EventContext } from "@/context/EventContext";
import { useSearchParams } from "next/navigation";
import {
  Facebook,
  Instagram,
  KeyboardArrowRight,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import { formatLink } from "@/helpers/GeneralHelpers";
import { CircularProgress } from "@mui/material";
import Modal from "./Modal";
import UserView from "./UserView";
import { Material, Partner, User } from "@/types";

interface Props {
  open?: boolean;
}

const PartnerView = (props: Props) => {
  const context = useContext(EventContext);
  const partnerId = useSearchParams().get("partner");
  const [partner, setPartner] = useState<Partner | undefined>(undefined);
  const [shownUser, setShownUser] = useState<any>(undefined);
  const getPartner = async () => {
    if (!partnerId) return;
    const partner = await RequestHandler.get(
      `partners/${context.event?._id}/${partnerId}`
    );
    setPartner(partner);
    sendLogEvent(partner);
  };

  const sendLogEvent = async (partner: Partner) => {
    if (!partner) return;
    const _ = RequestHandler.post(`logs/booth-visited`, {
      event: context.event?._id,
      partner: partner._id,
    });
  };

  useEffect(() => {
    getPartner();
  }, []);

  const openMaterial = (material: Material) => {
    if (material.asEmbed) {
      return;
    }
    window.open(material.url || formatLink(material.link), "_blank");
  };

  if (!partner) {
    return (
      <Modal open={props.open}>
        <div className="h-screen w-full flex items-center justify-center">
          <CircularProgress style={{ color: "#991b1b" }} />
        </div>
      </Modal>
    );
  }
  return (
    <Modal open={props.open}>
      <div className="flex flex-col lg:flex-row items-center mb-8 lg:mb-16 mt-8">
        <div className="h-32 w-32 border-8 border-gray-50 p-2 flex items-center justify-center rounded">
          <img
            className="h-auto w-32 overflow-hidden object-contain rounded"
            src={partner.logo}
          />
        </div>
        <div className="mt-8 ml-0 lg:ml-8 lg:mt-0 flex-1 text-center lg:text-left">
          <h2 className="font-bold text-2xl">{partner.name}</h2>
          <p className="text-gray-400 font-semibold">{partner.slogan}</p>
          <p className="text-xs leading-5 mt-2 text-gray-600">
            {partner.description}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Website:{" "}
            <a
              href={formatLink(partner.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wf-violet underline"
            >
              {partner.website}
            </a>
          </p>
        </div>
        <div className="flex text-wf-violet mt-4 lg:mt-0 ml-0 lg:ml-4">
          {partner.linkedin && (
            <a
              href={formatLink(partner.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              {<LinkedIn className="!w-8 !h-8" />}
            </a>
          )}
          {partner.twitter && (
            <a
              href={formatLink(partner.twitter)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              {<Twitter className="!w-8 !h-8" />}
            </a>
          )}
          {partner.facebook && (
            <a
              href={formatLink(partner.facebook)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              {<Facebook className="!w-8 !h-8" />}
            </a>
          )}
          {partner.instagram && (
            <a
              href={formatLink(partner.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              {<Instagram className="!w-8 !h-8" />}
            </a>
          )}
        </div>
      </div>
      <div className="mb-12">
        <div className="mb-4">
          <h2 className="font-bold text-xl">People</h2>
          <p className="font-semibold text-sm text-gray-400">
            Got a question? We are here to help you.
          </p>
        </div>
        {(partner.users || [])
          .filter((u) => !!u.partnerAdmin)
          .map((u: User) => (
            <div
              key={u._id}
              className="flex mb-2 items-center cursor-pointer shadow-sm p-4 border rounded"
              onClick={() => setShownUser(u._id)}
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 mr-1 flex items-center justify-center">
                {u.picture && (
                  <img
                    className="object-cover absolute top-0 left-0 w-full h-full"
                    src={u.picture}
                  />
                )}
                <p className="text-xs">
                  {u.firstName[0]}
                  {u.lastName[0]}
                </p>
              </div>
              <div className="ml-2 flex-1">
                <h3 className="font-bold text-sm">
                  {u.firstName} {u.lastName}
                </h3>
                <p className="text-sm">{u.title}</p>
              </div>
              <KeyboardArrowRight />
            </div>
          ))}
      </div>
      <div>
        <div className="mb-4">
          <h2 className="font-bold text-xl">Materials</h2>
          <p className="font-semibold text-sm text-gray-400">
            Want to know more? Look no further, start here.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2">
          {(partner.materials || []).map((m: Material) => (
            <div
              key={m._id}
              className="flex w-full h-44 relative items-end justify-center cursor-pointer rounded border overflow-hidden shadow-sm"
              onClick={() => openMaterial(m)}
            >
              <img
                className="object-cover absolute top-0 left-0 h-full w-full z-0"
                src={m.thumbnailUrl}
              />
              <div className="bg-wf-violet w-full z-2 relative p-2 m-0 text-white text-xs flex items-center">
                <h3 className="font-bold flex-1">{m.name}</h3>
                <KeyboardArrowRight />
              </div>
            </div>
          ))}
        </div>
      </div>
      {shownUser && (
        <UserView
          userId={shownUser}
          open={true}
          onClose={() => setShownUser(undefined)}
        />
      )}
    </Modal>
  );
};

export default PartnerView;
