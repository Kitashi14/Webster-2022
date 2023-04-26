import React from "react";
import { Link } from "react-router-dom";

const ComplainBox = (props) => {
  const locatDate = new Date(props.item.creationTime);
  const day = locatDate.getDate();
  const year = locatDate.getFullYear();
  const months = [
    "Jan.",
    "Feb.",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const month = months[locatDate.getMonth()];

  const date = day + " " + month + " " + year;

  return (
    <>
      <section>
        <section className="text-gray-600 body-font">
          {/* <div className="mx-8 mt-4 mb-8 "> */}
            <div className="p-5 bg-white flex items-center mx-2 my-2 border-b border-gray-200 rounded-lg sm:flex-row flex-col">
              <div className="sm:w-32 sm:h-32 h-20 w-20 rounded-full sm:mr-10 flex items-center gap-x-6 justify-center">
                <img src={props.item.img} className="rounded-full h-3/4 w-3/4" alt="" />
              </div>
              <div className="flex-grow sm:text-left text-center sm:mt-0">
                <Link to={`/complain/${props.item._id}`}>
                  <span className="text-black text-2xl title-font font-bold mb-0 hover:text-red-500">
                    {props.item.title}
                  </span>
                </Link>
                <p className="leading-relaxed mt-0 p-0 text-base">
                  Profession: {props.item.profession}
                </p>
                <p className="leading-relaxed mt-5 p-0 text-base">
                  Date: {date}
                </p>
                <p className="leading-relaxed mt-0 p-0 text-base">
                  By -{" "}
                  <span>
                    <Link
                      className="hover:text-red-500"
                      to={`/user/${props.item.creatorUsername}`}
                    >
                      {props.item.creatorUsername}
                    </Link>
                  </span>
                </p>
              </div>
              <div className="flex flex-col">
                {props.item.status}
                <br></br>
                <Link to={`/complain/${props.item._id}`} className="text-green-500 bg-gray-200 text-center">Open</Link>
              </div>
            </div>
          {/* </div> */}
        </section>
      </section>
    </>
  );
};

export default ComplainBox;
