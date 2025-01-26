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
  padding: 1rem 0 10rem 0;

  canvas {
    max-width: 100% !important;
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

    const downloadSource = () => {
        window.open(resume.url)
    }

    const print = () => {
        window.print()
    }

    const zoomIn = () => {
        setScale(scale + 0.25)
    }

    const zoomOut = () => {
        setScale(scale - 0.25)
    }

    const [searchText, setSearchText] = useState('');

    const textRenderer = useCallback(
        (textItem) => highlightPattern(textItem.str, searchText),
        [searchText]
    );
    function onChange(event) {
        setSearchText(event.target.value);
    }

    return (
        <Output>
            <button onClick={() => window.open(resume.url)}>export as pdf</button>
            <div>
                <label htmlFor="search">Search:</label>
                <input type="search" id="search" value={searchText} onChange={onChange} />
            </div>
            <PdfContainer>
                <Toolbar
                    resumeURL={resume.url || '/blank.pdf'}
                    downloadSource={resume.url}
                    currPage={pageNumber}
                    prevPage={pageNumber > 1 ? pageNumber - 1 : 1}
                    nextPage={pageNumber < pageCount ? pageNumber + 1 : pageCount}
                    print={print}
                    zoomIn={zoomIn}
                    zoomOut={zoomOut}
                />
                <LoadingBar status={status} />

                <ResumeDocument
                wrap
                    file={resume.url || '/blank.pdf'}
                    onLoadSuccess={handleDocumentLoadSuccess}
                    loading={<ProgressBar mode="indeterminate" style={{ height: '6px' }} />}

                >
                    <ResumePage
                        wrap
                        pageNumber={pageNumber}
                        scale={scale}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading={<ProgressBar mode="indeterminate" style={{ height: '6px' }} />}
                        customTextRenderer={textRenderer}

                    />
                </ResumeDocument>

            </PdfContainer>
        </Output>
    )
}





import React from 'react';
import { Button } from 'primereact/button';

interface ToolbarProps {
    resumeURL: string;
    downloadSource: () => void;
    currPage: number;
    prevPage: number;
    nextPage: number;
    print: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    resumeURL,
    downloadSource,
    currPage,
    prevPage,
    nextPage,
    print,
    zoomIn,
    zoomOut
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b w-full">
            <div className="flex gap-5">
                <Button
                    icon="pi pi-download"
                    onClick={downloadSource}
                    tooltip="Download PDF"
                    className="p-button-rounded p-button-text"
                />
                <Button
                    icon="pi pi-print"
                    onClick={print}
                    tooltip="Print"
                    className="p-button-rounded p-button-text"
                />
            </div>

            <div className="flex items-center gap-2">
                <Button
                    icon="pi pi-angle-left"
                    onClick={() => currPage !== prevPage && prevPage}
                    disabled={currPage === 1}
                    className="p-button-rounded p-button-text"
                />
                <span className="font-medium">Page {currPage}</span>
                <Button
                    icon="pi pi-angle-right"
                    onClick={() => currPage !== nextPage && nextPage}
                    disabled={currPage === nextPage}
                    className="p-button-rounded p-button-text"
                />
            </div>

            <div className="flex gap-2">
                <Button
                    icon="pi pi-minus"
                    onClick={zoomOut}
                    tooltip="Zoom Out"
                    className="p-button-rounded p-button-text"
                />
                <Button
                    icon="pi pi-plus"
                    onClick={zoomIn}
                    tooltip="Zoom In"
                    className="p-button-rounded p-button-text"
                />
            </div>
        </div>
    );
};




interface LoadingBarProps {
    status: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ status }) => {
    return (
        <div className="h-1 bg-gray-200">
            {status === 'loading' && (
                <div className="h-full w-full bg-blue-500 animate-pulse"></div>
            )}
        </div>
    );
};

