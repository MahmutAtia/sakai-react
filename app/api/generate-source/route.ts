import { NextResponse, NextRequest } from 'next/server';
import Archiver from 'archiver';
import { stripIndent } from 'common-tags';
import getTemplateData from '@/lib/templates';
import { FormValues } from '../../types';

export async function POST(req: NextRequest) {
  // Parse the request body
  const body = await req.json();

  // Generate the source code
  const sourceCode = await generateSourceCode(body as FormValues);

  // Create a stream for the response
  const stream = new ReadableStream({
    start(controller) {
      sourceCode.on('data', (chunk: Buffer) => controller.enqueue(chunk));
      sourceCode.on('end', () => controller.close());
      sourceCode.on('error', (err: Error) => controller.error(err));
    },
  });

  // Return the response with the zip file
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="resume.zip"',
    },
  });
}

/**
 * Generates resume source files from the request body,
 * and then saves it to a zip which is then sent to the client.
 *
 * @param formData The request body received from the client.
 *
 * @return The generated zip.
 */
function generateSourceCode(formData: FormValues) {
  const { texDoc, opts } = getTemplateData(formData);
  const prettyDoc = /*prettify(texDoc)*/ texDoc;
  const zip = Archiver('zip');
  const readme = makeReadme(formData.selectedTemplate, opts.cmd);

  zip.append(prettyDoc, { name: 'resume.tex' });
  zip.append(readme, { name: 'README.md' });

  if (opts.inputs) {
    zip.directory(opts.inputs, '../');
  }

  zip.finalize();

  return zip;
}

/**
 * Generates a README to include in the output zip.
 * It details how to use the generated LaTeX source code.
 *
 * @param template The specified resume template.
 * @param cmd The LaTeX command that is used to generate the PDF.
 *
 * @return The generated README text.
 */
function makeReadme(template: number, cmd: string): string {
  return stripIndent`
    # Resumake Template ${template}
    > LaTeX code generated at [resumake.io](https://resumake.io)
    ## Usage
    To generate a PDF from this LaTeX code, navigate to this folder in a terminal and run:
        ${cmd} resume.tex
    ## Requirements
    You will need to have \`${cmd}\` installed on your machine.
    Alternatively, you can use a site like [ShareLaTeX](https://sharelatex.com) to build and edit your LaTeX instead.
  `;
}
