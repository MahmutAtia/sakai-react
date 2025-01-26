"use client";
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Link } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';


const data = {
    "personal_information": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "location": {
            "address": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "postal_code": "12345"
        },
        "profiles": {
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe",
            "website": "https://johndoe.com",
            "portfolio": "https://portfolio.johndoe.com"
        }
    },
    "summary": "Experienced software engineer with a passion for building scalable web applications.",
    "objective": "To leverage my skills in software development to contribute to innovative projects.",
    "experience": [
        {
            "company": "Tech Corp",
            "title": "Senior Software Engineer",
            "location": "San Francisco, CA",
            "start_date": "2018-06",
            "end_date": "2021-12",
            "description": "Developed and maintained web applications using React and Node.js.",
            "technologies": ["React", "Node.js", "AWS"]
        }
    ],
    "education": [
        {
            "institution": "University of California, Berkeley",
            "degree": "Bachelor of Science",
            "major": "Computer Science",
            "minor": "Mathematics",
            "gpa": "3.8",
            "graduation_date": "2018-05",
            "relevant_courses": ["Data Structures", "Algorithms", "Machine Learning"]
        }
    ],
    "skills": [
        {
            "name": "Programming Languages",
            "proficiency": "Advanced",
            "keywords": ["JavaScript", "Python", "Java"]
        }
    ],
    "projects": [
        {
            "name": "E-commerce Platform",
            "description": "Built a full-stack e-commerce platform using React and Node.js.",
            "link": "https://github.com/johndoe/ecommerce"
        }
    ],
    "awards_and_recognition": [
        {
            "title": "Best Software Engineer",
            "issuing_organization": "Tech Awards 2021",
            "date_received": "2021-12-15",
            "description": "Awarded for outstanding contributions to software development."
        }
    ],
    "volunteer_and_social_activities": [
        {
            "organization": "Code for Good",
            "position": "Volunteer Developer",
            "start_date": "2019-01",
            "end_date": "2020-12",
            "description": "Developed software solutions for non-profit organizations."
        }
    ],
    "certifications": [
        {
            "name": "AWS Certified Developer",
            "issuing_authority": "Amazon Web Services",
            "date_obtained": "2020-06-01",
            "expiry_date": "2023-06-01",
            "description": "Certified in developing and maintaining applications on AWS."
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
            "name": "Technology",
            "keywords": ["AI", "Blockchain", "Web Development"]
        }
    ],
    "references": [
        {
            "name": "Jane Smith",
            "position": "Senior Manager",
            "company_or_institution": "Tech Corp",
            "email": "jane.smith@example.com",
            "phone": "+0987654321",
            "relationship": "Former Manager",
            "years_known": "3",
            "description": "John is a highly skilled and dedicated software engineer."
        }
    ],
    "publications": [
        {
            "title": "Building Scalable Web Applications",
            "authors": ["John Doe"],
            "publication_date": "2021-05-01",
            "publisher": "Tech Journal",
            "link": "https://techjournal.com/building-scalable-web-apps",
            "description": "A comprehensive guide to building scalable web applications."
        }
    ],
    "courses": [
        {
            "title": "Advanced React",
            "institution": "Udemy",
            "completion_date": "2020-03-01",
            "link": "https://udemy.com/advanced-react",
            "description": "Learned advanced concepts in React development."
        }
    ],
    "conferences": [
        {
            "name": "React Summit 2021",
            "date": "2021-10-15",
            "location": "San Francisco, CA",
            "link": "https://reactsummit.com",
            "description": "Attended workshops and sessions on React development."
        }
    ],
    "speaking_engagements": [
        {
            "title": "Introduction to React Hooks",
            "event": "React Meetup",
            "date": "2021-08-10",
            "location": "Online",
            "audience_size": "100",
            "video_link": "https://youtube.com/react-hooks",
            "slides_link": "https://slides.com/react-hooks",
            "description": "Delivered a talk on React Hooks at a local meetup."
        }
    ],
    "patents": [
        {
            "title": "System for Efficient Data Processing",
            "patent_number": "US1234567",
            "filing_date": "2020-01-15",
            "issue_date": "2021-05-01",
            "status": "Granted",
            "inventors": ["John Doe", "Jane Smith"],
            "description": "A system for processing large datasets efficiently."
        }
    ],
    "professional_memberships": [
        {
            "organization": "ACM",
            "role": "Member",
            "start_date": "2019-01-01",
            "end_date": "Present",
            "benefits": ["Networking", "Access to Journals"],
            "description": "Active member of the Association for Computing Machinery."
        }
    ],
    "military_service": [
        {
            "branch": "US Army",
            "rank": "Sergeant",
            "start_date": "2010-06-01",
            "end_date": "2014-06-01",
            "location": "Fort Bragg, NC",
            "duties": ["Leadership", "Training"],
            "awards": ["Army Commendation Medal"]
        }
    ],
    "teaching_experience": [
        {
            "institution": "Local Community College",
            "position": "Adjunct Professor",
            "subject": "Computer Science",
            "start_date": "2019-09-01",
            "end_date": "2021-05-01",
            "description": "Taught introductory programming courses.",
            "student_level": "Undergraduate",
            "class_size": "30"
        }
    ],
    "research_experience": [
        {
            "institution": "University of California, Berkeley",
            "project": "AI for Social Good",
            "role": "Research Assistant",
            "start_date": "2017-06-01",
            "end_date": "2018-05-01",
            "description": "Researched applications of AI in social impact projects.",
            "funding_source": "NSF Grant",
            "publications": ["AI for Social Good: A Case Study"],
            "collaborators": ["Dr. Jane Smith", "Dr. John Doe"]
        }
    ]
}
// Define colors
const colors = {
    primary: '#2C3E50', // Dark blue
    secondary: '#E74C3C', // Red
    accent: '#3498DB', // Light blue
    background: '#FDFDFD', // Off-white
    text: '#333333', // Dark gray
    lightText: '#666666', // Light gray
};

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: colors.background,
        fontFamily: 'Helvetica', // Use default font
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 5,
        letterSpacing: 0.5,
    },
    contactInfo: {
        fontSize: 11,
        color: colors.lightText,
        lineHeight: 1.4,
    },
    link: {
        color: colors.accent,
        textDecoration: 'none',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        borderBottom: `1px solid ${colors.secondary}`,
        paddingBottom: 3,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    company: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
    },
    date: {
        fontSize: 10,
        color: colors.lightText,
    },
    position: {
        fontSize: 11,
        color: colors.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 10,
        color: colors.text,
        lineHeight: 1.4,
        textAlign: 'justify',
        marginBottom: 6,
    },
    technologies: {
        fontSize: 9,
        color: colors.lightText,
        fontStyle: 'italic',
    },
    educationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    institution: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
    },
    degree: {
        fontSize: 11,
        color: colors.text,
    },
    skillCategory: {
        marginBottom: 8,
    },
    skillName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 2,
    },
    skillItems: {
        fontSize: 10,
        color: colors.text,
        lineHeight: 1.4,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: colors.lightText,
    },
});

