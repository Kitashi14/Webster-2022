/** @format */
import "leaflet/dist/leaflet.css";
import maps from "./../Helper/map_attributes";

import { MapContainer, TileLayer } from "react-leaflet";
import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const MapDiv = (props) => {
  const mapRef = useRef();
  const markerRef = useRef();

  const zoom_level = 10;

  const [currentMarkerLocation, setCurrentMarkerLocation] = useState({
    lat: 28.6139,
    long: 77.2090,
  });

  const [draggable, setDraggable] = useState(false);

  const markerIcon = new L.Icon({
    iconUrl: require("./../Helper/images/placeholder.png"),
    iconSize: [35, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -46],
  });

  const findCurrentLocation = async () => {
    setDraggable(false);
    await toast.promise(new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition((location) => {
        resolve();
        setCurrentMarkerLocation({
          lat: location.coords.latitude,
          long: location.coords.longitude,
        });
        mapRef.current.flyTo(
          [location.coords.latitude, location.coords.longitude],
          18,
          {
            animate: true,
          }
        );
      }, () => {
        reject();
      });
    }),{
      pending : "Locating...",
      success : "Found",
      error : "Permission Denied"
    })
    
  };
  const toggleDraggable = () => {
    setDraggable(!draggable);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        console.log(markerRef.current.getLatLng());
        setCurrentMarkerLocation({
          lat: markerRef.current.getLatLng().lat,
          long: markerRef.current.getLatLng().lng,
        });
      },
    }),
    []
  );

  const closeMap = (e) => {
    if (e.target.id == "backDrop" || e.target.id == "selectCoord")
      props.closeMap(currentMarkerLocation.lat, currentMarkerLocation.long);
  };

  const goToMarker = () => {
    mapRef.current.flyTo(
      [markerRef.current.getLatLng().lat, markerRef.current.getLatLng().lng],
      18,
      {
        animate: true,
      }
    );
  };

  return (
    <>
      <div
        id="backDrop"
        className="w-screen h-screen backdrop-blur-md fixed top-0 left-0"
        onClick={closeMap}
      >
        <div className="flex flex-col justify-between items-center p-3 space-y-2 container mx-auto h-3/4 mt-20 w-2/3 rounded-lg border-2 border-gray-200 bg-blue-400 text-white">
          Click on the Marker to see coordinates
          <div className=" w-full h-full mb-0 bg-red-600 rounded">
            <MapContainer
              center={[currentMarkerLocation.lat, currentMarkerLocation.long]}
              zoom={zoom_level}
              ref={mapRef}
            >
              <TileLayer
                attribution={maps.maptiler.attribution}
                url={maps.maptiler.url}
              />

              <Marker
                draggable={draggable}
                position={[
                  currentMarkerLocation.lat,
                  currentMarkerLocation.long,
                ]}
                icon={markerIcon}
                eventHandlers={eventHandlers}
                ref={markerRef}
              >
                <Popup>
                  {draggable
                    ? "Draggable mode on"
                    : `${currentMarkerLocation.lat}, ${currentMarkerLocation.long}`}
                  <br />
                  <span onClick={toggleDraggable}>
                    <a href="#">
                      {draggable
                        ? "Click here to see coordinates"
                        : "Click here to make marker draggable"}
                    </a>
                  </span>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="flex flex-row justify-center space-x-2">
            <button
              id="selectCoord"
              className="px-4 py-2 border rounded-lg  bg-green-600 text-white"
              onClick={closeMap}
            >
              Select Coordinates
            </button>
            <button
              className="px-4 py-2 border rounded-lg  bg-green-600 text-white"
              onClick={findCurrentLocation}
            >
              Locate Me
            </button>
          </div>
          <span className="text-white underline" onClick={goToMarker}>
            <a href="#">Go to marker</a>
          </span>
        </div>
      </div>
    </>
  );
};

export default MapDiv;
