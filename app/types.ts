export type Location = {
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
};

export type Profiles = {
  linkedin: string | null;
  github: string | null;
  website: string | null;
  portfolio: string | null;
};

export type PersonalInformation = {
  name: string;
  email: string;
  phone: string; // Phone number can be comma-separated for multiple numbers
  location: Location;
  profiles: Profiles;
};

export type Experience = {
  company: string;
  title: string;
  location: string | null;
  start_date: string;
  end_date: string | null; // Can be "Present"
  description: string;
  technologies: string[]; // Array of strings
};

export type Education = {
  institution: string;
  degree: string;
  major: string;
  minor: string | null;
  gpa: string | null;
  graduation_date: string;
  relevant_courses: string[]; // Array of strings
};

export type Skill = {
  name: string;
  proficiency: string;
  keywords: string[]; // Array of strings
};

export type Project = {
  name: string;
  description: string;
  link: string | null;
};

export type AwardAndRecognition = {
  title: string;
  issuing_organization: string;
  date_received: string;
  description: string;
};

export type VolunteerAndSocialActivity = {
  organization: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type Certification = {
  name: string;
  issuing_authority: string;
  date_obtained: string;
  expiry_date: string | null;
  description: string;
};

export type Language = {
  language: string;
  proficiency: string;
};

export type Interest = {
  name: string;
  keywords: string[]; // Array of strings
};

export type Reference = {
  name: string;
  position: string;
  company_or_institution: string;
  email: string;
  phone: string;
  relationship: string;
  years_known: string;
  description: string;
};

export type Publication = {
  title: string;
  authors: string[]; // Array of strings
  publication_date: string;
  publisher: string;
  link: string | null;
  description: string;
};

export type Course = {
  title: string;
  institution: string;
  completion_date: string;
  link: string | null;
  description: string;
};

export type Conference = {
  name: string;
  date: string;
  location: string;
  link: string | null;
  description: string;
};

export type SpeakingEngagement = {
  title: string;
  event: string;
  date: string;
  location: string;
  audience_size: number | null;
  video_link: string | null;
  slides_link: string | null;
  description: string;
};

export type Patent = {
  title: string;
  patent_number: string;
  filing_date: string;
  issue_date: string | null;
  status: string;
  inventors: string[]; // Array of strings
  description: string;
};

export type ProfessionalMembership = {
  organization: string;
  role: string;
  start_date: string;
  end_date: string | null;
  benefits: string[]; // Array of strings
  description: string;
};

export type MilitaryService = {
  branch: string;
  rank: string;
  start_date: string;
  end_date: string;
  location: string;
  duties: string[]; // Array of strings
  awards: string[]; // Array of strings
};

export type TeachingExperience = {
  institution: string;
  position: string;
  subject: string;
  start_date: string;
  end_date: string | null;
  description: string;
  student_level: string;
  class_size: number | null;
};

export type ResearchExperience = {
  institution: string;
  project: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  funding_source: string | null;
  publications: string[]; // Array of strings
  collaborators: string[]; // Array of strings
};

export type Resume = {
  personal_information: PersonalInformation;
  summary: string | null;
  objective: string | null;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  awards_and_recognition: AwardAndRecognition[];
  volunteer_and_social_activities: VolunteerAndSocialActivity[];
  certifications: Certification[];
  languages: Language[];
  interests: Interest[];
  references: Reference[];
  publications: Publication[];
  courses: Course[];
  conferences: Conference[];
  speaking_engagements: SpeakingEngagement[];
  patents: Patent[];
  professional_memberships: ProfessionalMembership[];
  military_service: MilitaryService[];
  teaching_experience: TeachingExperience[];
  research_experience: ResearchExperience[];
};

export type FormValues = Resume & {
  headings: { [K in keyof Resume]?: string };
  sections: (
    | 'personal_information'
    | 'summary'
    | 'objective'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'awards_and_recognition'
    | 'volunteer_and_social_activities'
    | 'certifications'
    | 'languages'
    | 'interests'
    | 'references'
    | 'publications'
    | 'courses'
    | 'conferences'
    | 'speaking_engagements'
    | 'patents'
    | 'professional_memberships'
    | 'military_service'
    | 'teaching_experience'
    | 'research_experience'
  )[];
  selectedTemplate: number;
};

export interface FormState {
  isGenerating: boolean
}

export type Generator = {
  resumeHeader: () => string;
  personalInformationSection: (personalInformation?: PersonalInformation) => string;
  summarySection: (summary?: string | null) => string;
  objectiveSection: (objective?: string | null) => string;
  experienceSection: (experience?: Array<Experience>, heading?: string) => string;
  educationSection: (education?: Array<Education>, heading?: string) => string;
  skillsSection: (skills?: Array<Skill>, heading?: string) => string;
  projectsSection: (projects?: Array<Project>, heading?: string) => string;
  awardsAndRecognitionSection: (awards?: Array<AwardAndRecognition>, heading?: string) => string;
  volunteerAndSocialActivitiesSection: (volunteer?: Array<VolunteerAndSocialActivity>, heading?: string) => string;
  certificationsSection: (certifications?: Array<Certification>, heading?: string) => string;
  languagesSection: (languages?: Array<Language>, heading?: string) => string;
  interestsSection: (interests?: Array<Interest>, heading?: string) => string;
  referencesSection: (references?: Array<Reference>, heading?: string) => string;
  publicationsSection: (publications?: Array<Publication>, heading?: string) => string;
  coursesSection: (courses?: Array<Course>, heading?: string) => string;
  conferencesSection: (conferences?: Array<Conference>, heading?: string) => string;
  speakingEngagementsSection: (speakingEngagements?: Array<SpeakingEngagement>, heading?: string) => string;
  patentsSection: (patents?: Array<Patent>, heading?: string) => string;
  professionalMembershipsSection: (memberships?: Array<ProfessionalMembership>, heading?: string) => string;
  militaryServiceSection: (militaryService?: Array<MilitaryService>, heading?: string) => string;
  teachingExperienceSection: (teachingExperience?: Array<TeachingExperience>, heading?: string) => string;
  researchExperienceSection: (researchExperience?: Array<ResearchExperience>, heading?: string) => string;
};

export type LaTeXOpts = {
  cmd: 'pdflatex' | 'xelatex'
  inputs?: string[]
  fonts?: string[]
}

export type TemplateData = {
  texDoc: string
  opts: LaTeXOpts
}
