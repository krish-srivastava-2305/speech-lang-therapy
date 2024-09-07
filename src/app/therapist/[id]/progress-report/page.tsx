'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

function ProgressPage() {
    const { id } = useParams()
    const [progressReport, setProgressReport] = useState<any[]>([])
    const [sessions, setSessions] = useState<any[]>([])
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]) // State for selected session logs
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    const [newReport, setNewReport] = useState({
        recommendations: '',
        summary: '',
        challenges: '',
        patientBehaviour: '',
        improvementAreas: '',
        goalsMet: '',
        goalsUnmet: '',
    })

    useEffect(() => { console.log(selectedSessions) }, [selectedSessions])

    useEffect(() => {
        fetchProgressReport()
        fetchSessions()
    }, [])

    const fetchProgressReport = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/api/controllers/progress-report/get-report?id=${id}`)
            setProgressReport(response.data.progressReport)
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Failed to fetch progress report. Please try again."
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const fetchSessions = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/api/controllers/therapist/get-patient-sessions?id=${id}`)
            setSessions(response.data.sessions)
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Failed to fetch sessions. Please try again."
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleProgressReportCreation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/controllers/progress-report/create-progress-report', {
                ...newReport,
                patientId: id,
                sessionLogIds: selectedSessions.join(",") // Convert array to comma-separated string
            });


            toast.success('Progress report created successfully!')
            setShowForm(false)
            fetchProgressReport()
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Failed to create report. Please try again."
            toast.error(errorMsg)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewReport({ ...newReport, [name]: value })
    }

    const handleCheckboxChange = (sessionId: string) => {
        setSelectedSessions((prevSelected) => {
            if (prevSelected.includes(sessionId)) {
                // Remove the session ID if already selected
                return prevSelected.filter((id) => id !== sessionId)
            } else {
                // Add the session ID if not already selected
                return [...prevSelected, sessionId]
            }
        })
    }

    return (
        <div className="p-12 mt-12">
            
            <Toaster />
            {loading ? (
                <p className='text-slate-100'>Loading...</p>
            ) : (
                <div>
                    {/* <h2 className="text-3xl font-bold mb-200 text-blue-300 text-center">Progress Reports</h2> */}
                    <div className="flex justify-between items-center mb-6">

                    <div className="text-2xl font-bold text-indigo-600 bg-white rounded-xl p-2">Speechदी </div>
                        <h2 className="text-3xl font-bold text-blue-300">Progress Reports</h2>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancel' : 'Create New Progress Report'}
                        </button>
                    </div>
                    {/* {progressReport.length > 0 ? (
                        <ul className="space-y-4">
                            {progressReport.map((report: any, index: number) => (
                                <li key={index} className="p-4 border rounded-md shadow-sm">
                                    <h3 className="font-bold">Date: {new Date(report.date).toLocaleDateString()}</h3>
                                    <p>Summary: {report.summary}</p>
                                    <p>Recommendations: {report.recommendations}</p>
                                    <p>Challenges: {report.challenges}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-slate-100'>No progress reports found.</p>
                    )} */}

                    {progressReport.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
                            {progressReport.map((report, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                    <div className="bg-indigo-600 text-white px-4 py-2">
                                        <h3 className="font-semibold text-lg">
                                            {new Date(report.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </h3>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h4 className="font-medium text-gray-700">Summary</h4>
                                            <p className="text-gray-600">{report.summary}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700">Recommendations</h4>
                                            <p className="text-gray-600">{report.recommendations}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700">Challenges</h4>
                                            <p className="text-gray-600">{report.challenges}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-100 text-center py-8">No progress reports found.</p>
                    )}

                    {/* <button
                        className="mt-4 bg-blue-500 text-white p-2 rounded"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Create New Progress Report'}
                    </button> */}

                    {showForm && (
                        // <form className="mt-4 space-y-4" onSubmit={handleProgressReportCreation}>
                        //     <textarea
                        //         name="summary"
                        //         placeholder="Summary"
                        //         value={newReport.summary}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //         required
                        //     />
                        //     <textarea
                        //         name="recommendations"
                        //         placeholder="Recommendations"
                        //         value={newReport.recommendations}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //         required
                        //     />
                        //     <textarea
                        //         name="challenges"
                        //         placeholder="Challenges"
                        //         value={newReport.challenges}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //         required
                        //     />
                        //     <textarea
                        //         name="patientBehaviour"
                        //         placeholder="Patient Behaviour"
                        //         value={newReport.patientBehaviour}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //     />
                        //     <textarea
                        //         name="improvementAreas"
                        //         placeholder="Improvement Areas"
                        //         value={newReport.improvementAreas}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //     />
                        //     <textarea
                        //         name="goalsMet"
                        //         placeholder="Goals Met"
                        //         value={newReport.goalsMet}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //     />
                        //     <textarea
                        //         name="goalsUnmet"
                        //         placeholder="Goals Unmet"
                        //         value={newReport.goalsUnmet}
                        //         onChange={handleChange}
                        //         className="w-full p-2 border rounded"
                        //     />

                        //     <label>Select Session Logs</label>
                        //     <div className="grid grid-cols-1 gap-2">
                        //         {sessions.map((session: any) => (
                        //             <div key={session.id} className="flex items-center space-x-2">
                        //                 <input
                        //                     type="checkbox"
                        //                     id={session.id}
                        //                     checked={selectedSessions.includes(session.id)}
                        //                     onChange={() => handleCheckboxChange(session.id)}
                        //                 />
                        //                 <label htmlFor={session.id}>
                        //                     {new Date(session.date).toLocaleDateString()} - {session.activities}
                        //                 </label>
                        //             </div>
                        //         ))}
                        //     </div>

                        //     <button
                        //         type="submit"
                        //         className="bg-green-500 text-white p-2 rounded"
                        //     >
                        //         Submit Report
                        //     </button>
                        // </form>
                        <form className="mt-8 space-y-6 bg-white shadow-md rounded-lg p-8" onSubmit={handleProgressReportCreation}>
                            <label>Summary</label>
                            <textarea
                                name="summary"
                                placeholder="Summary"
                                value={newReport.summary}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <label>Recommendations</label>
                            <textarea
                                name="recommendations"
                                placeholder="Recommendations"
                                value={newReport.recommendations}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <label>Challenges</label>
                            <textarea
                                name="challenges"
                                placeholder="Challenges"
                                value={newReport.challenges}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <label>Patient Behaviour</label>
                            <textarea
                                name="patientBehaviour"
                                placeholder="Patient Behaviour"
                                value={newReport.patientBehaviour}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <label>Improvement Areas</label>
                            <textarea
                                name="improvementAreas"
                                placeholder="Improvement Areas"
                                value={newReport.improvementAreas}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <label>Goals Met</label>
                            <textarea
                                name="goalsMet"
                                placeholder="Goals Met"
                                value={newReport.goalsMet}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <label>Goals Unmet</label>
                            <textarea
                                name="goalsUnmet"
                                placeholder="Goals Unmet"
                                value={newReport.goalsUnmet}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Select Session Logs</label>
                                <div className="bg-gray-50 rounded-md p-4 max-h-60 overflow-y-auto">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="flex items-center space-x-3 py-2">
                                            <input
                                                type="checkbox"
                                                id={session.id}
                                                checked={selectedSessions.includes(session.id)}
                                                onChange={() => handleCheckboxChange(session.id)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={session.id} className="text-sm text-gray-700">
                                                {new Date(session.date).toLocaleDateString()} - {session.activities}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                Submit Report
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProgressPage
