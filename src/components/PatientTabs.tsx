"use client";
import { Tabs } from "@/components/ui/tabs";
import PatientSessions from "./PatientSessions";
import PatientReports from "./PatientReports";
import TherapistDetails from "./TherapistDetails";
import SupervisorDetails from "./SupervisorDetails";
import PatientNotifications from "./PatientNotifications";

export function PatientTab() {
  const tabs = [
    {
      title: "Sessions",
      value: "sessions",
      content: <PatientSessions />,
    },
    {
      title: "Reports",
      value: "reports",
      content: <PatientReports />,
    },
    {
      title: "Therapist",
      value: "therapist",
      content: <TherapistDetails />,
    },
    {
      title: "Supervisor",
      value: "supervisor",
      content: <SupervisorDetails />,
    },
    {
      title: "Notifcations",
      value: "notifications",
      content: <PatientNotifications />,
    },
  ];

  return (
    <div className="min-h-screen md:h-screen [perspective:1000px] relative b flex flex-col mx-auto w-full text-black items-start justify-start my-20 px-14">
      <Tabs tabs={tabs} />
    </div>
  );
}
export default PatientTab;
