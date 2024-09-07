import axios from 'axios';
import React, { useEffect, useState } from 'react'

// ye saara data backend se aayega as an object in an array

/* 
  date        DateTime
  sessionLogs SessionLog[]

  recommendations  String
  summary          String
  challenges       String
  patientBehaviour String
  improvementAreas String
  goalsMet         String
  goalsUnmet       String

  supervisorFeedback          String?
  supervisorFeedbackOnPatient String?
  supervisorRatings           String? 
 */


function PatientReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/cotrollers/patient/get-progress-report')
        if(response.status === 200) {
          console.log(response.data);
          setReports(response.data.progressReport);
        }
      } catch (error) {
        if(axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
      }
    }
  }, [])

  useEffect(() => console.log(reports), [reports])


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2fa2d7] to-[#035790] py-12 rounded-3xl">
      Progress Report
    </div>
  )
}

export default PatientReports
