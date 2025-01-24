import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import styled from 'styled-components'
import { resumeAtom } from '../../../atoms/resume'
import { ProgressBar } from 'primereact/progressbar'
// import { Toolbar } from './Toolbar'
// import { LoadingBar } from './Loadingbar'

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const Output = styled.output`
  grid-area: preview;
  background: ${(props) => props.theme.lightBlack};
  overflow-y: auto;
`

const PdfContainer = styled.article`
  width: 100%;
  height: 100%;
`

const ResumeDocument = styled(Document)`
  width: 100%;
`

const ResumePage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0 10rem 0;

  canvas {
    max-width: 95% !important;
    height: auto !important;
  }
`

export function Preview() {
  const [resume] = useAtom(resumeAtom)
  const [pageCount, setPageCount] = useState(1)
  const [pageNumber] = useState(1)
  const [scale] = useState(document.body.clientWidth > 1440 ? 1.75 : 1)

  const handleDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setPageCount(pdf.numPages)
  }, [])

  return (
    <Output>
      <button onClick={() => window.open(resume.url)}>export as pdf</button>
      <PdfContainer>
        {/* <Toolbar
          resumeURL={resumeURL || BlankPDF}
          jsonURL={jsonURL}
          downloadSource={downloadSource}
          currPage={pageNumber}
          prevPage={ pageNumber > 1 ? pageNumber - 1 : 1 }
          nextPage={ pageNumber < pageCount ? pageNumber + 1 : pageCount }
          print={print}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />
        <LoadingBar status={status} /> */}

        <ResumeDocument
          file={resume.url || '/blank.pdf'}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading= {<ProgressBar mode="indeterminate" style={{height: '6px'}} />}
        >
          <ResumePage
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading= {<ProgressBar mode="indeterminate" style={{height: '6px'}} />}
          />
        </ResumeDocument>
      </PdfContainer>
    </Output>
  )
}


