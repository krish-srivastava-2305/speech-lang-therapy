import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// interface SessionLog {
//   id: string;
//   date: string;
//   activities: string;
//   responses: string;
//   status: string;
//   notes?: string;
//   duration?: string;
//   patientFeedback?: string;
//   sessionType: string;
// }

const SessionCard: React.FC = () => {
  const [sessions, setSessions] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/controllers/patient/get-sessions');
      if (response.status === 200) {
        console.log(response);
        setSessions(response.data?.sessions);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || error.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      toast.error("Failed to fetch sessions");
    }
  };

  const handleFeedback = async (sessionId: string) => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    try {
      const response = await axios.post('/api/controllers/session/feedback', {
        sessionId,
        feedback
      });
      if (response.status === 200) {
        toast.success("Feedback submitted successfully");
        setFeedback("");
        setActiveFeedbackId(null);
        // Refresh sessions to show updated feedback
        fetchSessions();
      }
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7ff] to-[#035790] py-12 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-white mb-12 tracking-tight leading-tight">
          Therapy Sessions Overview
        </h1>
        {error ? (
          <div className="text-red-500 text-center bg-white p-4 rounded-lg shadow">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session: any) => (
              <div
                key={session.id}
                className="bg-white shadow-lg rounded-3xl overflow-hidden transform transition duration-300 hover:shadow-xl"
              >
                <div className="px-6 py-8">
                  <h3 className="font-semibold text-2xl text-gray-800 mb-4">
                    Session on {new Date(session.date).toLocaleDateString()}
                  </h3>
                  <p className="text-gray-600 text-base mb-2">
                    <span className="font-medium">Session Type:</span> {session.sessionType}
                  </p>
                  <p className="text-gray-600 text-base mb-2">
                    <span className="font-medium">Status:</span> {session.status}
                  </p>
                  <p className="text-gray-600 text-base mb-2">
                    <span className="font-medium">Activities:</span> {session.activities}
                  </p>
                  {session.responses && <p className="text-gray-600 text-base mb-2">
                    <span className="font-medium">Responses:</span> {session.responses}
                  </p>}
                  {session.notes && (
                    <p className="text-gray-600 text-base mb-2">
                      <span className="font-medium">Notes:</span> {session.notes}
                    </p>
                  )}
                  
                  <p className="text-gray-600 text-base mb-2">
                    <span className="font-medium">Duration:</span> {session.duration}
                  </p>
                  
                  {session.patientFeedback && (
                    <p className="text-gray-600 text-base mb-2">
                      <span className="font-medium">Patient Feedback:</span> {session.patientFeedback}
                    </p>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  {activeFeedbackId === session.id ? (
                    <div>
                      <textarea
                        className="w-full p-2 border rounded-md mb-2"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Enter your feedback..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleFeedback(session.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition duration-300 ease-in-out"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setActiveFeedbackId(null);
                            setFeedback("");
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-400 transition duration-300 ease-in-out"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveFeedbackId(session.id)}
                      className="bg-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition duration-300 ease-in-out"
                    >
                      Add Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;