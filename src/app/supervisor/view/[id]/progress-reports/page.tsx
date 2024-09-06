'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface ProgressReport {
  id: string;
  date: string;
  recommendations: string;
  summary: string;
  challenges: string;
  patientBehaviour: string;
  improvementAreas: string;
  goalsMet: string;
  goalsUnmet: string;
  supervisorFeedback?: string;
  supervisorFeedbackOnPatient?: string;
  supervisorRatings?: string;
}

function ProgressReportView() {
  const { id } = useParams();
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReports, setExpandedReports] = useState<string[]>([]);
  const [openFeedbackForms, setOpenFeedbackForms] = useState<string[]>([]); // Track open feedback forms
  const [supervisorFeedback, setSupervisorFeedback] = useState<string>('');
  const [supervisorFeedbackOnPatient, setSupervisorFeedbackOnPatient] = useState<string>('');
  const [supervisorRatings, setSupervisorRatings] = useState<string>('');

  useEffect(() => {
    const fetchProgressReports = async () => {
      try {
        const response = await axios.get(`/api/controllers/supervisor/get-patient-reports?id=${id}`);
        setProgressReports(response.data.progressReports);
        setError(null);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch progress reports. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchProgressReports();
  }, [id]);

  const handleSupervisorFeedbackSubmit = async (progressReportId: string) => {
    try {
      const response = await axios.patch(`/api/controllers/progress-report/supervisor-feedback`, {
        progressReportId,
        supervisorFeedback,
        supervisorFeedbackOnPatient,
        supervisorRatings,
      });
      toast.success(response.data.message);
      setSupervisorFeedback('');
      setSupervisorFeedbackOnPatient('');
      setSupervisorRatings('');
      setOpenFeedbackForms(openFeedbackForms.filter((formId) => formId !== progressReportId)); // Close form after submit
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to add supervisor feedback. Please try again.';
      toast.error(errorMsg);
    }
  };

  const toggleReportExpansion = (reportId: string) => {
    setExpandedReports((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  const toggleFeedbackForm = (reportId: string) => {
    setOpenFeedbackForms((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Progress Reports</h1>
        {progressReports.length === 0 ? (
          <p className="text-center text-gray-600">No progress reports available.</p>
        ) : (
          progressReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleReportExpansion(report.id)}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Report for {new Date(report.date).toLocaleDateString()}
                </h2>
                {expandedReports.includes(report.id) ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </div>
              {expandedReports.includes(report.id) && (
                <div className="p-4 space-y-4">
                  <ReportSection title="Summary" content={report.summary} />
                  <ReportSection title="Recommendations" content={report.recommendations} />
                  <ReportSection title="Challenges" content={report.challenges} />
                  <ReportSection title="Patient Behaviour" content={report.patientBehaviour} />
                  <ReportSection title="Improvement Areas" content={report.improvementAreas} />
                  <ReportSection title="Goals Met" content={report.goalsMet} />
                  <ReportSection title="Goals Unmet" content={report.goalsUnmet} />

                  {/* Toggle button for supervisor feedback form */}
                  <button
                    onClick={() => toggleFeedbackForm(report.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    {openFeedbackForms.includes(report.id) ? 'Close Feedback Form' : 'Open Feedback Form'}
                  </button>

                  {/* Supervisor Feedback Form */}
                  {openFeedbackForms.includes(report.id) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSupervisorFeedbackSubmit(report.id);
                      }}
                      className="space-y-4 mt-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Supervisor Feedback</label>
                        <textarea
                          value={supervisorFeedback}
                          onChange={(e) => setSupervisorFeedback(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Feedback on Patient</label>
                        <textarea
                          value={supervisorFeedbackOnPatient}
                          onChange={(e) => setSupervisorFeedbackOnPatient(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Supervisor Ratings</label>
                        <input
                          type="text"
                          value={supervisorRatings}
                          onChange={(e) => setSupervisorRatings(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded-md"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Submit Feedback
                      </button>
                    </form>
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

function ReportSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
}

export default ProgressReportView;
