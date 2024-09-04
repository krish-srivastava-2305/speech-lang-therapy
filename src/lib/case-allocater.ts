type TherapistType = {
    id: string;
    city: string | null;
    specialization: string | null;
    workload: number | null;
    supervisorId: string | null;
};

export function caseAllocater(therapists: Array<TherapistType>, patientCity: string, patientMedicalHistory: string): TherapistType | null {
    // Filter therapists based on city, specialization, and workload <= 10
    const filteredTherapists = therapists.filter(therapist => 
        therapist.city === patientCity &&
        therapist.specialization === patientMedicalHistory &&
        Number(therapist.workload) <= 10
    );

    // If no therapists match the criteria, return null
    if (filteredTherapists.length === 0) {
        return null;
    }

    // Sort the filtered therapists by workload in ascending order
    filteredTherapists.sort((a, b) => Number(a.workload) - Number(b.workload));

    // Return the therapist with the least workload
    return filteredTherapists[0];
}
