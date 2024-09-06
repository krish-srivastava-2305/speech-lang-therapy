'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  sessionType: string;
  activities: string[];
  responses: string;
  status: string;
  notes?: string;
  duration?: string;
  patientFeedback?: string;
}

function SessionView() {
  const { id } = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);  // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`/api/controllers/supervisor/get-patient-sessions?id=${id}`);
        setSessions(response.data.sessions || []);  // Fallback to empty array
        setError(null);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch sessions. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [id]);

  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Therapy Sessions</h1>
        {sessions.length === 0 ? (
          <p className="text-center text-gray-600">No sessions available.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleSessionExpansion(session.id)}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {`Session on ${new Date(session.date).toLocaleDateString()} - ${session.sessionType}`}
                </h2>
                {expandedSessions.includes(session.id) ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </div>
              {expandedSessions.includes(session.id) && (
                <div className="p-4 space-y-4 bg-white border-t">
                  <SessionSection title="Status" content={session.status} />
                  <SessionSection title="Activities" content={session.activities.join(', ')} />
                  <SessionSection title="Responses" content={session.responses} />
                  {session.notes && <SessionSection title="Notes" content={session.notes} />}
                  {session.duration && <SessionSection title="Duration" content={session.duration} />}
                  {session.patientFeedback && <SessionSection title="Patient Feedback" content={session.patientFeedback} />}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SessionSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
}

export default SessionView;
