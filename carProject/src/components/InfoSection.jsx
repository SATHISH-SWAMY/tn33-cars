import React from 'react';
import ReactPlayer from 'react-player';

function InfoSection() {
  return (
    <section className="px-4 sm:px-8 py-12 bg-white">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Explore the Latest in Automotive Technology
            </h2>
            <p className="mt-4 text-gray-700 text-sm md:text-base">
              Dive into an in-depth look at the newest car models, detailed reviews, and real-world performance tests.
              From cutting-edge safety features to stylish interiors, this video highlights what makes modern vehicles
              truly exceptional. Perfect for car enthusiasts and first-time buyers alike.
            </p>
          </div>

          {/* Video Section */}
          <div className="w-full aspect-w-16 aspect-h-9">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=UWjNH6KXoOs&ab_channel=tn33cars"
              controls
              width="100%"
              height="50vh"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
