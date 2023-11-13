/** @format */

import { useRef, useState } from "react";
import MapDiv from "./map";

const MapForm = (props) => {
  const [model, setModel] = useState(false);

  const latInputRef = useRef();
  const longInputRef = useRef();
  const [reloaded, setReloaded] = useState(false);

  const openMap = () => {
    setModel(true);
    if (!reloaded) {
      setTimeout(() => {
        setModel(false);
        setTimeout(() => {
          setModel(true);
        }, 10);
      }, 10);
      setReloaded(true);
    }
  };
  const closeMap = (lat, long) => {
    latInputRef.current.value = lat;
    longInputRef.current.value = long;
    props.setCoordinates(latInputRef.current.value,longInputRef.current.value);
    setModel(false);
  };

  const setCoordinates = (e) => {
    e.preventDefault();
    props.setCoordinates(latInputRef.current.value,longInputRef.current.value);
  };
  return (
    <>
      <div className="w-full flex flex-row items-center space-x-4 ">
        <div className="w-full">
          <label
            htmlFor="lat"
            className="block mb-0 text-sm font-bold text-gray-700"
          >
            Latitude :
          </label>
          <input
            id="lat"
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none mb-1 focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Enter latitude"
            required
            step="any"
            min="-90"
            max="90"
            ref={latInputRef}
            onChange={setCoordinates}
            defaultValue={props.initialValues.lat}
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="long"
            className="block mb-0 text-sm font-bold text-gray-700"
          >
            Longitude :
          </label>
          <input
            id="long"
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none mb-1 focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Enter longitude"
            ref={longInputRef}
            required
            min="-180"
            max="180"
            step="any"
            onChange={setCoordinates}
            defaultValue={props.initialValues.lng}
          />
        </div>
      </div>
      <div className="w-full flex flex-row justify-center pb-4">
        <button
          className="p-2 border text-white rounded-lg w-2/6 bg-green-600"
          onClick={openMap}
        >
          Open Map
        </button>
      </div>
      {model ? <MapDiv closeMap={closeMap} /> : <></>}
    </>
  );
};

export default MapForm;
