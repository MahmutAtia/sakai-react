import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { useState } from 'react';
import AIAssistant from './AIAssistant';
import UndoButton from './UndoButton';

const ItemWrapper = ({
    isEditing,
    onEdit,
    onUndo,
    onDelete,
    canUndo,
    onAIUpdate,
    sectionData,
    editContent,
    viewContent,
    itemRef,
    isNewItem
}) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <div
            ref={itemRef}
            className={`
            relative transition-all duration-500 scroll-mt-[100px]
            ${isNewItem ? 'animate-fadeIn animate-border' : ''}
        `}
        >
            <div className="surface-card p-3 border-1 surface-border border-round">
                <ConfirmDialog />
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
                    <div className="flex gap-2">
                        <UndoButton onUndo={onUndo} disabled={!canUndo} />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger p-button-text"
                            onClick={() => setShowDeleteDialog(true)}
                            tooltip="Delete"
                        />
                        <ConfirmDialog
                            visible={showDeleteDialog}
                            onHide={() => setShowDeleteDialog(false)}
                            message="Are you sure you want to delete this item?"
                            header="Confirm Delete"
                            icon="pi pi-exclamation-triangle"
                            accept={onDelete}
                            reject={() => setShowDeleteDialog(false)}
                        />
                    </div>
                </div>
                {isEditing ? editContent : viewContent}
            </div>
        </div>
    );
};

export default ItemWrapper;
