"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await axios.get(
          "/api/controller/supervisor/get-all-therapists",
          {
            withCredentials: true,
          }
        );

        setTherapists(response.data.therapists);
        setError(null);
        toast.success("Therapists data fetched successfully!"); // Show success toast
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            "Failed to fetch therapists. Please try again."
        );
        toast.error(error || "Failed to fetch therapists. Please try again."); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Therapists Under Your Supervision
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : therapists.length > 0 ? (
        <ul className="space-y-4">
          {therapists.map((therapist) => (
            <li key={therapist.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">
                {therapist.name || "Unknown Name"}
              </h2>
              <p>Email: {therapist.email}</p>
              <p>Phone: {therapist.phone || "Not Provided"}</p>
              <p>Department: {therapist.department || "N/A"}</p>
              <p>Specialization: {therapist.specialization || "N/A"}</p>
              <p>
                Location: {therapist.city}, {therapist.state}
              </p>
              <p>Workload: {therapist.workload}</p>
              <p>Rating: {therapist.rating || "No Rating"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No therapists assigned to you.</p>
      )}

      {/* Toast container to show toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
