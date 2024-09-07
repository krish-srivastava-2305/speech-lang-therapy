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
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-b from-[#e6f7ff] to-[#035790]">
          <p>Random tab</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen md:h-[40rem] [perspective:1000px] relative b flex flex-col mx-auto w-full text-black items-start justify-start my-20 px-14">
      <Tabs tabs={tabs} />
    </div>
  );
}
export default PatientTab;
