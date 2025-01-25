import { stripIndent, source } from 'common-tags';
import { WHITESPACE } from './constants';
import type { FormValues, Generator } from '../../types';

// Utility function to escape LaTeX special characters
function escapeLatex(text) {
  if (!text) return text;

  return text
    .replace(/\\/g, '\\textbackslash')
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
  // Resume header with configuration
  resumeHeader() {
    return stripIndent`
      %!TEX TS-program = xelatex
      %!TEX encoding = UTF-8 Unicode
      % Awesome CV LaTeX Template
      %
      % This template has been downloaded from:
      % https://github.com/posquit0/Awesome-CV
      %
      % Author:
      % Claud D. Park <posquit0.bj@gmail.com>
      % http://www.posquit0.com
      %
      % Template license:
      % CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)

      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      %     Configuration
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      %%% Themes: Awesome-CV
      \\documentclass[]{awesome-cv}
      \\usepackage{textcomp}
      %%% Override a directory location for fonts(default: 'fonts/')
      \\fontdir[fonts/]

      %%% Configure a directory location for sections
      \\newcommand*{\\sectiondir}{resume/}

      %%% Override color
      \\colorlet{awesome}{awesome-red}
    `;
  },

  // Profile section
  profileSection(basics) {
    if (!basics) {
      return '';
    }

    const { name, email, phone, location = {}, website } = basics;

    let nameLine = '';

    if (name) {
      const names = name.split(' ');
      let nameStart = '';
      let nameEnd = '';

      if (names.length === 1) {
        nameStart = names[0];
      } else {
        nameStart = names[0];
        nameEnd = names.slice(1, names.length).join(' ');
      }

      nameLine = `\\headerfirstnamestyle{${escapeLatex(nameStart)}} \\headerlastnamestyle{${escapeLatex(nameEnd)}} \\\\`;
    }

    const emailLine = email ? `{\\faEnvelope\\ ${escapeLatex(email)}}` : '';
    const phoneLine = phone ? `{\\faMobile\\ ${escapeLatex(phone)}}` : '';
    const addressLine = location.address
      ? `{\\faMapMarker\\ ${escapeLatex(location.address)}}`
      : '';
    const websiteLine = website
      ? `{\\faLink\\ \\href{${escapeLatex(website)}}{${escapeLatex(website)}}}`
      : '';
    const info = [emailLine, phoneLine, addressLine, websiteLine]
      .filter(Boolean)
      .join(' | ');

    return stripIndent`
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      %     Profile
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      \\begin{center}
        ${nameLine}
        \\vspace{2mm}
        ${info}
      \\end{center}
    `;
  },

  // Education section
  educationSection(education, heading) {
    if (!education) {
      return '';
    }

    return source`
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      %     Education
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      \\cvsection{${escapeLatex(heading || 'Education')}}
      \\begin{cventries}
      ${education.map((school) => {
        const {
          institution,
          location,
          area,
          studyType,
          score,
          startDate,
          endDate,
        } = school;

        let degreeLine = '';

        if (studyType && area) {
          degreeLine = `${escapeLatex(studyType)} in ${escapeLatex(area)}`;
        } else if (studyType || area) {
          degreeLine = escapeLatex(studyType || area);
        }

        let dateRange = '';

        if (startDate && endDate) {
          dateRange = `${escapeLatex(startDate)} – ${escapeLatex(endDate)}`;
        } else if (startDate) {
          dateRange = `${escapeLatex(startDate)} – Present`;
        } else {
          dateRange = escapeLatex(endDate);
        }

        return stripIndent`
          \\cventry
            {${degreeLine}}
            {${escapeLatex(institution || '')}}
            {${escapeLatex(location || '')}}
            {${dateRange}}
            {${score ? `GPA: ${escapeLatex(score)}` : ''}}
        `;
      })}
      \\end{cventries}

      \\vspace{-2mm}
    `;
  },

  // Work experience section
  workSection(work, heading) {
    if (!work) {
      return '';
    }

    return source`
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      %     Experience
      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      \\cvsection{${escapeLatex(heading || 'Experience')}}
      \\begin{cventries}
      ${work.map((job) => {
        const { name, position, location, startDate, endDate, highlights } = job;

        let dateRange = '';
        let dutyLines = '';

        if (startDate && endDate) {
          dateRange = `${escapeLatex(startDate)} – ${escapeLatex(endDate)}`;
        } else if (startDate) {
          dateRange = `${escapeLatex(startDate)} – Present`;
        } else {
          dateRange = escapeLatex(endDate);
        }

        if (highlights) {
          dutyLines = source`
            \\begin{cvitems}
              ${highlights.map((duty) => `\\item {${escapeLatex(duty)}}`)}
            \\end{cvitems}
          `;
        }

        return stripIndent`
          \\cventry
            {${escapeLatex(position || '')}}
            {${escapeLatex(name || '')}}
            {${escapeLatex(location || '')}}
            {${dateRange}}
            {${dutyLines}}
        `;
      })}
      \\end{cventries}
    `;
  },

  // Skills section
  skillsSection(skills, heading) {
    if (!skills) {
      return '';
    }

    return source`
      \\cvsection{${escapeLatex(heading || 'Skills')}}
      \\begin{cventries}
      \\cventry
      {}
      {\\def\\arraystretch{1.15}{\\begin{tabular}{ l l }
      ${skills.map((skill) => {
        const { name, keywords = [] } = skill;
        const nameLine = name ? `${escapeLatex(name)}: ` : '';
        const detailsLine = `{\\skill{ ${keywords.map(escapeLatex).join(', ') || ''}}}`;

        return `${nameLine} & ${detailsLine} \\\\`;
      })}
      \\end{tabular}}}
      {}
      {}
      {}
      \\end{cventries}

      \\vspace{-7mm}
    `;
  },

  // Projects section
  projectsSection(projects, heading) {
    if (!projects) {
      return '';
    }

    return source`
      \\cvsection{${escapeLatex(heading || 'Projects')}}
      \\begin{cventries}
      ${projects.map((project) => {
        const { name, description, keywords = [], url } = project;
        const urlLine = url ? `\\href{${escapeLatex(url)}}{${escapeLatex(url)}}` : '';

        return stripIndent`
          \\cventry
            {${escapeLatex(description || '')}}
            {${escapeLatex(name || '')}}
            {${keywords.map(escapeLatex).join(', ') || ''}}
            {${urlLine}}
            {}

          \\vspace{-5mm}
        `;
      })}
      \\end{cventries}
    `;
  },

  // Awards section
  awardsSection(awards, heading) {
    if (!awards) {
      return '';
    }

    return source`
      \\cvsection{${escapeLatex(heading || 'Awards')}}
      \\begin{cvhonors}
      ${awards.map((award) => {
        const { title, summary, date, awarder } = award;

        return stripIndent`
          \\cvhonor
            {${escapeLatex(title || '')}}
            {${escapeLatex(summary || '')}}
            {${escapeLatex(awarder || '')}}
            {${escapeLatex(date || '')}}
        `;
      })}
      \\end{cvhonors}
    `;
  },
};

function template2(values: FormValues) {
  const { headings = {} } = values;

  return stripIndent`
    ${generator.resumeHeader()}
    \\begin{document}
    ${values.sections
      .map((section) => {
        switch (section) {
          case 'profile':
            return generator.profileSection(values.basics);

          case 'education':
            return generator.educationSection(values.education, headings.education);

          case 'work':
            return generator.workSection(values.work, headings.work);

          case 'skills':
            return generator.skillsSection(values.skills, headings.skills);

          case 'projects':
            return generator.projectsSection(values.projects, headings.projects);

          case 'awards':
            return generator.awardsSection(values.awards, headings.awards);

          default:
            return '';
        }
      })
      .join('\n')}
    ${WHITESPACE}
    \\end{document}
  `;
}

export default template2;
