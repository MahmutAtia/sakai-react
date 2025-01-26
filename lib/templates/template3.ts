import { stripIndent, source } from 'common-tags';
import { WHITESPACE } from './constants';
import { FormValues, Generator } from '../../types';



const generator: Generator = {
    // Utility function to escape LaTeX special characters
    escapeLatex(text) {
        if (typeof text !== 'string') {
            return text; // Return the input as-is if it's not a string
          }      return text
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
    },

    // Personal Information Section
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
        .map(this.escapeLatex)
        .join(', ');

      const profileLines = [
        linkedin ? `\\href{${this.escapeLatex(linkedin)}}{LinkedIn}` : '',
        github ? `\\href{${this.escapeLatex(github)}}{GitHub}` : '',
        website ? `\\href{${this.escapeLatex(website)}}{Website}` : '',
        portfolio ? `\\href{${this.escapeLatex(portfolio)}}{Portfolio}` : '',
      ]
        .filter(Boolean)
        .join(' $\\cdot$ ');

      let line1 = name ? `{\\Huge \\scshape {${this.escapeLatex(name)}}}` : '';
      let line2 = [locationLine, this.escapeLatex(email), this.escapeLatex(phone), profileLines]
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

    // Skills Section
    skillsSection(skills, heading) {
      if (!skills) {
        return '';
      }

      return source`
        %==== Skills ====%
        \\header{${this.escapeLatex(heading || 'Skills')}}
        \\begin{tabularx}{\\textwidth}{ l X }
        ${skills.map((skill) => {
          const { name = 'Misc', keywords = [] } = skill;

          // Escape special characters in keywords
          const escapedKeywords = keywords
            .map((keyword) => this.escapeLatex(keyword))
            .join(', ');

          return `${this.escapeLatex(name)}: & ${escapedKeywords} \\\\`;
        })}
        \\end{tabularx}
        \\vspace{2mm}
      `;
    },
  };


  function template3(values) {
    const { headings } = values;

    return stripIndent`
      \\documentclass{article}
      \\usepackage[utf8]{inputenc}
      \\usepackage[default]{raleway}
      \\usepackage[margin=1cm, a4paper]{geometry}
      \\usepackage{xcolor}
      \\usepackage{paracol}
      \\usepackage{hyperref}
      \\usepackage{fontawesome}

      % Define custom colors
      \\definecolor{headercolour}{rgb}{0.25,0.25,0.25}
      \\definecolor{cvgreen}{HTML}{4CAF50}
      \\definecolor{cvpurple}{HTML}{B32EE1}
      \\definecolor{skilllabelcolour}{HTML}{b3b3b3}

      % Define custom commands
      \\newcommand{\\header}[1]{
        {\\hspace*{-18pt}\\vspace*{6pt} \\textsc{#1}}
        \\vspace*{-6pt} \\hrulefill
      }

      \\newcommand{\\bg}[3]{
        \\colorbox{#1}{\\bfseries\\color{#2}#3}
      }

      \\title{New Simple CV}
      \\author{\\LaTeX{} Ninja}
      \\date{June 2023}

      \\pagestyle{empty}
      \\begin{document}

      \\thispagestyle{empty}

      %==== Personal Information ====%
      ${generator.personalInformationSection(values.personal_information)}

      %==== Skills ====%
      ${generator.skillsSection(values.skills, headings.skills)}

      \\end{document}
    `;
  }

  export default template3;
