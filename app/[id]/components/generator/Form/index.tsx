import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import styled from 'styled-components'


import { resumeAtom } from '../../../../atoms/resume'
import { FormValues } from '../../../../types'

import latex from '../../../../../lib/latex'
import getTemplateData from '../../../../../lib/templates'
import { PrimaryButton } from '../../core/Button'

async function generateResume(formData: FormValues): Promise<string> {
  const { texDoc, opts } = getTemplateData(formData)
  return latex(texDoc, opts)
}

const StyledForm = styled.form`
  grid-area: form;
  overflow: auto;
`

const initialFormValues: FormValues = {
  headings: {},
  sections: [
    'personal_information',
    'summary',
    'objective',
    'experience',
    'education',
    'skills',
    'projects',
    'awards_and_recognition',
    'volunteer_and_social_activities',
    'certifications',
    'languages',
    'interests',
    'references',
    'publications',
    'courses',
    'conferences',
    'speaking_engagements',
    'patents',
    'professional_memberships',
    'military_service',
    'teaching_experience',
    'research_experience',
  ],
  selectedTemplate: 1,
};

export function Form() {
const resumeId = 74
  const [resume, setResume] = useAtom(resumeAtom)
  const formContext = useForm<FormValues>({ defaultValues: initialFormValues })

  // TODO: move this to a custom react hook
  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("data");
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed data:", parsedData); // Debug log

        // Find resume by resumeId
        const foundItem = parsedData.find(item => item.id === Number(resumeId));
        console.log("Found item:", foundItem); // Debug log

        const selectedResume = foundItem?.resume;
        console.log("Selected resume:", selectedResume); // Debug log

        if (selectedResume) {
            // Restructuring the data
            const headings = Object.keys(selectedResume).reduce((acc, key) => {
                acc[key] = key.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                return acc;
            }, {});

            const sections = Object.keys(selectedResume);
            const selectedTemplate = 1;

            const structuredResume = {
                headings,
                sections,
                selectedTemplate,
                ...selectedResume,
            };

            console.log("Structured resume:", structuredResume); // Debug log

            // Update the form with the structured resume data
            formContext.reset(structuredResume);
            setResume({ ...resume, ...structuredResume, isLoading: true });
        }
    }

}, [formContext])

  const handleFormSubmit = useCallback(async () => {
    const formValues = formContext.getValues()
    setResume({ ...resume, isLoading: true })
    try {
      const newResumeUrl = await generateResume(formValues)
      console.log("formValues", formValues)
      setResume({ ...resume, url: newResumeUrl, isLoading: false })
    } catch (error) {
      console.error(error)
      setResume({ ...resume, isError: true, isLoading: false })
    }
  }, [formContext, resume, setResume])

  return (

    <>
       <PrimaryButton form="resume-form" onClick={handleFormSubmit}>
            Generate
            </PrimaryButton>
    </>

  )
}



