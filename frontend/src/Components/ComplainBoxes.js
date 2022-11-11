import React from "react";
import { profession } from "../Helper/Profession";
import ComplainBox from "./ComplainBox";

const ComplainBoxes = (props) => {

  return (
    <>
      <div className="d-flex p-4 justify-content-space-between place-content-center h-screen ">
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
            <div className="place-content-center" >No Complains Found</div>
          </>
        )}
      </div>
    </>
  );
};

export default ComplainBoxes;
