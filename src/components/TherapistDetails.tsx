import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Define the structure of the Therapist data
interface Therapist {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  department?: string;
  specialization?: string;
  city?: string;
  state?: string;
  workload: number;
  rating?: number;
}

function TherapistDetails() {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the therapist details
  const fetchTherapist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/controllers/patient/get-therapist"
      );
      setTherapist(response.data.therapist);

      if (response.status === 200) {
        console.log("successfully fetched therapist details");
      } else {
        toast.error("Failed to get Therapist details");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || "An error occurred");
      }
      toast.error("An error occurred while fetching the therapist details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapist();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2fa2d7] to-[#035790] py-10 rounded-3xl">
      <Toaster />
      {/* Change UI from here*/}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          therapist && (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Therapist Details
              </h2>
              <p className="text-xl">
                <strong>Name:</strong> {therapist.name || "Not provided"}
              </p>
              <p className="text-xl">
                <strong>Email:</strong> {therapist.email}
              </p>
              <p className="text-xl">
                <strong>Phone:</strong> {therapist.phone || "Not provided"}
              </p>
              <p className="text-xl">
                <strong>Department:</strong>{" "}
                {therapist.department || "Not provided"}
              </p>
              <p className="text-xl">
                <strong>Specialization:</strong>{" "}
                {therapist.specialization || "Not provided"}
              </p>
              <p className="text-xl">
                <strong>Location:</strong>{" "}
                {therapist.city
                  ? `${therapist.city}, ${therapist.state}`
                  : "Not provided"}
              </p>
              <p className="text-xl">
                <strong>Workload:</strong> {therapist.workload} patients
              </p>
              {therapist.rating && (
                <p className="text-xl">
                  <strong>Rating:</strong> {therapist.rating.toFixed(1)} / 5
                </p>
              )}
              {/* <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => toast("This is a demo button")}
              >
                Action Button
              </button> */}
            </>
          )
        )}
      </div>
    </div>
  );
}

export default TherapistDetails;
