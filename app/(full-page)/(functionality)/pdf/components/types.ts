export interface Location {
    address: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
}

export interface Profiles {
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
}

export interface Experience {
    id: string;
    company: string;
    title: string;
    location?: string;
    start_date: string;
    end_date?: string; // Can be "Present" or a date string
    description: string;
    technologies: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    major: string;
    minor?: string;
    gpa?: string;
    graduation_date: string;
    relevant_courses?: string[];
}

export interface Skills {
    id: string;
    name: string;
    keywords: string[];
}

export interface Projects {
    id: string;
    name: string;
    description: string;
    link?: string;
}

export interface Languages {
    id: string;
    language: string;
    proficiency: string;
}

export interface ResumeType {
    personal_information: {
        name: string;
        email: string;
        phone: string[];
        location?: Location;
        profiles: Profiles;
    };
    summary?: string;
    objective?: string;
    experience: Experience[];
    education: Education[];
    skills: Skills[];
    projects?: Projects[];
    awards_and_recognition?: string[];
    certifications?: string[];
    languages: Languages[];
    interests?: string[];
}
