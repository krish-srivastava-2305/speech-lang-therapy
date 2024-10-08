"use client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import the router hook for navigation

function PatientInfo() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `/api/controllers/therapist/get-patients`
        );
        setPatients(response.data.patients);
        setError(null);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.error ||
          "Failed to fetch patients. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => console.log(patients), [patients]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Function to navigate to the progress report page
  const handleProgressReportClick = (patientId: string) => {
    router.push(`/therapist/${patientId}/progress-report`);
  };

  // Function to navigate to the session logs page
  const handleSessionLogsClick = (patientId: string) => {
    router.push(`/therapist/${patientId}/sessions`);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">


    
    <h2 className="text-4xl font-bold text-blue-200 mb-10 text-center">
      Patient Information
    </h2>
   
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient: any) => (
          <div
          key={patient.id}
          className="bg-white shadow-lg rounded-lg p-6 transition-transform hover:scale-105 duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                {patient.name?.[0].toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {patient.name}
                </h2>
                <p className="text-gray-500">{patient.email}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700">
                <span className="font-medium">Age:</span> {patient.age}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Medical Issue:</span>{" "}
                {patient.medicalIssue}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Therapist:</span>{" "}
                {patient.therapistName}
              </p>
              {/* Buttons for navigating to progress report and session logs */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleProgressReportClick(patient.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  View Progress Report
                </button>
                <button
                  onClick={() => handleSessionLogsClick(patient.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  View Session Logs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientInfo;
