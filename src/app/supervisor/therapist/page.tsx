"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Activity, Briefcase, Mail, Map, Phone, Star, User } from "lucide-react";

// Therapist type definition
type Therapist = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  department: string | null;
  specialization: string | null;
  city: string | null;
  state: string | null;
  workload: number;
  rating: number | null;
};

export default function SupervisorTherapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch therapists under supervision
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await axios.get(
          "/api/controllers/supervisor/get-all-therapists"
        );
        setTherapists(response.data.therapists);
        setError(null);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || "Failed to fetch therapists. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return (
    // <div className="min-h-screen bg-gray-100 py-10">
    //   <Toaster />
    //   <div className="container mx-auto px-4">
    //     <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
    //       Therapists Under Your Supervision
    //     </h1>

    //     {loading ? (
    //       <div className="text-center text-lg text-gray-700">Loading...</div>
    //     ) : error ? (
    //       <div className="text-red-500 text-center">{error}</div>
    //     ) : therapists.length > 0 ? (
    //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //         {therapists.map((therapist) => (
    //           <div
    //             key={therapist.id}
    //             className="bg-white rounded-lg shadow-md p-6"
    //           >
    //             <h2 className="text-xl font-semibold text-gray-800 mb-2">
    //               {therapist.name || "Unknown Name"}
    //             </h2>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Email:</strong> {therapist.email}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Phone:</strong>{" "}
    //               {therapist.phone || "Not Provided"}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Department:</strong>{" "}
    //               {therapist.department || "N/A"}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Specialization:</strong>{" "}
    //               {therapist.specialization || "N/A"}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Location:</strong>{" "}
    //               {therapist.city}, {therapist.state}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Workload:</strong> {therapist.workload}
    //             </p>
    //             <p className="text-gray-600 mb-1">
    //               <strong>Rating:</strong> {therapist.rating || "No Rating"}
    //             </p>

    //             <Link
    //               href={`/supervisor/patient/${therapist.id}`}
    //               className="text-blue-500 hover:underline mt-4 inline-block"
    //             >
    //               View Therapist Details
    //             </Link>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       <div className="text-center text-lg text-gray-700">
    //         No therapists assigned to you.
    //       </div>
    //     )}
    //   </div>
    // </div>
     <div className="min-h-screen py-12">
      <Toaster />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 mt-10 text-blue-200">
          Therapists Under Your Supervision
        </h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : therapists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="h-24 bg-gradient-to-r from-blue-200 to-blue-900"></div>
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    {therapist.name || "Unknown Name"}
                  </h2>
                  <div className="space-y-4">
                    <p className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Email:</span> {therapist.email}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Phone:</span> {therapist.phone || "Not Provided"}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Briefcase className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Department:</span> {therapist.department || "N/A"}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Specialization:</span> {therapist.specialization || "N/A"}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Map className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Location:</span> {therapist.city}, {therapist.state}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Activity className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Workload:</span> {therapist.workload}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Star className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium mr-2">Rating:</span> {therapist.rating || "No Rating"}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link
                      href={`/supervisor/patient/${therapist.id}`}
                      className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                      <User className="w-5 h-5 mr-2" />
                      View Therapist Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-700">No therapists assigned to you at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
