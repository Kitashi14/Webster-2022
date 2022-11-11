import React from "react";
import { profession } from "../Helper/Profession";
import ComplainBox from "./ComplainBox";

const ComplainBoxes = (props) => {
  const demoComplains = [
    {
      title: "Fix home switches",
      date: Date.now(),
      profession: "Electrician",
      firstName: "Rishav",
      lastName: "Raj",
      _id: "343534",
    },
    {
      title: "Fix home switches",
      date: Date.now(),
      profession: "Electrician",
      firstName: "Rishav",
      lastName: "Raj",
      _id: "34534",
    },
    {
      title: "Fix home switches",
      date: Date.now(),
      profession: "Electrician",
      firstName: "Rishav",
      lastName: "Raj",
      _id: "34353",
    },
    {
      title: "Fix home switches",
      date: Date.now(),
      profession: "Electrician",
      firstName: "Rishav",
      lastName: "Raj",
      _id: "33534",
    },
    {
      title: "Fix home switches",
      date: Date.now(),
      profession: "Electrician",
      firstName: "Rishav",
      lastName: "Raj",
      _id: "3434",
    },
    {
      title: "Fix home switches",
      date: Date.now(),
      profession: "Electrician",
      firstName: "Rishav",
      lastName: "Raj",
      _id: "334",
    },
  ];

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
