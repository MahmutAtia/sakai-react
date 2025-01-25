


import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { MdDragIndicator } from 'react-icons/md'

import { colors } from '../../theme'
import { PrimaryButton, IconButton } from '../core/Button'
import TemplatesSection from './Form/sections/TemplatesSection'



import { useCallback, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAtom } from 'jotai'


import { resumeAtom } from '../../../atoms/resume'
import { FormValues } from '../../../types'

import latex from '../../../../lib/latex'
import getTemplateData from '../../../../lib/templates'



const Aside = styled.aside`
  grid-area: sidebar;
  border-right: 1px solid ${colors.borders};
  padding: 24px 36px;
    height: 100vh;
    overflow-y: auto;

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

const StyledLink = styled(Link) <{ $active: boolean }>`
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


export function Sidebar({resumeId}) {


    async function generateResume(formData: FormValues): Promise<string> {
        const { texDoc, opts } = getTemplateData(formData)
        return latex(texDoc, opts)
    }


    const initialFormValues: FormValues = {
        headings: {},
        sections: [
            'personal_information',
            'summary',
            'objective',
            'experience',
            'education',
            'skills',
            'languages',
            'interests',
            'projects',
            'awards_and_recognition',
            'volunteer_and_social_activities',
            'certifications',
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


    const [resume, setResume] = useAtom(resumeAtom)
    const formContext = useForm<FormValues>({ defaultValues: { ...initialFormValues, selectedTemplate: 1 } })
    // watch to selectedTemplate changes
    const selectedTemplate = formContext.watch('selectedTemplate')
    console.log("Selected template: from form", selectedTemplate); // Debug log


    // Track initial load to prevent duplicate submissions
    const initialLoad = useRef(true)

    const handleFormSubmit = useCallback(async () => {
        const formValues = formContext.getValues();
        setResume({ ...resume, isLoading: true })
        try {
            const newResumeUrl = await generateResume(formValues)
            setResume({ ...resume, url: newResumeUrl, isLoading: false })
        } catch (error) {
            console.error(error)
            setResume({ ...resume, isError: true, isLoading: false })
        }
    }, [formContext, resume, setResume])


    // TODO: move this to a custom react hook
    useEffect(() => {
        const loadInitialData = async () => {
            // Retrieve data from localStorage
            const storedData = localStorage.getItem("data");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log("Parsed data:", parsedData); // Debug log

                // Find resume by resumeId
                const foundItem = parsedData.find(item => item.id === Number(resumeId));
                console.log("Found item:", foundItem); // Debug log

                const selectedResume = foundItem?.resume;
                console.log("Selected resume:", selectedResume); // Debug log

                if (selectedResume) {
                    // Restructuring the data
                    const headings = Object.keys(selectedResume).reduce((acc, key) => {
                        acc[key] = key.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                        return acc;
                    }, {});

                    // Filter sections in order
                    const sections = initialFormValues.sections.filter(section =>
                        selectedResume.hasOwnProperty(section) &&
                        (Array.isArray(selectedResume[section]) ? selectedResume[section].length > 0 : true)
                    );
                    const structuredResume = {
                        headings,
                        sections,
                        selectedTemplate,
                        ...selectedResume,
                    };


                    // Update the form with the structured resume data
                    formContext.reset(structuredResume);
                    // setResume({ ...resume, ...structuredResume, isLoading: true });

                    // Trigger initial submission
                    await handleFormSubmit()
                    initialLoad.current = false

                }


            }
        }
        loadInitialData()


    }, [resumeId, formContext])


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

