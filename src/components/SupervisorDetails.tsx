import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Define the structure of the Supervisor data
interface Supervisor {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  department?: string;
  assignedTherapists: { id: string; name?: string }[];
  assignedPatients: { id: string; name?: string }[];
}

const SupervisorDetails: React.FC = () => {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupervisor = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/controllers/patient/get-supervisor'); 
      setSupervisor(response.data.supervisor);

      if (response.status === 200) {
        console.log('successfully fetched supervisor details');
      } else {
        toast.error('Failed to get Supervisor details');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'An error occurred');
      }
      toast.error('An error occurred while fetching the supervisor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisor();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 rounded-3xl">
      <Toaster />

      {/* Change UI from here*/}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          supervisor && (
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Supervisor Details
              </h2>
              <p>
                <strong>Name:</strong> {supervisor.name || 'Not provided'}
              </p>
              <p>
                <strong>Email:</strong> {supervisor.email}
              </p>
              <p>
                <strong>Phone:</strong> {supervisor.phone || 'Not provided'}
              </p>
              <p>
                <strong>Department:</strong> {supervisor.department || 'Not provided'}
              </p>
              {/* <p>
                <strong>Assigned Therapists:</strong> {supervisor.assignedTherapists.length}
              </p> */}
              {/* <ul className="list-disc ml-4">
                {supervisor.assignedTherapists.map((therapist) => (
                  <li key={therapist.id}>
                    {therapist.name || 'Unnamed Therapist'} (ID: {therapist.id})
                  </li>
                ))}
              </ul> */}
              {/* <p className="mt-4">
                <strong>Assigned Patients:</strong> {supervisor.assignedPatients.length}
              </p>
              <ul className="list-disc ml-4">
                {supervisor.assignedPatients.map((patient) => (
                  <li key={patient.id}>
                    {patient.name || 'Unnamed Patient'} (ID: {patient.id})
                  </li>
                ))}
              </ul> */}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SupervisorDetails;
