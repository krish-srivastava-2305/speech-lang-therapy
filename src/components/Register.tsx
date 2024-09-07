"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/util";
import india from "@/utils/indian-states";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

export function RegisterForm({ formFor }: any) {

  const router = useRouter();
  const states = Object.keys(india);
  const [allSupervisors, setAllSupervisors] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [department, setDepartment] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>(
    "Speech Therapy for Swallowing Difficulty"
  );
  const [medicalIssue, setMedicalIssue] = useState<string>(
    "Speech Therapy for Swallowing Difficulty"
  );
  const [state, setState] = useState<string>("Delhi");
  const [city, setCity] = useState<string>("");
  const [supervisor, setSupervisor] = useState<string>("");

  const [allCities, setAllCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await axios.get("/api/controllers/supervisor/get-all");
        setAllSupervisors(res.data.supervisors);
      } catch (error) {
        console.error("Error getting all supervisors", error);
      }
    };
    fetchSupervisors();
  }, []);

  useEffect(() => {
    setAllCities(india[state as keyof typeof india]);
  }, [state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validations
    if (!email || !password || !phone) {
      toast.error("Please fill out all required fields.");
      return;
    }

    let res;
    try {
      if (formFor === "supervisor") {
        res = await axios.post("/api/auth/supervisor/register", {
          email,
          name,
          password,
          phone,
          department,
        });
      } else if (formFor === "therapist") {
        res = await axios.post("/api/auth/therapist/register", {
          email,
          name,
          password,
          phone,
          department,
          specialization,
          city,
          state,
          supervisor,
        });
      } else if (formFor === "patient") {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);

        if (image) formData.append("image", image);
        formData.append("age", age?.toString() || "");
        formData.append("medicalIssue", medicalIssue);
        formData.append("city", city);
        formData.append("state", state);

        res = await axios.post("/api/auth/patient/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res?.status === 200) {
        toast.success("Registration successful!");
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setImage(null);
        setAge(null);
        setDepartment("");
        setSpecialization("Speech Therapy for Swallowing Difficulty");
        setMedicalIssue("Speech Therapy for Swallowing Difficulty");
        setState("");
        setCity("");
        setSupervisor("");

        if(formFor === 'supervisor') router.push('/supervisor/therapist')
        if(formFor === 'therapist') router.push('/therapist/patient')
        if(formFor === 'patient') router.push('/dashboard/patient')
      } else {
        toast.error(res?.data?.error || "Server error during registration.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred during registration."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Error during registration:", error);
    }
  };

  const therapyTypes = [
    "Speech Therapy for Swallowing Difficulty",
    "Speech Therapy for Aphasia",
    "Speech Therapy for Stuttering",
    "Speech Therapy for Kids With Apraxia",
    "Speech Therapy for Late Talkers",
  ];

  return (
    <div className="mt-24 min-h-screen flex justify-center items-center">
      <Toaster></Toaster>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Speechदी! 🎉
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Register yourself!
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Tyler Durden"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </LabelInputContainer>
          </div>

          {formFor === "patient" ? (
            <>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    placeholder="Upload Image"
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0]!)}
                  />
                </LabelInputContainer>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    placeholder="21"
                    type="number"
                    onChange={(e) => setAge(parseInt(e.target.value))}
                  />
                </LabelInputContainer>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+91- 9080309023"
                type="text"
                onChange={(e) => setPhone(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>

          {formFor === "supervisor" || formFor === "therapist" ? (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="deapartment">Department</Label>
                <Input
                  id="deapartment"
                  placeholder="Enter Your Dept."
                  type="text"
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="specialization">Specialization</Label>
                <select
                  id="specialization"
                  className="w-52 h-11 rounded-lg text-white bg-[#27272A] sm:w-full"
                  defaultValue={"Speech Therapy for Swallowing Difficulty"}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  {therapyTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="medicalIssue">Your Requirement</Label>
                <select
                  id="medicalIssue"
                  className="w-52  h-11 rounded-lg text-white bg-[#27272A] sm:w-full"
                  defaultValue={"Speech Therapy for Swallowing Difficulty"}
                  onChange={(e) => setMedicalIssue(e.target.value)}
                >
                  {therapyTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
            </div>
          )}

          {formFor === "therapist" ? (
            <div className=" mt-2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="supervisor">Choose your Supervisor</Label>
                <select
                  id="supervisor"
                  className="w-52  h-11 rounded-lg text-white bg-[#27272A] sm:w-full"
                  onChange={(e) => setSupervisor(e.target.value)}
                >
                  {allSupervisors.map((supervisor: any) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.name}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
            </div>
          ) : (
            <></>
          )}

          {formFor === "therapist" || formFor === "patient" ? (
            <div className=" mt-2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  className="w-52  h-11 rounded-lg text-white bg-[#27272A] sm:w-full"
                  defaultValue={"Delhi"}
                  onChange={(e) => setState(e.target.value)}
                >
                  {states.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="state">City</Label>
                <select
                  id="state"
                  className="w-52  h-11 rounded-lg text-white bg-[#27272A] sm:w-full"
                  onChange={(e) => setCity(e.target.value)}
                >
                  {allCities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
            </div>
          ) : (
            <></>
          )}

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-4"
            type="submit"
          >
            Register &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
