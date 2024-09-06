'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

type Patient = {
  id: string;
  name: string;
  age: number;
  city: string;
  state: string;
  email: string;
  phone: string;
  medicalIssue: string;
  imageUrl: string | null;
};

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`/api/controllers/supervisor/get-patient?id=${params.id}`);
        setPatients(response.data.patients);
        setError(null);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch patients. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Toaster />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Patients Assigned to You
        </h1>

        {loading ? (
          <div className="text-center text-lg text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : patients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
              >
                <img
                  src={patient.imageUrl || '/default-avatar.png'}
                  alt={patient.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {patient.name}, {patient.age}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Medical Issue:</strong> {patient.medicalIssue}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Email:</strong> {patient.email}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Phone:</strong> {patient.phone}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Location:</strong> {patient.city}, {patient.state}
                </p>

                <div className="mt-4 flex space-x-4">
                  <Link
                    href={`/supervisor/view/${patient.id}/sessions`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Sessions
                  </Link>

                  <Link
                    href={`/supervisor/view/${patient.id}/progress-reports`}
                    className="text-green-500 hover:text-green-700"
                  >
                    View Progress Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg text-gray-700">
            No patients assigned to you.
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;
