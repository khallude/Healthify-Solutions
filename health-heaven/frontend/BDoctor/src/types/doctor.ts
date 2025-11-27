export interface DoctorFormData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    specialty: string;
    experience: number;
    hospitalAffiliation: string;
    certificateUrl: string;
    govIDUrl: string;
    profilePictureUrl: string;
    fees: number;
    location: string;
  }
  
  export const specialties = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Urology",
    "Family Medicine",
    "Internal Medicine",
    "Emergency Medicine",
    "Other"
  ];