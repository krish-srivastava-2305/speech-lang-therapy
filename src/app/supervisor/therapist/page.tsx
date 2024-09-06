"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-100 py-10">
      <Toaster />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Therapists Under Your Supervision
        </h1>

        {loading ? (
          <div className="text-center text-lg text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : therapists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {therapist.name || "Unknown Name"}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Email:</strong> {therapist.email}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Phone:</strong>{" "}
                  {therapist.phone || "Not Provided"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Department:</strong>{" "}
                  {therapist.department || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Specialization:</strong>{" "}
                  {therapist.specialization || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Location:</strong>{" "}
                  {therapist.city}, {therapist.state}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Workload:</strong> {therapist.workload}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Rating:</strong> {therapist.rating || "No Rating"}
                </p>

                <Link
                  href={`/supervisor/patient/${therapist.id}`}
                  className="text-blue-500 hover:underline mt-4 inline-block"
                >
                  View Therapist Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg text-gray-700">
            No therapists assigned to you.
          </div>
        )}
      </div>
    </div>
  );
}
