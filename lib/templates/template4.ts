import { stripIndent, source } from 'common-tags';
import { WHITESPACE } from './constants';
import { FormValues, Generator } from '../../types';

function escapeLatex(text) {
    if (typeof text !== 'string') {
        return text; // Return the input as-is if it's not a string
    }

    // Escape special LaTeX characters
    return text
        .replace(/\\/g, '\\textbackslash') // Escape backslashes first
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/~/g, '\\textasciitilde')
        .replace(/\^/g, '\\textasciicircum');
}

const generator: Generator = {
    resumeHeader() {
        return stripIndent`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            % This is a modified ONE COLUMN version of
            % the following template:
            %
            % Deedy - One Page Two Column Resume
            % LaTeX Template
            % Version 1.1 (30/4/2014)
            %
            % Original author:
            % Debarghya Das (http://debarghyadas.com)
            %
            % Original repository:
            % https://github.com/deedydas/Deedy-Resume
            %
            % IMPORTANT: THIS TEMPLATE NEEDS TO BE COMPILED WITH XeLaTeX
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        `;
    },

    profileSection(personalInformation) {
        if (!personalInformation) {
            return '\\namesection{Your}{Name}{}';
        }

        const { name, email, phone, location, profiles } = personalInformation;
        const { linkedin, github, website, portfolio } = profiles || {};

        const address = location?.address || '';
        const city = location?.city || '';
        const state = location?.state || '';
        const postalCode = location?.postal_code || '';

        const locationLine = [address, city, state, postalCode]
            .filter(Boolean)
            .map(escapeLatex)
            .join(', ');

        const profileLines = [
            linkedin ? `\\href{${escapeLatex(linkedin)}}{LinkedIn}` : '',
            github ? `\\href{${escapeLatex(github)}}{GitHub}` : '',
            website ? `\\href{${escapeLatex(website)}}{Website}` : '',
            portfolio ? `\\href{${escapeLatex(portfolio)}}{Portfolio}` : '',
        ]
            .filter(Boolean)
            .join(' | ');

        const info = [locationLine, escapeLatex(email), escapeLatex(phone), profileLines]
            .filter(Boolean)
            .join(' | ');

        let nameStart = '';
        let nameEnd = '';

        if (name) {
            const names = name.split(' ');

            if (names.length === 1) {
                nameStart = names[0];
                nameEnd = '';
            } else {
                nameStart = names[0];
                nameEnd = names.slice(1, names.length).join(' ');
            }
        }

        return stripIndent`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Profile
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\namesection{${escapeLatex(nameStart)}}{${escapeLatex(nameEnd)}}{${info}}
        `;
    },

    educationSection(education, heading) {
        if (!education) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Education
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Education')}}
            \\raggedright
            ${education.map((school) => {
                const { institution, degree, major, minor, gpa, graduation_date, relevant_courses } = school;

                let line1 = '';
                let line2 = '';

                if (institution) {
                    line1 += `\\runsubsection{${escapeLatex(institution)}}`;
                }

                if (degree) {
                    line2 += escapeLatex(degree);
                }

                if (major) {
                    line2 += degree ? ` in ${escapeLatex(major)}` : `Major in ${escapeLatex(major)}`;
                }

                if (minor) {
                    line2 += `, Minor in ${escapeLatex(minor)}`;
                }

                if (gpa) {
                    line2 += ` \\textit{GPA: ${escapeLatex(gpa)}}`;
                }

                if (graduation_date) {
                    line2 += ` \\hfill ${escapeLatex(graduation_date)}`;
                }

                if (line1) line1 += '\\\\';
                if (line2) line2 += '\\\\';

                let coursesLine = '';
                if (relevant_courses && relevant_courses.length > 0) {
                    coursesLine = source`
                        \\textbf{Relevant Courses:} ${relevant_courses.map(escapeLatex).join(', ')}
                    `;
                }

                return stripIndent`
                    ${line1}
                    ${line2}
                    ${coursesLine}
                    \\sectionsep
                `;
            })}
        `;
    },

    workSection(experience, heading) {
        if (!experience) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Experience
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Experience')}}
            ${experience.map((job) => {
                const { company, title, location, start_date, end_date, description, technologies } = job;

                let line1 = '';
                let line2 = '';
                let highlightLines = '';

                if (company) {
                    line1 += `\\runsubsection{${escapeLatex(company)}}`;
                }

                if (title) {
                    line1 += `\\descript{| ${escapeLatex(title)}}`;
                }

                if (location) {
                    line1 += `\\hfill \\location{${escapeLatex(location)}}`;
                }

                if (start_date && end_date) {
                    line2 += `${escapeLatex(start_date)} - ${escapeLatex(end_date)}`;
                } else if (start_date) {
                    line2 += `${escapeLatex(start_date)} - Present`;
                }

                if (line1) line1 += '\\\\';
                if (line2) line2 += '\\\\';

                if (description) {
                    highlightLines = source`
                        \\begin{tightemize}
                            \\item ${escapeLatex(description)}
                        \\end{tightemize}
                    `;
                }

                if (technologies && technologies.length > 0) {
                    highlightLines += source`
                        \\textbf{Technologies:} ${technologies.map(escapeLatex).join(', ')}
                    `;
                }

                return stripIndent`
                    ${line1}
                    ${line2}
                    ${highlightLines}
                    \\sectionsep
                `;
            })}
        `;
    },

    skillsSection(skills, heading) {
        if (!skills) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Skills
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Skills')}}
            \\raggedright
            \\begin{tabularx}{\\textwidth}{ l X }
            ${skills.map((skill) => {
                const { name = '', keywords = [] } = skill;
                return `${escapeLatex(name)} & ${keywords.map(escapeLatex).join(', ')} \\\\`;
            })}
            \\end{tabularx}
            \\sectionsep
        `;
    },

    projectsSection(projects, heading) {
        if (!projects) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Projects
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Projects')}}
            \\raggedright
            \\begin{tabularx}{\\textwidth}{ l X }
            ${projects.map((project) => {
                const { name, description, link } = project;

                let line1 = '';
                let line2 = '';

                if (name) {
                    line1 += `\\textbf{${escapeLatex(name)}}`;
                }

                if (link) {
                    line1 += ` \\hfill \\href{${escapeLatex(link)}}{${escapeLatex(link)}}`;
                }

                if (line1) line1 += '\\\\';

                if (description) {
                    line2 += `${escapeLatex(description)}`;
                }

                return stripIndent`
                    ${line1} & ${line2} \\\\
                `;
            })}
            \\end{tabularx}
            \\sectionsep
        `;
    },

    awardsSection(awards, heading) {
        if (!awards) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Awards
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Awards')}}
            ${awards.map((award) => {
                const { title, issuing_organization, date_received, description } = award;

                let line1 = '';
                let line2 = '';

                if (title) {
                    line1 += `\\runsubsection{\\large{${escapeLatex(title)}}}`;
                }

                if (issuing_organization) {
                    line1 += `\\descript{${escapeLatex(issuing_organization)}}`;
                }

                if (date_received) {
                    line2 += `${escapeLatex(date_received)}`;
                }

                if (line1) line1 += '\\\\';
                if (line2) line2 += '\\\\';

                if (description) {
                    line2 += `${escapeLatex(description)}\\\\`;
                }

                return stripIndent`
                    ${line1}
                    ${line2}
                    \\sectionsep
                `;
            })}
        `;
    },

    certificationsSection(certifications, heading) {
        if (!certifications) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Certifications
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Certifications')}}
            \\raggedright
            \\begin{tabularx}{\\textwidth}{ l X }
            ${certifications.map((cert) => {
                const { name, issuing_authority, date_obtained, expiry_date, description } = cert;

                let line1 = '';
                let line2 = '';

                if (name) {
                    line1 += `\\textbf{${escapeLatex(name)}}`;
                }

                if (issuing_authority) {
                    line1 += ` \\hfill ${escapeLatex(issuing_authority)}`;
                }

                if (date_obtained) {
                    line2 += `${escapeLatex(date_obtained)}`;
                }

                if (expiry_date) {
                    line2 += ` - ${escapeLatex(expiry_date)}`;
                }

                if (line1) line1 += '\\\\';

                if (description) {
                    line2 += ` ${escapeLatex(description)}`;
                }

                return stripIndent`
                    ${line1} & ${line2} \\\\
                `;
            })}
            \\end{tabularx}
            \\sectionsep
        `;
    },

    languagesSection(languages, heading) {
        if (!languages) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Languages
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Languages')}}
            \\raggedright
            \\begin{tabularx}{\\textwidth}{ l X }
            ${languages.map((lang) => {
                const { language, proficiency } = lang;
                return `${escapeLatex(language)} & ${escapeLatex(proficiency)} \\\\`;
            })}
            \\end{tabularx}
            \\sectionsep
        `;
    },

    interestsSection(interests, heading) {
        if (!interests) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     Interests
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'Interests')}}
            \\raggedright
            \\begin{tabularx}{\\textwidth}{ l X }
            ${interests.map((interest) => {
                const { name, keywords = [] } = interest;
                return `${escapeLatex(name)} & ${keywords.map(escapeLatex).join(', ')} \\\\`;
            })}
            \\end{tabularx}
            \\sectionsep
        `;
    },

    referencesSection(references, heading) {
        if (!references) {
            return '';
        }

        return source`
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            %
            %     References
            %
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\section{${escapeLatex(heading || 'References')}}
            \\raggedright
            \\begin{tabularx}{\\textwidth}{ l X }
            ${references.map((ref) => {
                const { name, position, company_or_institution, email, phone, relationship, years_known, description } = ref;

                let line1 = '';
                let line2 = '';

                if (name) {
                    line1 += `\\textbf{${escapeLatex(name)}}`;
                }

                if (position) {
                    line1 += ` \\hfill ${escapeLatex(position)}`;
                }

                if (company_or_institution) {
                    line1 += ` \\hfill ${escapeLatex(company_or_institution)}`;
                }

                if (email) {
                    line2 += `${escapeLatex(email)}`;
                }

                if (phone) {
                    line2 += ` \\hfill ${escapeLatex(phone)}`;
                }

                if (relationship) {
                    line2 += ` \\hfill ${escapeLatex(relationship)}`;
                }

                if (years_known) {
                    line2 += ` \\hfill ${escapeLatex(years_known)}`;
                }

                if (line1) line1 += '\\\\';

                if (description) {
                    line2 += ` ${escapeLatex(description)}`;
                }

                return stripIndent`
                    ${line1} & ${line2} \\\\
                `;
            })}
            \\end{tabularx}
            \\sectionsep
        `;
    },
};

