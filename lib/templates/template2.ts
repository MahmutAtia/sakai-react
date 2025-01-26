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
            % Template 2: A mashup of hipstercv, friggeri, and twenty cv
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            \\documentclass[lighthipster]{simplehipstercv}
            \\usepackage[utf8]{inputenc}
            \\usepackage[default]{raleway}
            \\usepackage[margin=1cm, a4paper]{geometry}
            \\usepackage{tabularx}

            \\newlength{\\rightcolwidth}
            \\newlength{\\leftcolwidth}
            \\setlength{\\leftcolwidth}{0.23\\textwidth}
            \\setlength{\\rightcolwidth}{0.75\\textwidth}

            \\pagestyle{empty}
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
            .join(' | ');

        return stripIndent`
            \\begin{document}
            \\thispagestyle{empty}
            \\section*{Start}
            \\simpleheader{headercolour}{${escapeLatex(name)}}{}{${escapeLatex(locationLine)}}{white}

            \\subsection*{}
            \\vspace{4em}

            \\setlength{\\columnsep}{1.5cm}
            \\columnratio{0.23}[0.75]
            \\begin{paracol}{2}
            \\hbadness5000

            \\footnotesize
            {\\setasidefontcolour
            \\flushright

            \\bg{cvgreen}{white}{About me}\\\\[0.5em]
            {\\footnotesize
            ${escapeLatex(personalInformation.summary || '')}}
            \\bigskip

            \\bg{cvgreen}{white}{Personal} \\\\[0.5em]
            ${escapeLatex(name)} \\\\
            ${escapeLatex(locationLine)} \\\\
            ${escapeLatex(email)} \\\\
            ${escapeLatex(phone)} \\\\
            ${profileLines}
            \\bigskip
            }
        `;
    },

    experienceSection(experience, heading) {
        if (!experience) {
            return '';
        }

        return source`
            \\switchcolumn
            \\small
            \\section*{${escapeLatex(heading || 'Experience')}}
            \\begin{tabularx}{\\rightcolwidth}{r| X c}
                ${experience.map((job) => {
                    const { company, title, location, start_date, end_date, description } = job;

                    const dateRange = start_date && end_date ? `${escapeLatex(start_date)}--${escapeLatex(end_date)}` : escapeLatex(start_date);

                    return stripIndent`
                        \\cvevent{${dateRange}}{${escapeLatex(title)}}{${escapeLatex(company)}}{${escapeLatex(location)}}{${escapeLatex(description)}}{}
                    `;
                }).join('')}
            \\end{tabularx}
            \\vspace{3em}
        `;
    },

    educationSection(education, heading) {
        if (!education) {
            return '';
        }

        return source`
            \\begin{minipage}[t]{0.35\\textwidth}
            \\section*{${escapeLatex(heading || 'Education')}}
            \\begin{tabularx}{\\rightcolwidth}{r X c}
                ${education.map((school) => {
                    const { institution, degree, major, minor, gpa, graduation_date } = school;

                    return stripIndent`
                        \\cvdegree{${escapeLatex(graduation_date)}}{${escapeLatex(degree)}}{${escapeLatex(major)}}{${escapeLatex(institution)}}{${escapeLatex(gpa)}}{}
                    `;
                }).join('')}
            \\end{tabularx}
            \\end{minipage}
        `;
    },

    finalFooter(personalInformation) {
        if (!personalInformation) {
            return '';
        }

        const { name, email, phone, location } = personalInformation;
        const address = location?.address || '';
        const city = location?.city || '';
        const state = location?.state || '';
        const postalCode = location?.postal_code || '';

        const locationLine = [address, city, state, postalCode]
            .filter(Boolean)
            .map(escapeLatex)
            .join(', ');

        return stripIndent`
            \\vfill{}
            \\setlength{\\parindent}{0pt}
            \\begin{minipage}[t]{\\rightcolwidth}
            \\begin{center}\\fontfamily{\\sfdefault}\\selectfont \\color{black!70}
            {\\small ${escapeLatex(name)} \\icon{\\faEnvelopeO}{cvgreen}{} ${escapeLatex(locationLine)} \\icon{\\faMapMarker}{cvgreen}{} ${escapeLatex(email)} \\icon{\\faPhone}{cvgreen}{} ${escapeLatex(phone)}}
            \\end{center}
            \\end{minipage}

            \\end{paracol}
            \\end{document}
        `;
    },
};

function template2(values: FormValues) {
    const { headings = {} } = values;

    return stripIndent`
        ${generator.resumeHeader()}
        ${generator.personalInformationSection(values.personal_information)}
        ${generator.experienceSection(values.experience, headings.experience)}
        ${generator.educationSection(values.education, headings.education)}
        ${generator.finalFooter(values.personal_information)}
    `;
}

export default template2;
