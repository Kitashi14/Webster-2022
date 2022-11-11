import React from 'react'
import { profession } from '../Helper/Profession'
import ComplainBox from './ComplainBox'

const ComplainBoxes = () => {

    const demoComplains = [
        {
            title: "Fix home switches",
            date: Date.now(),
            profession: "Electrician",
            firstName: "Rishav",
            lastName: "Raj"
        },
        {
            title: "Fix home switches",
            date: Date.now(),
            profession: "Electrician",
            firstName: "Rishav",
            lastName: "Raj"
        },
        {
            title: "Fix home switches",
            date: Date.now(),
            profession: "Electrician",
            firstName: "Rishav",
            lastName: "Raj"
        },
        {
            title: "Fix home switches",
            date: Date.now(),
            profession: "Electrician",
            firstName: "Rishav",
            lastName: "Raj"
        },
        {
            title: "Fix home switches",
            date: Date.now(),
            profession: "Electrician",
            firstName: "Rishav",
            lastName: "Raj"
        },
        {
            title: "Fix home switches",
            date: Date.now(),
            profession: "Electrician",
            firstName: "Rishav",
            lastName: "Raj"
        },
    ]

    return (
        <>
            <div className="d-flex p-4 justify-content-space-between">
                {demoComplains.map((complain) => {
                    const imageUrl = profession.filter(data => data.name === complain.profession)[0].logo;
                    console.log(imageUrl);
                    return <ComplainBox item={{ ...complain, img: imageUrl }} key={complain.id} />
                })}
            </div>

        </>
    )
}

export default ComplainBoxes;