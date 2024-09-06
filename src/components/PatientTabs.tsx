"use client";
import { Tabs } from "@/components/ui/tabs";
import PatientSessions from "./PatientSessions";
import PatientReports from "./PatientReports";
import TherapistDetails from "./TherapistDetails";
import SupervisorDetails from "./SupervisorDetails";

export function PatientTab() {
  const tabs = [
    {
      title: "Sessions",
      value: "sessions",
      content: (
        <PatientSessions />
      ),
    },
    {
      title: "Reports",
      value: "reports",
      content: (
        <PatientReports />
      ),
    },
    {
      title: "Therapist",
      value: "therapist",
      content: (
        <TherapistDetails />
      ),
    },
    {
      title: "Supervisor",
      value: "supervisor",
      content: (
        <SupervisorDetails /> 
      ),
    },
    {
      title: "Notifcations",
      value: "notifications",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Random tab</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen md:h-[40rem] [perspective:1000px] relative b flex flex-col mx-auto w-full  items-start justify-start my-40 px-24">
      <Tabs tabs={tabs} />
    </div>
  );
}
export default PatientTab;
