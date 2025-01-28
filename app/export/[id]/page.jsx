"use client";
import React, { use } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Link } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ProgressSpinner } from 'primereact/progressspinner';

// Define colors
const colors = {
    primary: '#2C3E50', // Dark blue
    secondary: '#E74C3C', // Red
    accent: '#3498DB', // Light blue
    background: '#FDFDFD', // Off-white
    sidebarBackground: '#2C3E50', // Dark blue for sidebar
    sidebarText: '#FFFFFF', // White text for sidebar
    text: '#333333', // Dark gray
    lightText: '#666666', // Light gray
};

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        fontFamily: 'Helvetica',
    },
    sidebar: {
        width: '30%',
        backgroundColor: colors.sidebarBackground,
        padding: 20,
        color: colors.sidebarText,
    },
    mainContent: {
        width: '70%',
        padding: 20,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: `2px solid ${colors.accent}`,
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.sidebarText,
        marginBottom: 5,
        letterSpacing: 0.5,
    },
    contactInfo: {
        fontSize: 10,
        color: colors.sidebarText,
        lineHeight: 1.4,
        marginBottom: 10,
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
        color: colors.sidebarText,
        marginBottom: 2,
    },
    skillItems: {
        fontSize: 10,
        color: colors.sidebarText,
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

// Section Components
const PersonalInformation = ({ personal_information }) => (
    <View style={styles.header}>
        <Text style={styles.name}>{personal_information.name}</Text>
        <View style={styles.contactInfo}>
            <Text>{personal_information.location.address}, {personal_information.location.city}, {personal_information.location.state} {personal_information.location.postal_code}</Text>
            <Text>Phone: {personal_information.phone} | Email: {personal_information.email}</Text>
            <Text>
                LinkedIn: <Link src={personal_information.profiles.linkedin} style={styles.link}>{personal_information.profiles.linkedin}</Link> |{' '}
                GitHub: <Link src={personal_information.profiles.github} style={styles.link}>{personal_information.profiles.github}</Link>
                {personal_information.profiles.website && ` | Website: ${personal_information.profiles.website}`}
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

const Awards = ({ awards_and_recognition }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Awards and Recognition</Text>
        {awards_and_recognition.map((award, index) => (
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

const SpeakingEngagements = ({ speaking_engagements }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Speaking Engagements</Text>
        {speaking_engagements.map((speaking, index) => (
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

const ProfessionalMemberships = ({ professional_memberships }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Professional Memberships</Text>
        {professional_memberships.map((membership, index) => (
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

const MilitaryService = ({ military_service }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Military Service</Text>
        {military_service.map((service, index) => (
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

const TeachingExperience = ({ teaching_experience }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Teaching Experience</Text>
        {teaching_experience.map((teaching, index) => (
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

const ResearchExperience = ({ research_experience }) => (
    <View style={styles.section}>
        <Text style={styles.sectionHeader}>Research Experience</Text>
        {research_experience.map((research, index) => (
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

// Section Order Array
const sectionOrder = [
    'personal_information',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'awards_and_recognition',
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
];

// Map section keys to their corresponding components
const sectionComponents = {
    personal_information: PersonalInformation,
    summary: Summary,
    experience: Experience,
    education: Education,
    skills: Skills,
    projects: Projects,
    awards_and_recognition: Awards,
    certifications: Certifications,
    languages: Languages,
    interests: Interests,
    references: References,
    publications: Publications,
    courses: Courses,
    conferences: Conferences,
    speaking_engagements: SpeakingEngagements,
    patents: Patents,
    professional_memberships: ProfessionalMemberships,
    military_service: MilitaryService,
    teaching_experience: TeachingExperience,
    research_experience: ResearchExperience,
};

// Main Resume Component
const Resume = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                {sectionOrder
                    .filter((section) => ['personal_information', 'skills', 'languages', 'interests'].includes(section))
                    .map((section) => {
                        const SectionComponent = sectionComponents[section];
                        if (data[section] && SectionComponent) {
                            return <SectionComponent key={section} {...{ [section]: data[section] }} />;
                        }
                        return null;
                    })}
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {sectionOrder
                    .filter((section) => !['personal_information', 'skills', 'languages', 'interests'].includes(section))
                    .map((section) => {
                        const SectionComponent = sectionComponents[section];
                        if (data[section] && SectionComponent &&
                            (!Array.isArray(data[section]) || data[section].length > 0)) {
                            return <SectionComponent key={section} {...{ [section]: data[section] }} />;
                        }
                        return null;
                    })}
            </View>
        </Page>
    </Document>
);

// App Component
const App = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const fetchResumeData = async () => {
            // if (status === 'loading') return;

            setLoading(true);

            // If data is in local storage, get the resume data with the id from local storage
            const data = localStorage.getItem('data');

            if (data) {
                // Data is an array of objects which contains the resume
                const resume = JSON.parse(data).find((item) => item.id === Number(params.id));
                if (!resume) {
                    router.push('/main/dashboard');
                    return;
                }
                setResumeData(resume.resume);
                setLoading(false);
                return;
            }

            // get the resume data from the backend if not exists in local storage
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resumes/${params.id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            ...(session?.accessToken && {
                                'Authorization': `Bearer ${session.accessToken}`
                            })
                        }
                    }
                );
                const resume = response.data.resume;
                setResumeData(resume);
                console.log(resume);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message,
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [params.id]);


    return loading ? (
        <> <ProgressSpinner /> </>
    ) :
        (
            <div style={{ width: '100%', height: '1200px' }}>
                <PDFViewer wrap={false} showToolbar={true} width="100%" height="100%">
                    <Resume data={resumeData} />
                </PDFViewer>
            </div>
        );
}

export default App;
