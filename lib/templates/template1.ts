import { stripIndent, source } from 'common-tags';
import { WHITESPACE } from './constants';
import { FormValues, Generator } from '../../types';

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

    const locationLine = [address, city, state, postalCode].filter(Boolean).join(', ');
    const profileLines = [
      linkedin ? `\\href{${linkedin}}{LinkedIn}` : '',
      github ? `\\href{${github}}{GitHub}` : '',
      website ? `\\href{${website}}{Website}` : '',
      portfolio ? `\\href{${portfolio}}{Portfolio}` : '',
    ].filter(Boolean).join(' $\\cdot$ ');

    let line1 = name ? `{\\Huge \\scshape {${name}}}` : '';
    let line2 = [locationLine, email, phone, profileLines].filter(Boolean).join(' $\\cdot$ ');

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
      ${summary}
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
      ${objective}
      \\vspace{2mm}
    `;
  },

  experienceSection(experience, heading) {
    if (!experience) {
      return '';
    }

    return source`
      %==== Experience ====%
      \\header{${heading || 'Experience'}}
      \\vspace{1mm}

      ${experience.map((job) => {
        const { company, title, location, start_date, end_date, description, technologies } = job;

        let line1 = '';
        let line2 = '';
        let descriptionLines = '';

        if (company) {
          line1 += `\\textbf{${company}}`;
        }

        if (location) {
          line1 += ` \\hfill ${location}`;
        }

        if (title) {
          line2 += `\\textit{${title}}`;
        }

        if (start_date && end_date) {
          line2 += ` \\hfill ${start_date} - ${end_date}`;
        } else if (start_date) {
          line2 += ` \\hfill ${start_date} - Present`;
        }

        if (line1) line1 += '\\\\';
        if (line2) line2 += '\\\\';

        if (description) {
          descriptionLines = source`
              \\vspace{-1mm}
              \\begin{itemize} \\itemsep 1pt
                \\item ${description}
              \\end{itemize}
            `;
        }

        if (technologies && technologies.length > 0) {
          descriptionLines += source`
              \\textbf{Technologies:} ${technologies.join(', ')}
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
      \\header{${heading || 'Education'}}
      ${education.map((school) => {
        const { institution, degree, major, minor, gpa, graduation_date, relevant_courses } = school;

        let line1 = '';
        let line2 = '';

        if (institution) {
          line1 += `\\textbf{${institution}}`;
        }

        if (degree) {
          line2 += degree;
        }

        if (major) {
          line2 += degree ? ` in ${major}` : `Major in ${major}`;
        }

        if (minor) {
          line2 += `, Minor in ${minor}`;
        }

        if (gpa) {
          line2 += ` \\textit{GPA: ${gpa}}`;
        }

        if (graduation_date) {
          line2 += ` \\hfill ${graduation_date}`;
        }

        if (line1) line1 += '\\\\';
        if (line2) line2 += '\\\\';

        let coursesLine = '';
        if (relevant_courses && relevant_courses.length > 0) {
          coursesLine = source`
              \\textbf{Relevant Courses:} ${relevant_courses.join(', ')}
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
      \\header{${heading || 'Skills'}}
      \\begin{tabular}{ l l }
      ${skills.map((skill) => {
        const { name = 'Misc', keywords = [] } = skill;
        return `${name}: & ${keywords.join(', ')} \\\\`;
      })}
      \\end{tabular}
      \\vspace{2mm}
    `;
  },

  projectsSection(projects, heading) {
    if (!projects) {
      return '';
    }

    return source`
      \\header{${heading || 'Projects'}}
      ${projects.map((project) => {
        const { name, description, link } = project;

        let line1 = '';
        let line2 = description || '';

        if (name) {
          line1 += `{\\textbf{${name}}}`;
        }

        if (link) {
          line1 += ` \\hfill \\href{${link}}{${link}}`;
        }

        if (line1) line1 += '\\\\';
        if (line2) line2 += '\\\\';

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
      \\header{${heading || 'Awards and Recognition'}}
      ${awards.map((award) => {
        const { title, issuing_organization, date_received, description } = award;

        let line1 = '';
        let line2 = description || '';

        if (title) {
          line1 += `\\textbf{${title}}`;
        }

        if (issuing_organization) {
          line1 += ` \\hfill ${issuing_organization}`;
        }

        if (date_received) {
          line2 += ` \\hfill ${date_received}`;
        }

        if (line1) line1 += '\\\\';
        if (line2) line2 += '\\\\';

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