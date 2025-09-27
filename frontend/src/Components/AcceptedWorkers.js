import React from "react";
import { workers } from "../Helper/Workers";
import AcceptedWorker from "./AcceptedWorker";

const AcceptedWorkers = (props) => {
  console.log(props);
  console.log(props.workers.length);

  return (
    <>
      <div className="w-full">
        {props.workers.length ? (
          <div className="space-y-4">
            {props.workers.map((worker) => {
              const imageUrl = workers.filter(
                (data) => data.name === worker.name
              )[0]?.img;
              return (
                <div 
                  key={worker._id}
                  className="bg-white rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                >
                  <AcceptedWorker
                    item={{ ...worker, img: imageUrl }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 h-56">
            <div className="text-center">
              <div className="text-4xl mb-4">👷‍♂️</div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">No Workers Found</h3>
              <p className="text-slate-500">No workers have shown interest in this task yet.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AcceptedWorkers;