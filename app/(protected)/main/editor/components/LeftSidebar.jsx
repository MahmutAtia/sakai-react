import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LeftSidebar = ({
    visible,
    onHide,
    sections,
    availableSections,
    onAddSection,
    onReorderSections
}) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        onReorderSections(result.source.index, result.destination.index);
    };

    return (
        <Sidebar
            visible={visible}
            onHide={onHide}
            position="left"
            className="w-25rem"
            showCloseIcon={false}
            modal={false}
            baseZIndex={1000}
        >
            <div className="flex flex-column h-full">
                <h2 className="text-xl font-semibold mb-4">Resume Sections</h2>

                <Accordion className="mb-4">
                    <AccordionTab header="Add New Section">
                        <div className="flex flex-column gap-2">
                            {availableSections.map(section => (
                                <Button
                                    key={section.key}
                                    label={section.title}
                                    icon="pi pi-plus"
                                    className="p-button-outlined w-full text-left justify-content-start"
                                    onClick={() => onAddSection(section.key)}
                                    disabled={section.active}
                                />
                            ))}
                        </div>
                    </AccordionTab>
                </Accordion>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex flex-column gap-2"
                            >
                                {sections.map((section, index) => (
                                    <Draggable
                                        key={section.key}
                                        draggableId={section.key}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="surface-card p-3 border-round flex align-items-center justify-content-between"
                                            >
                                                <span className="font-semibold">{section.title}</span>
                                                <i className="pi pi-bars" />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </Sidebar>
    );
};

export default LeftSidebar;
