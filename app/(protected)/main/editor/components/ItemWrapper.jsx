import React from 'react';
import { Button } from 'primereact/button';
import AIAssistant from './AIAssistant';
import UndoButton from './UndoButton';

const ItemWrapper = ({
    isEditing,
    onEdit,
    onUndo,
    canUndo,
    onAIUpdate,
    sectionData,
    editContent,
    viewContent
}) => {
    return (
        <div className="surface-card p-3 border-1 surface-border border-round">
            <div className="flex justify-content-between align-items-center mb-3">
                <div className="flex gap-2 align-items-center">
                    {isEditing ? (
                        <>
                            <AIAssistant
                                sectionData={sectionData}
                                onUpdate={onAIUpdate}
                            />
                            <Button
                                icon="pi pi-times"
                                className="p-button-rounded p-button-text"
                                onClick={onEdit}
                            />
                        </>
                    ) : (
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-text"
                            onClick={onEdit}
                        />
                    )}
                </div>
                <UndoButton onUndo={onUndo} disabled={!canUndo} />
            </div>
            {isEditing ? editContent : viewContent}
        </div>
    );
};

export default ItemWrapper;
