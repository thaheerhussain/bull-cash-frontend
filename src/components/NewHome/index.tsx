import React from "react";
import BannerSection from "./Banner";
import LearnAboutSection from "./LearnAboutSection";
import RecentPadSection from "./RecentPadSection";
import SignUpSection from "./SignUpSection";
import StatSection from "./StatSection";
import UpcomingPadSection from "./UpcomingPad";

const NewHome: React.FC = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-16 py-20 lg:py-28">
      <BannerSection />
      <StatSection />
      <UpcomingPadSection />
      <LearnAboutSection />
      <RecentPadSection />
      <SignUpSection />
    </div>
  );
};

export default NewHome;
