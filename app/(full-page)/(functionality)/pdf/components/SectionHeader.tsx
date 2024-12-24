import React from 'react';
import { Button } from 'primereact/button';

const SectionHeader = ({ sectionTitle, editMode, sectionKey, toggleEditMode, addSectionItem }) => {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">{editMode[sectionKey]?.all || sectionTitle.length > 0 ? sectionTitle : null}</h2>
            <div className="flex items-center">
                <Button icon={editMode[sectionKey]?.all ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text mr-2" onClick={() => toggleEditMode(sectionKey)} />
                {editMode[sectionKey]?.all && <Button icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => addSectionItem(sectionKey)} />}
            </div>
        </div>
    );
};

export default SectionHeader;
