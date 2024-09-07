'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { Activity, FileText, Mail, MapPin, Phone, User } from 'lucide-react';

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
    // <div className="min-h-screen bg-gray-100 py-10">
    //   <Toaster />

    //   <div className="container mx-auto px-4">
    //     <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
    //       Patients Assigned to You
    //     </h1>

    //     {loading ? (
    //       <div className="text-center text-lg text-gray-700">Loading...</div>
    //     ) : error ? (
    //       <div className="text-red-500 text-center">{error}</div>
    //     ) : patients.length > 0 ? (
    //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //         {patients.map((patient) => (
    //           <div
    //             key={patient.id}
    //             className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
    //           >
    //             <img
    //               src={patient.imageUrl || '/default-avatar.png'}
    //               alt={patient.name}
    //               className="w-24 h-24 rounded-full mb-4"
    //             />
    //             <h2 className="text-xl font-semibold text-gray-800 mb-2">
    //               {patient.name}, {patient.age}
    //             </h2>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Medical Issue:</strong> {patient.medicalIssue}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Email:</strong> {patient.email}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Phone:</strong> {patient.phone}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Location:</strong> {patient.city}, {patient.state}
    //             </p>

    //             <div className="mt-4 flex space-x-4">
    //               <Link
    //                 href={`/supervisor/view/${patient.id}/sessions`}
    //                 className="text-blue-500 hover:text-blue-700"
    //               >
    //                 View Sessions
    //               </Link>

    //               <Link
    //                 href={`/supervisor/view/${patient.id}/progress-reports`}
    //                 className="text-green-500 hover:text-green-700"
    //               >
    //                 View Progress Report
    //               </Link>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       <div className="text-center text-lg text-gray-700">
    //         No patients assigned to you.
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="min-h-screen  py-12">
    <Toaster />
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12 mt-10 text-blue-300">
        Your Assigned Patients
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-00"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="relative h-24 bg-gradient-to-r from-blue-100 to-blue-900">
                <img
                  src={patient.imageUrl || '/default-avatar.png'}
                  alt={patient.name}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div className="pt-20 pb-8 px-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                  {patient.name}, {patient.age}
                </h2>
                <div className="space-y-4">
                  <p className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-medium mr-2">Medical Issue:</span> {patient.medicalIssue}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-medium mr-2">Email:</span> {patient.email}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-medium mr-2">Phone:</span> {patient.phone}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-medium mr-2">Location:</span> {patient.city}, {patient.state}
                  </p>
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                  <Link
                    href={`/supervisor/view/${patient.id}/sessions`}
                    className="flex items-center px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    View Sessions
                  </Link>
                  <Link
                    href={`/supervisor/view/${patient.id}/progress-reports`}
                    className="flex items-center px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Progress Report
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-700">No patients assigned to you at the moment.</p>
        </div>
      )}
    </div>
  </div>
  );
}

export default Patients;