// Components
const PersonalInformation = ({ data }) => (
    <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.contactInfo}>
            <Text>{data.location.address}, {data.location.city}, {data.location.state} {data.location.postal_code}</Text>
            <Text>Phone: {data.phone} | Email: {data.email}</Text>
            <Text>
                LinkedIn: <Link src={data.profiles.linkedin} style={styles.link}>{data.profiles.linkedin}</Link> |{' '}
                GitHub: <Link src={data.profiles.github} style={styles.link}>{data.profiles.github}</Link>
                {data.profiles.website && ` | Website: ${data.profiles.website}`}
            </Text>
        </View>
    </View>
);

const Summary = ({ summary }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Professional Summary</Text>
        <Text style={styles.description}>{summary}</Text>
    </View>
);

const Experience = ({ experience }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Professional Experience</Text>
        {experience.map((job, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <View style={styles.jobHeader}>
                    <Text style={styles.company}>{job.company}</Text>
                    <Text style={styles.date}>
                        {job.start_date} - {job.end_date || 'Present'}
                    </Text>
                </View>
                <Text style={styles.position}>{job.title} | {job.location}</Text>
                <Text style={styles.description}>{job.description}</Text>
                {job.technologies && job.technologies.length > 0 && (
                    <Text style={styles.technologies}>
                        Technologies: {job.technologies.join(', ')}
                    </Text>
                )}
            </View>
        ))}
    </View>
);

