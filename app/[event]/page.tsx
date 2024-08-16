"use client";
import { NextPage } from "next";
import EventPage from "@/components/EventPage";

const Home: NextPage = (props) => {
  return <EventPage {...props} />;
};

export default Home;
