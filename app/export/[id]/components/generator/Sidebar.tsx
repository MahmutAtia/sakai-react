import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { MdDragIndicator } from 'react-icons/md'

import { colors } from '../../theme'
import { PrimaryButton, IconButton } from '../core/Button'
import TemplatesSection from './Form/sections/TemplatesSection'
import { FormProvider, useForm } from 'react-hook-form'
import { FormValues } from '../../../../types'

const Aside = styled.aside`
  grid-area: sidebar;
  border-right: 1px solid ${colors.borders};
  padding: 24px 36px;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  margin-bottom: 28px;

  button {
    cursor: grab;
  }
`

const StyledLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  font-weight: 300;
  color: ${colors.foreground};

  ${(props) => props.$active && `color: ${colors.primary};`}
`


const initialFormValues: FormValues = {
    headings: {},
    sections: [
      'personal_information',
      'summary',
      'objective',
      'experience',
      'education',
      'skills',
      'projects',
      'awards_and_recognition',
      'volunteer_and_social_activities',
      'certifications',
      'languages',
      'interests',
      'references',
      'publications',
      'courses',
      'conferences',
      'speaking_engagements',
      'patents',
      'professional_memberships',
      'military_service',
      'teaching_experience',
      'research_experience',
    ],
    selectedTemplate: 1,
  };


export function Sidebar() {
    const formContext = useForm<FormValues>({ defaultValues: initialFormValues })


  return (
    <FormProvider {...formContext}>

    <Aside>
        <Nav>
            <TemplatesSection />
        </Nav>


    </Aside>
    </FormProvider>
  )
}

