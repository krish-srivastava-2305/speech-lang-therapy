import React, { useEffect, useState } from "react";
import axios from "axios";

interface SessionLog {
  id: string;
  date: string;
  activities: string[];
  responses: string;
  status: string;
  notes?: string;
  duration?: string;
  patientFeedback?: string;
  sessionType: string;
}

const SessionCard: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Demo data for mock purposes
    const demoData: SessionLog[] = [
      {
        id: "1",
        date: "2024-09-01",
        activities: ["Breathing exercises", "Speech articulation"],
        responses: "Good progress noted",
        status: "Completed",
        notes: "Patient showed improvement in articulation",
        duration: "30 minutes",
        patientFeedback: "Very helpful session",
        sessionType: "Speech Therapy",
      },
      {
        id: "2",
        date: "2024-09-03",
        activities: ["Reading exercises", "Listening exercises"],
        responses: "Patient had difficulty in reading",
        status: "Ongoing",
        notes: "Needs more practice with reading comprehension",
        duration: "45 minutes",
        patientFeedback: "Challenging but beneficial",
        sessionType: "Cognitive Therapy",
      },
      {
        id: "3",
        date: "2024-09-05",
        activities: ["Memory recall", "Problem-solving"],
        responses: "Excellent recall performance",
        status: "Completed",
        notes: "Patient performed well in memory tasks",
        duration: "60 minutes",
        patientFeedback: "Engaging and motivating session",
        sessionType: "Memory Training",
      },
    ];

    // Simulate API call delay and set demo data
    setTimeout(() => {
      setSessions(demoData);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-[#035790] py-12 rounded-3xl">
    <div className="container mx-auto px-6 lg:px-12">
      <h1 className="text-center text-5xl font-extrabold text-gray-900 mb-12 tracking-tight leading-tight">
        Therapy Sessions Overview
      </h1>
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white shadow-md rounded-3xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="px-8 py-8">
                <h3 className="font-semibold text-2xl text-gray-800 mb-6">
                  Session on {new Date(session.date).toLocaleDateString()}
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  <strong>Session Type:</strong> {session.sessionType}
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  <strong>Status:</strong> {session.status}
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  <strong>Activities:</strong> {session.activities.join(", ")}
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  <strong>Responses:</strong> {session.responses}
                </p>
                {session.notes && (
                  <p className="text-gray-600 text-lg mb-4">
                    <strong>Notes:</strong> {session.notes}
                  </p>
                )}
                {session.duration && (
                  <p className="text-gray-600 text-lg mb-4">
                    <strong>Duration:</strong> {session.duration}
                  </p>
                )}
                {session.patientFeedback && (
                  <p className="text-gray-600 text-lg mb-4">
                    <strong>Feedback:</strong> {session.patientFeedback}
                  </p>
                )}
              </div>
              <div className="px-8 py-4 bg-gray-50">
                <button className="bg-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition duration-300 ease-in-out">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
    // <div className="min-h-screen bg-gradient-to-b bg-[#CEDF9F] py-8 rounded-3xl">
    //   <div className="container mx-auto px-4">
    //     <h1 className="text-center text-4xl font-extrabold text-white mb-12">
    //       Therapy Sessions Overview
    //     </h1>
    //     {error ? (
    //       <div className="text-red-500 text-center">{error}</div>
    //     ) : (
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //         {sessions.map((session) => (
    //           <div
    //             key={session.id}
    //             className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
    //           >
    //             <div className="px-6 py-6">
    //               <h3 className="font-bold text-2xl text-gray-900 mb-4">
    //                 Session on {new Date(session.date).toLocaleDateString()}
    //               </h3>
    //               <p className="text-gray-700 text-lg mb-2">
    //                 <strong>Session Type:</strong> {session.sessionType}
    //               </p>
    //               <p className="text-gray-700 text-lg mb-2">
    //                 <strong>Status:</strong> {session.status}
    //               </p>
    //               <p className="text-gray-700 text-lg mb-2">
    //                 <strong>Activities:</strong>{" "}
    //                 {session.activities.join(", ")}
    //               </p>
    //               <p className="text-gray-700 text-lg mb-2">
    //                 <strong>Responses:</strong> {session.responses}
    //               </p>
    //               {session.notes && (
    //                 <p className="text-gray-700 text-lg mb-2">
    //                   <strong>Notes:</strong> {session.notes}
    //                 </p>
    //               )}
    //               {session.duration && (
    //                 <p className="text-gray-700 text-lg mb-2">
    //                   <strong>Duration:</strong> {session.duration}
    //                 </p>
    //               )}
    //               {session.patientFeedback && (
    //                 <p className="text-gray-700 text-lg mb-2">
    //                   <strong>Feedback:</strong> {session.patientFeedback}
    //                 </p>
    //               )}
    //             </div>
    //             <div className="px-6 py-4 bg-gray-100">
    //               <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
    //                 View Details
    //               </button>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default SessionCard;