function template4(values: FormValues) {
    const { headings = {} } = values;

    return stripIndent`
        ${generator.resumeHeader()}
        \\documentclass[]{deedy-resume-openfont}
        \\usepackage{tabularx}

        \\begin{document}
        ${values.sections
            .map((section) => {
                switch (section) {
                    case 'personal_information':
                        return generator.profileSection(values.personal_information);

                    case 'education':
                        return generator.educationSection(values.education, headings.education);

                    case 'experience':
                        return generator.workSection(values.experience, headings.experience);

                    case 'skills':
                        return generator.skillsSection(values.skills, headings.skills);

                    case 'projects':
                        return generator.projectsSection(values.projects, headings.projects);

                    case 'awards_and_recognition':
                        return generator.awardsSection(values.awards_and_recognition, headings.awards_and_recognition);

                    case 'certifications':
                        return generator.certificationsSection(values.certifications, headings.certifications);

                    case 'languages':
                        return generator.languagesSection(values.languages, headings.languages);

                    case 'interests':
                        return generator.interestsSection(values.interests, headings.interests);

                    case 'references':
                        return generator.referencesSection(values.references, headings.references);

                    default:
                        return '';
                }
            })
            .join('\n')}
        ${WHITESPACE}
        \\end{document}
    `;
}

export default template4;
