'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Loader2, Plus, Edit } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Session {
  id: string;
  date: string;
  sessionType: string;
  activities: string[];
  responses: string;
  notes: string;
  status: string;
}

function TherapistSessions() {
  const { id } = useParams();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null); // For editing responses
  const [newResponses, setNewResponses] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/controllers/therapist/get-patient-sessions?id=${id}`);
      setSessions(response.data.sessions);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to fetch sessions. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleResponseSubmit = async (sessionId: string) => {
    try {
      await axios.patch('/api/controllers/session/response', {
        sessionId,
        response: newResponses,
        notes: newNotes,
      });
      toast.success("Session updated successfully!");
      fetchSessions();
      setActiveSessionId(null); 
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to update session.";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Sessions</h1>

        {sessions === null ? (
          <p className="text-center text-gray-600">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-600">No sessions available.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleSessionExpansion(session.id)}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Session on {new Date(session.date).toLocaleDateString()} - {session.sessionType}
                </h2>
                {expandedSessions.includes(session.id) ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </div>
              {expandedSessions.includes(session.id) && (
                <div className="p-4 space-y-4">
                  <p><strong>Status:</strong> {session.status}</p>
                  <p><strong>Activities:</strong> {session.activities}</p>
                  <p><strong>Responses:</strong> {session.responses || "No responses yet"}</p>
                  <p><strong>Notes:</strong> {session.notes || "No notes yet"}</p>
                  {activeSessionId === session.id ? (
                    <div>
                      <textarea
                        placeholder="Enter responses"
                        value={newResponses}
                        onChange={(e) => setNewResponses(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-md p-2"
                      />
                      <textarea
                        placeholder="Enter notes"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-md p-2"
                      />
                      <button
                        onClick={() => handleResponseSubmit(session.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-2"
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveSessionId(session.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Respond
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TherapistSessions;
