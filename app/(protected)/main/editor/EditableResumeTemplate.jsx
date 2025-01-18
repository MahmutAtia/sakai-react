import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import PersonalInformation from "./components/PersonalInformation";
import Summary from "./components/Summary";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Languages from "./components/Languages";
import { useResume } from "./ResumeContext";
import GenericSection from "./components/GenericSection";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'primeflex/primeflex.css';
import './s.css'

const EditableResumeTemplate = () => {
    const { data, setData } = useResume();
    const [loading, setLoading] = useState(false);
    const [customSections, setCustomSections] = useState([]);
    const [sectionOrder, setSectionOrder] = useState([
        'personal_information',
        'summary',
        'objective',
        'experience',
        'education',
        'projects',
        'skills',
        'languages'
    ]);

    const isActiveSection = (key) => {
        if (key === 'personal_information') {
            return Boolean(data[key]);
        }
        return Boolean(data[key] && Array.isArray(data[key]) && data[key].length > 0);
    };

    const availableSections = sectionOrder.map(key => ({
        key,
        title: key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        active: isActiveSection(key)
    }));

    const handleAddSection = async (sectionKey) => {
        setLoading(true);
        try {
            const newData = { ...data };
            if (!newData[sectionKey]) {
                newData[sectionKey] = sectionKey in ['personal_information', 'summary', 'objective'] ? {} : [];
            }
            await setData(newData);
        } finally {
            setLoading(false);
        }
    };

    const handleReorderSections = async (sourceIndex, destinationIndex) => {
        setLoading(true);
        try {
            const activeSectionKeys = availableSections
                .filter(section => section.active)
                .map(section => section.key);

            const [movedSection] = activeSectionKeys.splice(sourceIndex, 1);
            activeSectionKeys.splice(destinationIndex, 0, movedSection);

            const newOrder = sectionOrder.filter(key =>
                !activeSectionKeys.includes(key)
            );

            activeSectionKeys.forEach((key, index) => {
                const originalIndex = sectionOrder.indexOf(key);
                if (originalIndex !== -1) {
                    newOrder.splice(index, 0, key);
                }
            });

            setSectionOrder(newOrder);
            localStorage.setItem('sectionOrder', JSON.stringify(newOrder));
        } finally {
            setLoading(false);
        }
    };

    const renderSection = (sectionKey) => {
        if (!data[sectionKey] && !data[`${sectionKey}_config`]) {
            return null;
        }

        switch (sectionKey) {
            case 'personal_information':
                return <PersonalInformation sectionKey={sectionKey} />;
            case 'summary':
            case 'objective':
                return <Summary sectionKey={sectionKey} />;
            case 'experience':
                return <Experience sectionKey={sectionKey} />;
            case 'education':
                return <Education sectionKey={sectionKey} />;
            case 'projects':
                return <Projects sectionKey={sectionKey} />;
            case 'skills':
                return <Skills sectionKey={sectionKey} />;
            case 'languages':
                return <Languages sectionKey={sectionKey} />;
            default:
                return data[`${sectionKey}_config`] ? (
                    <GenericSection
                        sectionKey={sectionKey}
                        fields={data[`${sectionKey}_config`].fields || []}
                    />
                ) : null;
        }
    };

    useEffect(() => {
        const savedOrder = localStorage.getItem('sectionOrder');
        if (savedOrder) {
            setSectionOrder(JSON.parse(savedOrder));
        }
    }, []);

    return (
        <div className="grid grid-nogutter h-screen surface-ground overflow-hidden"> {/* Add overflow-hidden */}
            {/* Left Sidebar */}
            <div className="col-fixed w-20rem h-screen surface-section border-right-1 surface-border">
                <div className="p-4 border-bottom-1 surface-border backdrop-blur-sm bg-white-alpha-90">
                    <h2 className="text-xl font-semibold text-900 m-0">Resume Builder</h2>
                    <p className="text-600 text-sm mt-2 mb-0">Drag sections to reorder</p>
                </div>
                <div className="p-3">
                    <Accordion multiple  activeIndex={[0,1]} className="surface-ground">
                        <AccordionTab
                            className="mb-2"
                            header={
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-plus-circle text-primary"></i>
                                    <span className="font-medium text-900">Available Sections</span>
                                </div>
                            }
                        >
                            <div className="flex flex-column gap-2 mt-2">
                                {availableSections
                                    .filter((section) => !section.active)
                                    .map((section) => (
                                        <Button
                                            key={section.key}
                                            label={section.title}
                                            icon="pi pi-plus"
                                            className="p-button-text p-button-plain w-full text-left justify-content-start hover:surface-100 transition-colors transition-duration-150"
                                            onClick={() => handleAddSection(section.key)}
                                        />
                                    ))}
                            </div>
                        </AccordionTab>

                        <AccordionTab
                            header={
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-list text-primary"></i>
                                    <span className="font-medium text-900">Active Sections</span>
                                </div>
                            }
                        >
                            <DragDropContext
                                onDragEnd={(result) => {
                                    if (!result.destination) return;
                                    handleReorderSections(result.source.index, result.destination.index);
                                }}
                            >
                                <Droppable droppableId="sections">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex flex-column gap-2 mt-2"
                                        >
                                            {availableSections
                                                .filter((section) => section.active)
                                                .map((section, index) => (
                                                    <Draggable
                                                        key={section.key}
                                                        draggableId={section.key}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`
                                                                    surface-card border-round-lg
                                                                    p-3 flex align-items-center justify-content-between
                                                                    cursor-pointer transition-all transition-duration-200
                                                                    ${snapshot.isDragging
                                                                        ? "shadow-4"
                                                                        : "shadow-1 hover:shadow-2"
                                                                    }
                                                                `}
                                                            >
                                                                <span className="font-medium text-700">{section.title}</span>
                                                                <i className="pi pi-bars text-600" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </AccordionTab>
                    </Accordion>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="col h-screen">
                <div className="h-full overflow-y-auto scrollable-content"> {/* Add custom scroll class */}
                    <div className="p-4 flex justify-content-center">
                        {loading && (
                            <div className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-5">
                                <ProgressSpinner strokeWidth="3" />
                            </div>
                        )}
                        <div className="surface-card p-6 border-round-xl shadow-2 w-full max-w-7xl">
                            {sectionOrder.map(
                                (sectionKey) =>
                                    isActiveSection(sectionKey) && renderSection(sectionKey)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default EditableResumeTemplate;