const Education = ({ education }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Education</Text>
        {education.map((school, index) => (
            <View key={index} style={styles.educationItem}>
                <View>
                    <Text style={styles.institution}>{school.institution}</Text>
                    <Text style={styles.degree}>
                        {school.degree} in {school.major}
                        {school.minor && `, Minor in ${school.minor}`}
                    </Text>
                </View>
                <View>
                    <Text style={styles.date}>{school.graduation_date}</Text>
                    {school.gpa && <Text style={styles.date}>GPA: {school.gpa}</Text>}
                </View>
            </View>
        ))}
    </View>
);

const Skills = ({ skills }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Technical Skills</Text>
        {skills.map((skill, index) => (
            <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillItems}>
                    {skill.keywords.join(' • ')}
                </Text>
            </View>
        ))}
    </View>
);

const Projects = ({ projects }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Projects</Text>
        {projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{project.name}</Text>
                <Text style={styles.description}>{project.description}</Text>
                {project.link && (
                    <Link src={project.link} style={styles.link}>
                        View Project
                    </Link>
                )}
            </View>
        ))}
    </View>
);

const Awards = ({ awards }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Awards and Recognition</Text>
        {awards.map((award, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{award.title}</Text>
                <Text style={styles.description}>{award.description}</Text>
                <Text style={styles.date}>
                    Issued by: {award.issuing_organization} | Date: {award.date_received}
                </Text>
            </View>
        ))}
    </View>
);

const Certifications = ({ certifications }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Certifications</Text>
        {certifications.map((cert, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{cert.name}</Text>
                <Text style={styles.description}>{cert.description}</Text>
                <Text style={styles.date}>
                    Issued by: {cert.issuing_authority} | Date: {cert.date_obtained}
                    {cert.expiry_date && ` | Expiry: ${cert.expiry_date}`}
                </Text>
            </View>
        ))}
    </View>
);

const Languages = ({ languages }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Languages</Text>
        {languages.map((lang, index) => (
            <View key={index} style={{ marginBottom: 6 }}>
                <Text style={styles.skillName}>{lang.language}</Text>
                <Text style={styles.skillItems}>Proficiency: {lang.proficiency}</Text>
            </View>
        ))}
    </View>
);

const Interests = ({ interests }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Interests</Text>
        {interests.map((interest, index) => (
            <View key={index} style={{ marginBottom: 6 }}>
                <Text style={styles.skillName}>{interest.name}</Text>
                <Text style={styles.skillItems}>{interest.keywords.join(', ')}</Text>
            </View>
        ))}
    </View>
);

const References = ({ references }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>References</Text>
        {references.map((ref, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{ref.name}</Text>
                <Text style={styles.description}>{ref.position} at {ref.company_or_institution}</Text>
                <Text style={styles.date}>
                    Email: {ref.email} | Phone: {ref.phone}
                </Text>
            </View>
        ))}
    </View>
);

const Publications = ({ publications }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Publications</Text>
        {publications.map((pub, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{pub.title}</Text>
                <Text style={styles.description}>{pub.description}</Text>
                <Text style={styles.date}>
                    Published by: {pub.publisher} | Date: {pub.publication_date}
                </Text>
            </View>
        ))}
    </View>
);

const Courses = ({ courses }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Courses</Text>
        {courses.map((course, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{course.title}</Text>
                <Text style={styles.description}>{course.description}</Text>
                <Text style={styles.date}>
                    Institution: {course.institution} | Completed: {course.completion_date}
                </Text>
            </View>
        ))}
    </View>
);

const Conferences = ({ conferences }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Conferences</Text>
        {conferences.map((conf, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{conf.name}</Text>
                <Text style={styles.description}>{conf.description}</Text>
                <Text style={styles.date}>
                    Location: {conf.location} | Date: {conf.date}
                </Text>
            </View>
        ))}
    </View>
);

