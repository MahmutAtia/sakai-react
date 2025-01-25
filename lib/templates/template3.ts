import { stripIndent, source } from 'common-tags';
import { WHITESPACE } from './constants';
import { FormValues, Generator } from '../../types';

// Utility function to escape LaTeX special characters
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
      % This CV example/template is based on a clean design
      % Adapted for use with modern LaTeX packages
      \\documentclass[a4paper,skipsamekey,11pt,english]{curve}

      % Load settings and customisations
      \\usepackage{./public/settings}

      % Define bibliography style
      \\PassOptionsToPackage{style=ieee,sorting=ydnt,uniquename=init,defernumbers=true}{biblatex}

      % Load fonts
      \\ifxetexorluatex
        \\usepackage{fontspec}
        \\usepackage[p,osf,swashQ]{cochineal}
        \\usepackage[medium,bold]{cabin}
        \\usepackage[varqu,varl,scale=0.9]{zi4}
      \\else
        \\usepackage[T1]{fontenc}
        \\usepackage[p,osf,swashQ]{cochineal}
        \\usepackage{cabin}
        \\usepackage[varqu,varl,scale=0.9]{zi4}
      \\fi

      % Define colours and markers
      % \\definecolor{SwishLineColour}{HTML}{00FFFF}
      % \\definecolor{MarkerColour}{HTML}{0000CC}
      % \\prefixmarker{\\$diamond$}

      % Include fullonly for photo
      \\includecomment{fullonly}
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

    return stripIndent`
      %==== Personal Information ====%
      \\leftheader{%
        {\\LARGE\\bfseries\\sffamily ${escapeLatex(name)}}

        \\makefield{\\faEnvelope[regular]}{\\href{mailto:${escapeLatex(email)}}{\\texttt{${escapeLatex(email)}}}}
        \\makefield{\\faLinkedin}{\\href{${escapeLatex(linkedin)}}{\\texttt{${escapeLatex(linkedin)}}}}
        \\makefield{\\faGlobe}{\\url{${escapeLatex(website)}}}

        ${locationLine ? `\\makefield{\\faMapMarker}{${escapeLatex(locationLine)}}` : ''}
        ${phone ? `\\makefield{\\faPhone}{${escapeLatex(phone)}}` : ''}
      }

      \\rightheader{~}
      \\begin{fullonly}
        \\photo[r]{public/template2/img/photo}
        \\photoscale{0.13}
      \\end{fullonly}

      \\title{Curriculum Vitae}
    `;
  },

  experienceSection(experience, heading) {
    if (!experience) {
      return '';
    }

    return source`
      %==== Experience ====%
      \\makerubric{${escapeLatex(heading || 'employment')}}
      ${experience.map((job) => {
        const { company, title, location, start_date, end_date, description, technologies } = job;

        let line1 = `\\textbf{${escapeLatex(company)}}`;
        if (location) {
          line1 += ` \\hfill ${escapeLatex(location)}`;
        }

        let line2 = `\\textit{${escapeLatex(title)}}`;
        if (start_date && end_date) {
          line2 += ` \\hfill ${escapeLatex(start_date)} - ${escapeLatex(end_date)}`;
        } else if (start_date) {
          line2 += ` \\hfill ${escapeLatex(start_date)} - Present`;
        }

        let descriptionLines = '';
        if (description) {
          descriptionLines = `\\begin{itemize} \\itemsep 1pt \\item ${escapeLatex(description)} \\end{itemize}`;
        }

        if (technologies && technologies.length > 0) {
          descriptionLines += `\\textbf{Technologies:} ${technologies.map(escapeLatex).join(', ')}`;
        }

        return stripIndent`
          ${line1} \\\\
          ${line2} \\\\
          ${descriptionLines}
          \\vspace*{2mm}
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
      \\makerubric{${escapeLatex(heading || 'education')}}
      ${education.map((school) => {
        const { institution, degree, major, minor, gpa, graduation_date, relevant_courses } = school;

        let line1 = `\\textbf{${escapeLatex(institution)}}`;
        let line2 = `${escapeLatex(degree)}`;
        if (major) {
          line2 += ` in ${escapeLatex(major)}`;
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

        let coursesLine = '';
        if (relevant_courses && relevant_courses.length > 0) {
          coursesLine = `\\textbf{Relevant Courses:} ${relevant_courses.map(escapeLatex).join(', ')}`;
        }

        return stripIndent`
          ${line1} \\\\
          ${line2} \\\\
          ${coursesLine}
          \\vspace*{2mm}
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
      \\makerubric{${escapeLatex(heading || 'skills')}}
      \\begin{tabularx}{\\textwidth}{ l X }
      ${skills.map((skill) => {
        const { name = 'Misc', keywords = [] } = skill;
        return `${escapeLatex(name)}: & ${keywords.map(escapeLatex).join(', ')} \\\\`;
      })}
      \\end{tabularx}
      \\vspace{2mm}
    `;
  },
};

function template3(values: FormValues) {
  const { headings } = values;

  return stripIndent`
    ${generator.resumeHeader()}

    \\begin{document}
    \\makeheaders[c]

    ${values.sections
      .map((section) => {
        switch (section) {
          case 'personal_information':
            return generator.personalInformationSection(values.personal_information);

          case 'experience':
            return generator.experienceSection(values.experience, headings.experience);

          case 'education':
            return generator.educationSection(values.education, headings.education);

          case 'skills':
            return generator.skillsSection(values.skills, headings.skills);

          default:
            return '';
        }
      })
      .join('\n\n')}

    ${WHITESPACE}
    \\end{document}
  `;
}

export default template3;
