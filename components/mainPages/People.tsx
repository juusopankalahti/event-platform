import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { KeyboardArrowRight, Search } from "@mui/icons-material";
import Link from "next/link";

import RequestHandler from "@/helpers/RequestHandler";

import Input from "@/components/Input";

import { User } from "@/types";
import { EventContext } from "@/context/EventContext";

const People = () => {
  const context = useContext(EventContext);

  const [users, setUsers] = useState<User[]>([]);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const page = useSearchParams().get("page");
  const [loading, setLoading] = useState(true);

  let searchTimeout: NodeJS.Timeout;

  const getPeople = async (fromScroll = false) => {
    if (!fromScroll) {
      setLoading(true);
      const people = await RequestHandler.get(
        `people/${context.event?._id}?search=${search}`
      );
      setUsers(people);
      setLoading(false);
    } else {
      const people = await RequestHandler.get(
        `people/${context.event?._id}?skip=${skip}`
      );
      setUsers([...users, ...people]);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [users]);

  useEffect(() => {
    getPeople(true);
  }, [skip]);

  useEffect(() => {
    getPeople();
  }, [search]);

  const handleScroll = () => {
    if (users.length == 0 || !!search) return;
    if (
      window.innerHeight + Math.round(window.scrollY) >=
      document.body.offsetHeight
    ) {
      setSkip(users.length);
    }
  };

  const onSearchChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setLoading(true);
    searchTimeout = setTimeout(() => {
      setSearch(e.target.value);
    }, 2000);
  };

  const renderUser = (user: User) => (
    <Link
      href={{
        query: {
          page,
          user: user._id,
        },
      }}
      key={user._id}
    >
      <div
        key={user._id}
        className="flex items-center p-2 cursor-pointer hover:bg-wf-violet/10 rounded"
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 mr-4 flex items-center justify-center">
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
        <div className="flex flex-col items-start md:flex-row md:items-center flex-1">
          <div className="flex-1">
            <h3 className="font-bold text-sm lg:text-base">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-800 text-sm">
              {user.title
                ? `${user.title}, ${user.company}`
                : `${user.company || ""}`}
            </p>
          </div>
          {!!user.similarInterests && (
            <div className="text-xs mt-1.5 mb-1 md:mt-0 md:mb-0 md:mr-2 bg-wf-violet/20 text-wf-violet font-bold px-2 py-1 rounded">
              {user.similarInterests} shared interests
            </div>
          )}
        </div>
        <KeyboardArrowRight />
      </div>
    </Link>
  );

  return (
    <div className="px-4 lg:px-16 w-full flex-1 mb-[80px]">
      <div className="flex items-center mb-4">
        <Search className="mr-2" />
        <Input onChange={onSearchChanged} placeholder="Search for people..." />
      </div>
      {loading ? (
        <div className="w-full flex items-center mt-12 justify-center">
          <CircularProgress style={{ color: "#991b1b" }} />
        </div>
      ) : (
        <div className="flex flex-col divide-y w-full">
          {users.map(renderUser)}
        </div>
      )}
    </div>
  );
};

export default People;
