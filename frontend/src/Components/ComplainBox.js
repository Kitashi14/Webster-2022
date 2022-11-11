import React from 'react'

const ComplainBox = (props) => {
  return (
    <>

            <section>
                <section className="text-gray-600 body-font">
                    <div className="mx-8 mt-4 mb-8 ">
                        <div className="p-5 bg-white flex items-center mx-auto border-b border-gray-200 rounded-lg sm:flex-row flex-col">
                        <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex border-2 border-gray-200 rounded-full items-center justify-center  flex-shrink-0">
                            <img
                              src={props.item.img}className="h-3/4 w-3/4 " alt=''/>
       
                        </div>
                        <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
                            <h1 className="text-black text-2xl title-font font-bold mb-0">{props.item.title}</h1>
                            <p className="leading-relaxed mt-0 p-0 text-base">Profession: {props.item.profession}</p>  
                          <p className="leading-relaxed mt-5 p-0 text-base">Date: {props.item.date}</p>
                          <p className="leading-relaxed mt-0 p-0 text-base">By - {props.item.firstName} {props.item.lastName}</p>
                        </div>
                        </div>
                    </div>
                </section>
            </section>

    </>
  )
}

export default ComplainBox;