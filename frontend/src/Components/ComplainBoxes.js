import React from "react";
import { profession } from "../Helper/Profession";
import ComplainBox from "./ComplainBox";

const ComplainBoxes = (props) => {

  return (
    <>
      <div className="d-flex p-4 justify-content-space-between place-content-center h-full w-full">
        {props.complains.length ? (
          props.complains.map((complain) => {
            const imageUrl = profession.filter(
              (data) => data.name === complain.profession
            )[0].logo;
            return (
              <ComplainBox
                item={{ ...complain, img: imageUrl }}
                key={complain._id}
              />
            );
          })
        ) : (
          <>
            <div className="container justify-center place-content-center bg-gray-200 h-56 align-middle" >No Complains Found</div>
          </>
        )}
      </div>
    </>
  );
};

export default ComplainBoxes;
