import { useEffect, useState, useRef } from 'react';
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
import './s.css';

const EditableResumeTemplate = () => {
    const { data, setData } = useResume();
    const [loading, setLoading] = useState(false);
    const [hiddenSections, setHiddenSections] = useState([]);
    const NON_ARRAY_SECTIONS = ['personal_information', 'summary', 'objective'];
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
    const sectionRefs = useRef({});

    const isSectionEmpty = (key) => {
        if (!data[key]) return true;

        if (NON_ARRAY_SECTIONS.includes(key)) {
            return Object.keys(data[key]).length === 0;
        }

        return Array.isArray(data[key]) && data[key].length === 0;
    };

    const toggleSectionVisibility = (sectionKey) => {
        setHiddenSections(prev =>
            prev.includes(sectionKey)
                ? prev.filter(key => key !== sectionKey)
                : [...prev, sectionKey]
        );
    };

    const handleReorderSections = async (sourceIndex, destinationIndex) => {
        setLoading(true);
        try {
            const activeSectionKeys = sectionOrder.filter(key => !hiddenSections.includes(key));
            const [movedSection] = activeSectionKeys.splice(sourceIndex, 1);
            activeSectionKeys.splice(destinationIndex, 0, movedSection);

            const newOrder = sectionOrder.filter(key => !activeSectionKeys.includes(key));
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
        const isEmpty = isSectionEmpty(sectionKey);

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
        <div className="grid grid-nogutter h-screen surface-ground overflow-hidden">
            {/* Left Sidebar */}
            <div className="col-fixed w-20rem h-screen surface-section border-right-1 surface-border">
                <div className="p-4 border-bottom-1 surface-border backdrop-blur-sm bg-white-alpha-90">
                    <h2 className="text-xl font-semibold text-900 m-0">Resume Builder</h2>
                    <p className="text-600 text-sm mt-2 mb-0">Drag sections to reorder</p>
                </div>
                <div className="p-3">
                    <Accordion multiple activeIndex={[0]} className="surface-ground">
                        <AccordionTab
                            header={
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-list text-primary"></i>
                                    <span className="font-medium text-900">Sections</span>
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
                                            {sectionOrder.map((sectionKey, index) => {
                                                const isEmpty = isSectionEmpty(sectionKey);
                                                return (
                                                    <Draggable
                                                        key={sectionKey}
                                                        draggableId={sectionKey}
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
                                                                <div className="flex align-items-center gap-2">
                                                                    <span className="font-medium text-700">
                                                                        {sectionKey.split('_').map(word =>
                                                                            word.charAt(0).toUpperCase() + word.slice(1)
                                                                        ).join(' ')}
                                                                    </span>
                                                                    {isEmpty && (
                                                                        <span className="text-sm text-500">(Empty)</span>
                                                                    )}
                                                                </div>
                                                                <i
                                                                    className={`pi ${hiddenSections.includes(sectionKey) ? 'pi-eye-slash' : 'pi-eye'} text-600 cursor-pointer`}
                                                                    onClick={() => toggleSectionVisibility(sectionKey)}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
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
                <div className="h-full overflow-y-auto scrollable-content">
                    <div className="p-4 flex justify-content-center">
                        {loading && (
                            <div className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-5">
                                <ProgressSpinner strokeWidth="3" />
                            </div>
                        )}
                        <div className="surface-card p-6 border-round-xl shadow-2 w-full max-w-7xl">
                            {sectionOrder.map((sectionKey) => {
                                const isEmpty = isSectionEmpty(sectionKey);
                                return (
                                    !hiddenSections.includes(sectionKey) && (
                                        <div key={sectionKey} ref={sectionRefs.current[sectionKey]}>
                                            {renderSection(sectionKey)}
                                            {isEmpty && (
                                                <div className="text-center text-500 mt-2">
                                                    This section is empty. Add content to make it visible.
                                                </div>
                                            )}
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditableResumeTemplate;
