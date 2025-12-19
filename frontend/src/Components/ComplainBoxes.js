import React from "react";
import { profession } from "../Helper/Profession";
import ComplainBox from "./ComplainBox";

const ComplainBoxes = (props) => {
  return (
    <>
      <div className="p-6">
        {props.complains.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {props.complains.map((complain) => {
              const imageUrl = profession.filter(
                (data) => data.name === complain.profession
              )[0].logo;
              return (
                <ComplainBox
                  item={{ ...complain, img: imageUrl }}
                  key={complain._id}
                />
              );
            })}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Complaints Found
              </h3>
              <p className="text-slate-600 text-center max-w-md">
                There are currently no complaints matching your criteria. Try
                adjusting your filters or check back later.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ComplainBoxes;
