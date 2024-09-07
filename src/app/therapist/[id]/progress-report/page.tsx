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

    useEffect(() => {console.log(selectedSessions)}, [selectedSessions]   )

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
        <div className="p-4">
            <Toaster />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4">Progress Reports</h2>
                    {progressReport.length > 0 ? (
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
                        <p>No progress reports found.</p>
                    )}

                    <button
                        className="mt-4 bg-blue-500 text-white p-2 rounded"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Create New Progress Report'}
                    </button>

                    {showForm && (
                        <form className="mt-4 space-y-4" onSubmit={handleProgressReportCreation}>
                            <textarea
                                name="summary"
                                placeholder="Summary"
                                value={newReport.summary}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <textarea
                                name="recommendations"
                                placeholder="Recommendations"
                                value={newReport.recommendations}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <textarea
                                name="challenges"
                                placeholder="Challenges"
                                value={newReport.challenges}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <textarea
                                name="patientBehaviour"
                                placeholder="Patient Behaviour"
                                value={newReport.patientBehaviour}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                name="improvementAreas"
                                placeholder="Improvement Areas"
                                value={newReport.improvementAreas}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                name="goalsMet"
                                placeholder="Goals Met"
                                value={newReport.goalsMet}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                name="goalsUnmet"
                                placeholder="Goals Unmet"
                                value={newReport.goalsUnmet}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />

                            <label>Select Session Logs</label>
                            <div className="grid grid-cols-1 gap-2">
                                {sessions.map((session: any) => (
                                    <div key={session.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={session.id}
                                            checked={selectedSessions.includes(session.id)}
                                            onChange={() => handleCheckboxChange(session.id)}
                                        />
                                        <label htmlFor={session.id}>
                                            {new Date(session.date).toLocaleDateString()} - {session.activities}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 rounded"
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
