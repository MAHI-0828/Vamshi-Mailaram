import React from 'react';
import { TimelineEventData } from '../types';
import TimelineCard from './TimelineCard';

interface TimelineProps {
  events: TimelineEventData[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <p className="text-center text-[#4a5568] py-10 font-['Roboto Mono']">No events to display.</p>
    );
  }

  return (
    <div className="relative py-8 sm:py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      <div
        className="container relative mx-auto max-w-[1024px] px-4 sm:px-6 lg:px-8"
        style={{ boxSizing: 'border-box' }}
      >
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute w-1 bg-gray-200 rounded-full top-0 bottom-0 left-[40px]"
            aria-hidden="true"
          ></div>

          {/* All timeline cards */}
          <div>
            {events.map((event) => (
              <div key={event.id} className="mb-10">
                <TimelineCard event={event} dotOffsetFromCardEdgePx={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
