import React from "react";
import { workers } from "../Helper/Workers";
import AcceptedWorker from "./AcceptedWorker";

const AcceptedWorkers = (props) => {
  console.log(props);
  console.log(props.workers.length);

  return (
    <>
      <div className="d-flex p-4 justify-content-space-between place-content-center h-full w-full">
        {props.workers.length ? (
          props.workers.map((worker) => {
            const imageUrl = workers.filter(
              (data) => data.name === worker.name
            )[0].img;
            return (
              <AcceptedWorker
                item={{ ...worker, img: imageUrl }}
                key={worker._id}
              />
            );
          })
        ) : (
          <>
            <div className="container justify-center place-content-center bg-gray-200 h-56 align-middle">
              No workers Found
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AcceptedWorkers;