const data = {
    "headings": {
      "personal_information": "Personal Information",
      "summary": "Summary",
      "objective": "Objective",
      "experience": "Experience",
      "education": "Education",
      "skills": "Skills",
      "projects": "Projects",
      "awards_and_recognition": "Awards And Recognition",
      "volunteer_and_social_activities": "Volunteer & Social Activities",
      "certifications": "Certifications",
      "languages": "Languages",
      "interests": "Interests",
      "references": "References",
      "publications": "Publications",
      "courses": "Courses",
      "conferences": "Conferences",
      "speaking_engagements": "Speaking Engagements",
      "patents": "Patents",
      "professional_memberships": "Professional Memberships",
      "military_service": "Military Service",
      "teaching_experience": "Teaching Experience",
      "research_experience": "Research Experience"
    },
    "sections": [
      "personal_information",
      "summary",
      "objective",
      "experience",
      "education",
      "skills",
      "projects",
      "awards_and_recognition",
      "volunteer_and_social_activities",
      "certifications",
      "languages",
      "interests",
      "references",
      "publications",
      "courses",
      "conferences",
      "speaking_engagements",
      "patents",
      "professional_memberships",
      "military_service",
      "teaching_experience",
      "research_experience"
    ],
    "selectedTemplate": 1,
    "personal_information": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 (123) 456-7890",
      "location": {
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001"
      },
      "profiles": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
        "website": "https://johndoe.com",
        "portfolio": "https://portfolio.johndoe.com"
      }
    },
    "summary": "Experienced software engineer with a passion for building scalable and efficient systems. Proficient in JavaScript, Python, and cloud technologies.",
    "objective": "Seeking a challenging role as a Senior Software Engineer to leverage my skills in full-stack development and cloud computing.",
    "experience": [
      {
        "company": "Tech Corp",
        "title": "Senior Software Engineer",
        "location": "San Francisco, CA",
        "start_date": "2019-06",
        "end_date": "Present",
        "description": "Led a team of 5 engineers to develop and maintain a cloud-based SaaS platform.",
        "technologies": ["JavaScript", "Node.js", "AWS", "React"]
      },
      {
        "company": "Startup Inc",
        "title": "Software Engineer",
        "location": "New York, NY",
        "start_date": "2016-05",
        "end_date": "2019-05",
        "description": "Developed and deployed microservices for a high-traffic e-commerce platform.",
        "technologies": ["Python", "Django", "Docker", "Kubernetes"]
      }
    ],
    "education": [
      {
        "institution": "University of California, Berkeley",
        "degree": "Bachelor of Science",
        "major": "Computer Science",
        "minor": "Mathematics",
        "gpa": "3.8",
        "graduation_date": "2016-05",
        "relevant_courses": ["Data Structures", "Algorithms", "Machine Learning"]
      }
    ],
    "skills": [
      {
        "name": "Programming Languages",
        "proficiency": "Advanced",
        "keywords": ["JavaScript", "Python", "Java"]
      },
      {
        "name": "Cloud Technologies",
        "proficiency": "Intermediate",
        "keywords": ["AWS", "Docker", "Kubernetes"]
      }
    ],
    "projects": [
      {
        "name": "E-commerce Platform",
        "description": "Built a scalable e-commerce platform using microservices architecture.",
        "link": "https://github.com/johndoe/ecommerce"
      }
    ],
    "awards_and_recognition": [
      {
        "title": "Best Hackathon Project",
        "issuing_organization": "Tech Innovators",
        "date_received": "2020-10",
        "description": "Awarded for developing an innovative AI-powered chatbot."
      }
    ],
    "volunteer_and_social_activities": [
      {
        "organization": "Code for America",
        "position": "Volunteer Developer",
        "start_date": "2018-01",
        "end_date": "2020-12",
        "description": "Contributed to open-source projects aimed at improving public services."
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuing_authority": "Amazon Web Services",
        "date_obtained": "2021-03",
        "expiry_date": "2024-03",
        "description": "Certified in designing and deploying scalable systems on AWS."
      }
    ],
    "languages": [
      {
        "language": "English",
        "proficiency": "Native"
      },
      {
        "language": "Spanish",
        "proficiency": "Intermediate"
      }
    ],
    "interests": [
      {
        "name": "Artificial Intelligence",
        "keywords": ["Machine Learning", "Neural Networks"]
      }
    ],
    "references": [
      {
        "name": "Jane Smith",
        "position": "Senior Engineer",
        "company_or_institution": "Tech Corp",
        "email": "jane.smith@example.com",
        "phone": "+1 (234) 567-8901",
        "relationship": "Former Manager",
        "years_known": "3",
        "description": "John is a highly skilled engineer with a strong work ethic."
      }
    ],
    "publications": [
      {
        "title": "Building Scalable Systems with Kubernetes",
        "authors": ["John Doe"],
        "publication_date": "2022-01",
        "publisher": "Tech Journal",
        "link": "https://techjournal.com/scalable-systems",
        "description": "An in-depth guide to scaling applications using Kubernetes."
      }
    ],
    "courses": [
      {
        "title": "Advanced Machine Learning",
        "institution": "Coursera",
        "completion_date": "2021-12",
        "link": "https://coursera.org/advanced-ml",
        "description": "Learned advanced techniques in machine learning and AI."
      }
    ],
    "conferences": [
      {
        "name": "AWS re:Invent",
        "date": "2022-11",
        "location": "Las Vegas, NV",
        "link": "https://reinvent.awsevents.com",
        "description": "Attended sessions on cloud computing and serverless architectures."
      }
    ],
    "speaking_engagements": [
      {
        "title": "Scaling Microservices",
        "event": "DevOps Conference",
        "date": "2021-09",
        "location": "San Francisco, CA",
        "audience_size": 500,
        "video_link": "https://youtube.com/scaling-microservices",
        "slides_link": "https://slides.com/scaling-microservices",
        "description": "Presented best practices for scaling microservices in production."
      }
    ],
    "patents": [
      {
        "title": "AI-Powered Chatbot",
        "patent_number": "US1234567",
        "filing_date": "2020-05",
        "issue_date": "2021-06",
        "status": "Granted",
        "inventors": ["John Doe", "Jane Smith"],
        "description": "A chatbot that uses AI to provide personalized customer support."
      }
    ],
    "professional_memberships": [
      {
        "organization": "IEEE",
        "role": "Member",
        "start_date": "2018-01",
        "end_date": null,
        "benefits": ["Access to research papers", "Networking opportunities"],
        "description": "Active member of the IEEE Computer Society."
      }
    ],
    "military_service": [
      {
        "branch": "US Army",
        "rank": "Sergeant",
        "start_date": "2010-06",
        "end_date": "2014-06",
        "location": "Fort Bragg, NC",
        "duties": ["Team leadership", "Logistics management"],
        "awards": ["Army Achievement Medal"]
      }
    ],
    "teaching_experience": [
      {
        "institution": "University of California, Berkeley",
        "position": "Teaching Assistant",
        "subject": "Data Structures",
        "start_date": "2015-09",
        "end_date": "2016-05",
        "description": "Assisted in teaching and grading for the Data Structures course.",
        "student_level": "Undergraduate",
        "class_size": 100
      }
    ],
    "research_experience": [
      {
        "institution": "Stanford University",
        "project": "AI for Healthcare",
        "role": "Research Assistant",
        "start_date": "2017-06",
        "end_date": "2018-08",
        "description": "Conducted research on applying AI to improve healthcare diagnostics.",
        "funding_source": "National Science Foundation",
        "publications": ["AI in Healthcare: A Review"],
        "collaborators": ["Dr. Jane Smith", "Dr. John Doe"]
      }
    ]
  }
