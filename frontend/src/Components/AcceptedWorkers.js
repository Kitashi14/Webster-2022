import React from "react";
import { workers as helperWorkers } from "../Helper/Workers";
import AcceptedWorker from "./AcceptedWorker";

const AcceptedWorkers = (props) => {
  const complainId = props.complainId;
  const content = props.workers.length ? (
    <div className="space-y-4">
      {props.workers.map((worker) => {
        // worker may be a DB document with different field names
        const displayName = worker.workerFirstName || worker.name || "Unknown";
        const username = worker.workerUsername || worker.username || worker.userName || "";
        const imageUrl = helperWorkers.find((h) => h.username === username)?.img || worker.img || "";
        const item = {
          _id: worker._id || worker.id,
          name: displayName,
          username: username,
          rating: worker.rating || 0,
          score: worker.score || 0,
          age: worker.workerAge || worker.age || "-",
          img: imageUrl,
        };
        return (
          <div
            key={item._id}
            className="bg-white rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 cursor-pointer"
          >
            <AcceptedWorker item={item} complainId={complainId} complainDetails={props.complainDetails} onAssigned={props.onAssigned} />
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
  );

  return (
    <>
      <div className="w-full">{content}</div>
    </>
  );
};

export default AcceptedWorkers;