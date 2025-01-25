import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import styled from 'styled-components';
import Lightbox from 'react-image-lightbox';
import { FormSection } from './FormSection';
import { Button } from '../../../core/Button';
import { colors } from '../../../../theme';
import { TEMPLATES } from '../../../../../../lib/templates/constants';
import { FormValues } from '../../../../../types';
import 'react-image-lightbox/style.css';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin: 20px 0;

  @media screen and (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  position: relative;
  border-radius: 3px;
  color: #fff;
  max-width: 100%;
  transform: translateY(0);
  transition: all 0.4s ease-out;
  opacity: ${props => (props.active ? '1' : '0.65')};
  ${props =>
        props.active
            ? 'box-shadow: 0 2px 20px #fff, 0 0 0 1px #fff;'
            : ''} &:hover {
    opacity: ${props => (props.active ? '1' : '0.9')};
    transform: translateY(-3px);
    cursor: zoom-in;
  }
`;

const TemplateButton = styled(Button)`
  border-color: ${colors.primary};
  color: ${props => (props.active ? 'white' : 'silver')};
  transition: all 0.4s ease;
  padding: 10px 20px;

  &:hover {
    background: ${colors.primary};
    color: ${colors.background};
  }
`;

const images = TEMPLATES.map(template => '/img/' + template + '.png');
export function TemplatesSection() {

    const { control, watch } = useFormContext<FormValues>();
    const selectedTemplate = watch('selectedTemplate');
    console.log("Selected template: from section to debug", selectedTemplate); // Debug log
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

    const showLightbox = (index: number) => {
        setIsLightboxOpen(true);
        setLightboxImageIndex(index);
    };

    const hideLightbox = () => {
        setIsLightboxOpen(false);
    };
    useEffect(() => {
        console.log("Template changed to:", selectedTemplate);
    }, [selectedTemplate]);

    return (
        <FormSection title="Choose a Template">
            <Grid>
                {images.map((src, i) => {
                    const templateId = i + 1;
                    return (
                        <Div key={templateId}>
                            <Image
                                active={templateId === selectedTemplate}
                                src={src}
                                onClick={() => showLightbox(i)}
                            />
                            <Controller
                                control={control}
                                name="selectedTemplate"
                                render={({ field }) => (
                                    <TemplateButton
                                        active={templateId === field.value}
                                        type="button"
                                        onClick={() => field.onChange(templateId)}
                                    >
                                        Template {templateId}
                                    </TemplateButton>
                                )}
                            />
                        </Div>
                    );
                })}
            </Grid>
            {isLightboxOpen && (
                <Lightbox
                    imageCaption={`Template ${lightboxImageIndex + 1}`}
                    mainSrc={images[lightboxImageIndex]}
                    onCloseRequest={hideLightbox}
                />
            )}
        </FormSection>
    );
}

export default TemplatesSection;