const SpeakingEngagements = ({ speakingEngagements }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Speaking Engagements</Text>
        {speakingEngagements.map((speaking, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{speaking.title}</Text>
                <Text style={styles.description}>{speaking.description}</Text>
                <Text style={styles.date}>
                    Event: {speaking.event} | Date: {speaking.date}
                </Text>
            </View>
        ))}
    </View>
);

const Patents = ({ patents }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Patents</Text>
        {patents.map((patent, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{patent.title}</Text>
                <Text style={styles.description}>{patent.description}</Text>
                <Text style={styles.date}>
                    Patent Number: {patent.patent_number} | Filed: {patent.filing_date}
                </Text>
            </View>
        ))}
    </View>
);

const ProfessionalMemberships = ({ memberships }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Professional Memberships</Text>
        {memberships.map((membership, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{membership.organization}</Text>
                <Text style={styles.description}>{membership.role}</Text>
                <Text style={styles.date}>
                    Start: {membership.start_date} | End: {membership.end_date}
                </Text>
            </View>
        ))}
    </View>
);

const MilitaryService = ({ militaryService }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Military Service</Text>
        {militaryService.map((service, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{service.branch}</Text>
                <Text style={styles.description}>{service.rank}</Text>
                <Text style={styles.date}>
                    Start: {service.start_date} | End: {service.end_date}
                </Text>
            </View>
        ))}
    </View>
);

const TeachingExperience = ({ teachingExperience }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Teaching Experience</Text>
        {teachingExperience.map((teaching, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{teaching.institution}</Text>
                <Text style={styles.description}>{teaching.subject}</Text>
                <Text style={styles.date}>
                    Start: {teaching.start_date} | End: {teaching.end_date}
                </Text>
            </View>
        ))}
    </View>
);

const ResearchExperience = ({ researchExperience }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Research Experience</Text>
        {researchExperience.map((research, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{research.institution}</Text>
                <Text style={styles.description}>{research.project}</Text>
                <Text style={styles.date}>
                    Start: {research.start_date} | End: {research.end_date}
                </Text>
            </View>
        ))}
    </View>
);

// Main Resume Component
const Resume = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <PersonalInformation data={data.personal_information} />
            {data.summary && <Summary summary={data.summary} />}
            {data.experience && <Experience experience={data.experience} />}
            {data.education && <Education education={data.education} />}
            {data.skills && <Skills skills={data.skills} />}
            {data.projects && <Projects projects={data.projects} />}
            {data.awards_and_recognition && <Awards awards={data.awards_and_recognition} />}
            {data.certifications && <Certifications certifications={data.certifications} />}
            {data.languages && <Languages languages={data.languages} />}
            {data.interests && <Interests interests={data.interests} />}
            {data.references && <References references={data.references} />}
            {data.publications && <Publications publications={data.publications} />}
            {data.courses && <Courses courses={data.courses} />}
            {data.conferences && <Conferences conferences={data.conferences} />}
            {data.speaking_engagements && <SpeakingEngagements speakingEngagements={data.speaking_engagements} />}
            {data.patents && <Patents patents={data.patents} />}
            {data.professional_memberships && <ProfessionalMemberships memberships={data.professional_memberships} />}
            {data.military_service && <MilitaryService militaryService={data.military_service} />}
            {data.teaching_experience && <TeachingExperience teachingExperience={data.teaching_experience} />}
            {data.research_experience && <ResearchExperience researchExperience={data.research_experience} />}
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    </Document>
);





const App = () => (
    <div className='  bg-red-500 flex justify-center items-center' style={{ width: '100%', height: '1200px' }}>
        hello
        <PDFViewer
            wrap={false}
            showToolbar={false}
            width="90%"
            height="95%"
            fileName="resume.pdf"
            style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                backgroundColor: '#ffffff',
                padding: '16px',
            }}
        >
            <Resume data={data} />
        </PDFViewer>
    </div>
);

export default App;
