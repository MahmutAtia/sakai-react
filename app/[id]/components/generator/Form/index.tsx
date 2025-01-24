import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import styled from 'styled-components'


import { resumeAtom } from '../../../../atoms/resume'
import { FormValues } from '../../../../types'

import latex from '../../../../../lib/latex'
import getTemplateData from '../../../../../lib/templates'
import { PrimaryButton } from '../../core/Button'

async function generateResume(formData: FormValues): Promise<string> {
    const { texDoc, opts } = getTemplateData(formData)
    return latex(texDoc, opts)
}

const StyledForm = styled.form`
  grid-area: form;
  overflow: auto;
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

export function Form({ resumeId }) {

    const [resume, setResume] = useAtom(resumeAtom)
    const formContext = useForm<FormValues>({ defaultValues: initialFormValues })

    // TODO: move this to a custom react hook
    useEffect(() => {
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
                const selectedTemplate = 1;

                const structuredResume = {
                    headings,
                    sections,
                    selectedTemplate,
                    ...selectedResume,
                };

                console.log("Structured resume:", structuredResume); // Debug log

                // Update the form with the structured resume data
                formContext.reset(structuredResume);
                setResume({ ...resume, ...structuredResume, isLoading: true });
            }
        }

    }, [formContext])

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

    return (

        <>
            <PrimaryButton form="resume-form" onClick={handleFormSubmit}>
                Generate
            </PrimaryButton>
        </>

    )
}



