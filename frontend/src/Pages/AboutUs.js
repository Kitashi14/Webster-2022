import React from 'react';

const About = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="container mx-auto px-4 py-14 sm:px-6 xl:px-12">
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <h1 className="text-4xl font-bold tracking-normal text-gray-800 sm:text-5xl lg:text-6xl">About Complaint Box</h1>
                        <hr className="w-24 h-1 bg-blue-500 rounded border-0" />
                        
                        <div className="max-w-4xl space-y-6">
                            <p className="text-lg text-gray-600 text-justify sm:text-xl leading-relaxed">
                                Complaint Box is a comprehensive web platform designed to bridge the gap between citizens and service providers. Our mission is to streamline the complaint resolution process by connecting users who need assistance with skilled workers who can provide solutions.
                            </p>

                            <p className="text-lg text-gray-600 text-justify sm:text-xl leading-relaxed">
                                Whether you're facing issues with plumbing, electrical work, home repairs, or any other service-related problems, our platform ensures that your complaints reach the right professionals efficiently. We believe in creating a transparent, reliable, and user-friendly environment where problems get resolved quickly and effectively.
                            </p>

                            <p className="text-lg text-gray-600 text-justify sm:text-xl leading-relaxed">
                                Our system features real-time chat communication, location-based worker matching, and an admin-moderated assignment process to ensure quality service delivery. With integrated Google authentication and comprehensive user profiles, we make it easy for both complainants and workers to connect and collaborate.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Reporting</h3>
                                <p className="text-gray-600">Submit complaints with detailed descriptions and location information</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Resolution</h3>
                                <p className="text-gray-600">Get connected with verified workers in your area</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Communication</h3>
                                <p className="text-gray-600">Chat directly with workers and track progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About;