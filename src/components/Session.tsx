import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Sessions() {

    const [sessions, setSessions] = useState([])  

    useEffect(() => {
        const allSessions = async () => {
            try {
                const res = await axios.get("/api/controllers/patient/get-sessions")
                setSessions(res.data.sessions)
            } catch (error) {
                console.error(error)
            }
        }
        allSessions()
    }, [])

    useEffect(() => {
        console.log(sessions)
    },[sessions])
  return (
    <>

    </>
  )
}

export default Sessions
