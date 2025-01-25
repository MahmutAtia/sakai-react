"use client";
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation';
import styled from 'styled-components'

import { Form } from './components/generator/Form'
import { Header } from './components/generator/Header'
import { Sidebar } from './components/generator/Sidebar'

const Preview = dynamic(
  async () => (await import('./components/generator/Preview')).Preview,
  { ssr: false }
)

const Main = styled.main`
  display: grid;
  grid-template-columns: 0.7fr  1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header  header'
    'sidebar preview';
  height: 100vh;
  overflow: hidden;
`

export default function GeneratorPage() {
    const { id: resumeId } = useParams();

  return (
    <Main>
      <Header />
      <Sidebar resumeId={resumeId} />
      <Preview />
    </Main>
  )
}
