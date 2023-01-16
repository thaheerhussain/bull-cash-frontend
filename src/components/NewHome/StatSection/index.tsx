import React from "react";

const StatSection = () => {
  return (
    <div>
      <div className="p-6 border border-primary-green-border rounded-xl mb-32 bg-card-green-bg-color ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 text-center ">
          <div className="flex flex-col justify-center items-center md:border-r border-secondary-green-border w-full">
            <div className="text-3xl md:text-4xl text-primary-green ">
              $49.7M
            </div>
            <div className="text-base md:text-lg text-primary-text ">
              RAISED CAPITAL
            </div>
          </div>
          <div className="flex flex-col justify-center items-center lg:border-r border-secondary-green-border w-full">
            <div className="text-3xl md:text-4xl text-primary-green ">150</div>
            <div className="text-base md:text-lg text-primary-text ">
              IDEAS FUNDED
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:border-r border-secondary-green-border w-full">
            <div className="text-3xl md:text-4xl text-primary-green ">
              $400M
            </div>
            <div className="text-base md:text-lg text-primary-text ">
              PROJECTS MKT CAP
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <div className="text-3xl md:text-4xl text-primary-green ">
              22,900
            </div>
            <div className="text-base md:text-lg text-primary-text ">
              UNIQUE PARTICIPANTS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatSection;
