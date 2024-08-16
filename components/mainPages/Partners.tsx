import { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import RequestHandler from "@/helpers/RequestHandler";

import { Partner, User } from "@/types";
import { EventContext } from "@/context/EventContext";

const Partners = () => {
  const context = useContext(EventContext);

  const [mainPartners, setMainPartners] = useState<Partner[]>([]);
  const [premiumPartners, setPremiumPartners] = useState<Partner[]>([]);
  const [basicPartners, setBasicPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const page = useSearchParams().get("page");

  const getPartners = async () => {
    setLoading(true);
    const partners = await RequestHandler.get(`partners/${context.event?._id}`);
    const mainPartners: Partner[] = [];
    const premiumPartners: Partner[] = [];
    const basicPartners: Partner[] = [];

    // Quick & dirty
    partners.forEach((partner: Partner) => {
      if (!partner.priority) {
        basicPartners.push(partner);
      } else if (partner.priority < 10) {
        mainPartners.push(partner);
      } else if (partner.priority >= 10 && partner.priority <= 99) {
        premiumPartners.push(partner);
      } else if (partner.priority > 99) {
        basicPartners.push(partner);
      }
    });
    setMainPartners(mainPartners);
    setPremiumPartners(premiumPartners);
    setBasicPartners(basicPartners);
    setLoading(false);
  };

  useEffect(() => {
    getPartners();
  }, []);

  const renderUsers = (partner: Partner) => {
    const users = (partner.users || []).filter((u: User) => !!u.partnerAdmin);
    return (
      <div className="flex mt-2">
        {users.slice(0, 5).map((u: User) => (
          <div
            key={u._id}
            className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200 mr-2 flex items-center justify-center"
          >
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
        ))}
        {users.length > 5 && (
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200 mr-2 flex items-center justify-center">
            <p className="text-xs">+{users.length - 5}</p>
          </div>
        )}
      </div>
    );
  };

  const renderPartnerSection = (title: string, partners: Partner[]) => {
    return (
      <>
        <h2 className="text-xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 w-full">
          {partners.map(renderPartner)}
        </div>
      </>
    );
  };

  const renderPartner = (partner: Partner) => (
    <Link
      href={{
        query: {
          page,
          partner: partner._id,
        },
      }}
      key={partner._id}
    >
      <div className="flex flex-col items-center cursor-pointer relative">
        <div
          className="w-[300px] h-[50px] bg-red-800 rounded z-0 absolute top-[120px] left-1/2"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg,#57254f,#6d2f64)",
          }}
        />
        <div className="h-36 w-60 shadow-sm border flex items-center bg-white justify-center rounded z-2 relative mb-12">
          <img
            className="h-auto w-32 overflow-hidden object-cover rounded"
            src={partner.logo}
          />
        </div>
        <div className="flex-1 text-center flex flex-col items-center z-10">
          <h2 className="font-bold text-xl">{partner.name}</h2>
          <p>{partner.slogan}</p>
          {renderUsers(partner)}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="px-4 lg:py-8 lg:px-16 w-full flex-1 flex flex-col mb-[90px]">
      {loading ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <CircularProgress style={{ color: "#991b1b" }} />
        </div>
      ) : (
        <div>
          {mainPartners.length > 0 &&
            renderPartnerSection("Main partners", mainPartners)}
          {premiumPartners.length > 0 &&
            renderPartnerSection("Premium partners", premiumPartners)}
          {basicPartners.length > 0 &&
            renderPartnerSection("Partners", basicPartners)}
        </div>
      )}
    </div>
  );
};

export default Partners;
