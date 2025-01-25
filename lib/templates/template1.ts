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
      %\\renewcommand{\\encodingdefault}{cg}
      %\\renewcommand{\\rmdefault}{lgrcmr}

      \\def\\bull{\\vrule height 0.8ex width .7ex depth -.1ex }

      % DEFINITIONS FOR RESUME %%%%%%%%%%%%%%%%%%%%%%%

      \\newcommand{\\area} [2] {
          \\vspace*{-9pt}
          \\begin{verse}
              \\textbf{#1}   #2
          \\end{verse}
      }

      \\newcommand{\\lineunder} {
          \\vspace*{-8pt} \\\\
          \\hspace*{-18pt} \\hrulefill \\\\
      }

      \\newcommand{\\header} [1] {
          {\\hspace*{-18pt}\\vspace*{6pt} \\textsc{#1}}
          \\vspace*{-6pt} \\lineunder
      }

      \\newcommand{\\employer} [3] {
          { \\textbf{#1} (#2)\\\\ \\underline{\\textbf{\\emph{#3}}}\\\\  }
      }

      \\newcommand{\\contact} [3] {
          \\vspace*{-10pt}
          \\begin{center}
              {\\Huge \\scshape {#1}}\\\\
              #2 \\\\ #3
          \\end{center}
          \\vspace*{-8pt}
      }

      \\newenvironment{achievements}{
          \\begin{list}
              {$\\bullet$}{\\topsep 0pt \\itemsep -2pt}}{\\vspace*{4pt}
          \\end{list}
      }

      \\newcommand{\\schoolwithcourses} [4] {
          \\textbf{#1} #2 $\\bullet$ #3\\\\
          #4 \\\\
          \\vspace*{5pt}
      }

      \\newcommand{\\school} [4] {
          \\textbf{#1} #2 $\\bullet$ #3\\\\
          #4 \\\\
      }
      % END RESUME DEFINITIONS %%%%%%%%%%%%%%%%%%%%%%%
    `;
    },
    personalInformationSection(personalInformation) {
        if (!personalInformation) {
          return '';
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
          .join(' $\\cdot$ ');

        let line1 = name ? `{\\Huge \\scshape {${escapeLatex(name)}}}` : '';
        let line2 = [locationLine, escapeLatex(email), escapeLatex(phone), profileLines]
          .filter(Boolean)
          .join(' $\\cdot$ ');

        if (line1 && line2) {
          line1 += '\\\\';
          line2 += '\\\\';
        }

        return stripIndent`
          %==== Personal Information ====%
          \\vspace*{-10pt}
          \\begin{center}
            ${line1}
            ${line2}
          \\end{center}
        `;
      },

      summarySection(summary) {
        if (!summary) {
          return '';
        }

        return stripIndent`
          %==== Summary ====%
          \\header{Summary}
          ${escapeLatex(summary)}
          \\vspace{2mm}
        `;
      },

      objectiveSection(objective) {
        if (!objective) {
          return '';
        }

        return stripIndent`
          %==== Objective ====%
          \\header{Objective}
          ${escapeLatex(objective)}
          \\vspace{2mm}
        `;
      },

      experienceSection(experience, heading) {
        if (!experience) {
          return '';
        }

        return source`
          %==== Experience ====%
          \\header{${escapeLatex(heading || 'Experience')}}
          \\vspace{1mm}

          ${experience.map((job) => {
            const { company, title, location, start_date, end_date, description, technologies } = job;

            let line1 = '';
            let line2 = '';
            let descriptionLines = '';

            if (company) {
              line1 += `\\textbf{${escapeLatex(company)}}`;
            }

            if (location) {
              line1 += ` \\hfill ${escapeLatex(location)}`;
            }

            if (title) {
              line2 += `\\textit{${escapeLatex(title)}}`;
            }

            if (start_date && end_date) {
              line2 += ` \\hfill ${escapeLatex(start_date)} - ${escapeLatex(end_date)}`;
            } else if (start_date) {
              line2 += ` \\hfill ${escapeLatex(start_date)} - Present`;
            }

            if (line1) line1 += '\\\\';
            if (line2) line2 += '\\\\';

            if (description) {
              descriptionLines = source`
                  \\vspace{-1mm}
                  \\begin{itemize} \\itemsep 1pt
                    \\item ${escapeLatex(description)}
                  \\end{itemize}
                `;
            }

            if (technologies && technologies.length > 0) {
              descriptionLines += source`
                  \\textbf{Technologies:} ${technologies.map(escapeLatex).join(', ')}
                `;
            }

            return stripIndent`
              ${line1}
              ${line2}
              ${descriptionLines}
            `;
          })}
        `;
      },

      educationSection(education, heading) {
        if (!education) {
          return '';
        }

        return source`
          %==== Education ====%
          \\header{${escapeLatex(heading || 'Education')}}
          ${education.map((school) => {
            const { institution, degree, major, minor, gpa, graduation_date, relevant_courses } = school;

            let line1 = '';
            let line2 = '';

            if (institution) {
              line1 += `\\textbf{${escapeLatex(institution)}}`;
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
              \\vspace{2mm}
            `;
          })}
        `;
      },

      skillsSection(skills, heading) {
        if (!skills) {
          return '';
        }

        return source`
          %==== Skills ====%
          \\header{${escapeLatex(heading || 'Skills')}}
          \\begin{tabularx}{\\textwidth}{ l X }
          ${skills.map((skill) => {
            const { name = 'Misc', keywords = [] } = skill;

            // Escape special characters in keywords
            const escapedKeywords = keywords
              .map((keyword) => escapeLatex(keyword))
              .join(', ');

            return `${escapeLatex(name)}: & ${escapedKeywords} \\\\`;
          })}
          \\end{tabularx}
          \\vspace{2mm}
        `;
      },


      projectsSection(projects, heading) {
        if (!projects) {
          return '';
        }

        return source`
          %==== Projects ====%
          \\header{${escapeLatex(heading || 'Projects')}}
          ${projects.map((project) => {
            const { name, description, link } = project;

            let line1 = '';
            let line2 = description || '';

            if (name) {
              line1 += `{\\textbf{${escapeLatex(name)}}}`;
            }

            if (link) {
              line1 += ` \\hfill \\href{${escapeLatex(link)}}{${escapeLatex(link)}}`;
            }

            if (line1) line1 += '\\\\';
            if (line2) line2 = escapeLatex(line2) + '\\\\';

            return stripIndent`
              ${line1}
              ${line2}
              \\vspace*{2mm}
            `;
          })}
        `;
      },

      awardsAndRecognitionSection(awards, heading) {
        if (!awards) {
          return '';
        }

        return source`
          %==== Awards and Recognition ====%
          \\header{${escapeLatex(heading || 'Awards and Recognition')}}
          ${awards.map((award) => {
            const { title, issuing_organization, date_received, description } = award;

            let line1 = '';
            let line2 = description || '';

            if (title) {
              line1 += `\\textbf{${escapeLatex(title)}}`;
            }

            if (issuing_organization) {
              line1 += ` \\hfill ${escapeLatex(issuing_organization)}`;
            }

            if (date_received) {
              line2 += ` \\hfill ${escapeLatex(date_received)}`;
            }

            if (line1) line1 += '\\\\';
            if (line2) line2 = escapeLatex(line2) + '\\\\';

            return stripIndent`
              ${line1}
              ${line2}
              \\vspace*{2mm}
            `;
          })}
        `;
      },


      volunteerAndSocialActivitiesSection(volunteer, heading) {
        if (!volunteer) {
          return '';
        }

        return source`
          %==== Volunteer and Social Activities ====%
          \\header{${escapeLatex(heading || 'Volunteer and Social Activities')}}
          ${volunteer.map((activity) => {
            const { organization, position, start_date, end_date, description } = activity;

            let line1 = '';
            let line2 = description || '';

            if (organization) {
              line1 += `\\textbf{${escapeLatex(organization)}}`;
            }

            if (position) {
              line1 += ` \\hfill ${escapeLatex(position)}`;
            }

            if (start_date && end_date) {
              line2 += ` \\hfill ${escapeLatex(start_date)} - ${escapeLatex(end_date)}`;
            } else if (start_date) {
              line2 += ` \\hfill ${escapeLatex(start_date)} - Present`;
            }

            if (line1) line1 += '\\\\';
            if (line2) line2 = escapeLatex(line2) + '\\\\';

            return stripIndent`
              ${line1}
              ${line2}
              \\vspace*{2mm}
            `;
          })}
        `;
      },


      certificationsSection(certifications, heading) {
        if (!certifications) {
          return '';
        }

        return source`
          %==== Certifications ====%
          \\header{${escapeLatex(heading || 'Certifications')}}
          ${certifications.map((cert) => {
            const { name, issuing_authority, date_obtained, expiry_date, description } = cert;

            let line1 = '';
            let line2 = description || '';

            if (name) {
              line1 += `\\textbf{${escapeLatex(name)}}`;
            }

            if (issuing_authority) {
              line1 += ` \\hfill ${escapeLatex(issuing_authority)}`;
            }

            if (date_obtained) {
              line2 += ` \\hfill ${escapeLatex(date_obtained)}`;
            }

            if (expiry_date) {
              line2 += ` - ${escapeLatex(expiry_date)}`;
            }

            if (line1) line1 += '\\\\';
            if (line2) line2 = escapeLatex(line2) + '\\\\';

            return stripIndent`
              ${line1}
              ${line2}
              \\vspace*{2mm}
            `;
          })}
        `;
      },


      languagesSection(languages, heading) {
        if (!languages) {
          return '';
        }

        return source`
          %==== Languages ====%
          \\header{${escapeLatex(heading || 'Languages')}}
          \\begin{tabular}{ l l }
          ${languages.map((lang) => {
            const { language, proficiency } = lang;
            return `${escapeLatex(language)}: & ${escapeLatex(proficiency)} \\\\`;
          })}
          \\end{tabular}
          \\vspace{2mm}
        `;
      },



      interestsSection(interests, heading) {
        if (!interests) {
          return '';
        }

        return source`
          %==== Interests ====%
          \\header{${escapeLatex(heading || 'Interests')}}
          ${interests.map((interest) => {
            const { name, keywords = [] } = interest;
            return `${escapeLatex(name)}: ${keywords.map(escapeLatex).join(', ')} \\\\`;
          })}
          \\vspace{2mm}
        `;
      },


      referencesSection(references, heading) {
        if (!references) {
          return '';
        }

        return source`
          %==== References ====%
          \\header{${escapeLatex(heading || 'References')}}
          ${references.map((ref) => {
            const { name, position, company_or_institution, email, phone, relationship, years_known, description } = ref;

            let line1 = '';
            let line2 = description || '';

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
              line2 += ` \\hfill ${escapeLatex(email)}`;
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
            if (line2) line2 = escapeLatex(line2) + '\\\\';

            return stripIndent`
              ${line1}
              ${line2}
              \\vspace*{2mm}
            `;
          })}
        `;
      },





};





function template1(values: FormValues) {
    const { headings } = values;

    return stripIndent`
      \\documentclass[a4paper]{article}
      \\usepackage{fullpage}
      \\usepackage{amsmath}
      \\usepackage{amssymb}
      \\usepackage{textcomp}
      \\usepackage[utf8]{inputenc}
      \\usepackage[T1]{fontenc}
      \\textheight=10in
      \\pagestyle{empty}
      \\raggedright
      \\usepackage[left=0.8in,right=0.8in,bottom=0.8in,top=0.8in]{geometry}
      \\usepackage[hidelinks]{hyperref}
      \\usepackage{makecell}
      \\usepackage{tabularx}


      ${generator.resumeHeader()}

      \\begin{document}
      \\vspace*{-40pt}

      ${values.sections
            .map((section) => {
                switch (section) {
                    case 'personal_information':
                        return generator.personalInformationSection(values.personal_information);

                    case 'summary':
                        return generator.summarySection(values.summary);

                    case 'objective':
                        return generator.objectiveSection(values.objective);

                    case 'experience':
                        return generator.experienceSection(values.experience, headings.experience);

                    case 'education':
                        return generator.educationSection(values.education, headings.education);

                    case 'skills':
                        return generator.skillsSection(values.skills, headings.skills);

                    case 'projects':
                        return generator.projectsSection(values.projects, headings.projects);

                    case 'awards_and_recognition':
                        return generator.awardsAndRecognitionSection(values.awards_and_recognition, headings.awards_and_recognition);

                    case 'volunteer_and_social_activities':
                        return generator.volunteerAndSocialActivitiesSection(values.volunteer_and_social_activities, headings.volunteer_and_social_activities);

                    case 'certifications':
                        return generator.certificationsSection(values.certifications, headings.certifications);

                    case 'languages':
                        return generator.languagesSection(values.languages, headings.languages);

                    case 'interests':
                        return generator.interestsSection(values.interests, headings.interests);

                    case 'references':
                        return generator.referencesSection(values.references, headings.references);

                    case 'publications':
                        return generator.publicationsSection(values.publications, headings.publications);

                    case 'courses':
                        return generator.coursesSection(values.courses, headings.courses);

                    case 'conferences':
                        return generator.conferencesSection(values.conferences, headings.conferences);

                    case 'speaking_engagements':
                        return generator.speakingEngagementsSection(values.speaking_engagements, headings.speaking_engagements);

                    case 'patents':
                        return generator.patentsSection(values.patents, headings.patents);

                    case 'professional_memberships':
                        return generator.professionalMembershipsSection(values.professional_memberships, headings.professional_memberships);

                    case 'military_service':
                        return generator.militaryServiceSection(values.military_service, headings.military_service);

                    case 'teaching_experience':
                        return generator.teachingExperienceSection(values.teaching_experience, headings.teaching_experience);

                    case 'research_experience':
                        return generator.researchExperienceSection(values.research_experience, headings.research_experience);

                    default:
                        return '';
                }
            })
            .join('\n\n')}

      ${WHITESPACE}
      \\end{document}
    `;
}

export default template1;











