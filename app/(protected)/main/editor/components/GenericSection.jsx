import React, { useState, useRef } from 'react';
import { useResume } from '../ResumeContext';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import SectionWrapper from './SectionWrapper';
import ItemWrapper from './ItemWrapper';

const GenericSection = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, editMode, toggleEditMode, removeSectionItem, getDefaultItem } = useResume();
    const items = Array.isArray(data[sectionKey]) ? data[sectionKey] : [];
    const [newItemIndex, setNewItemIndex] = useState(null);
    const firstItemRef = useRef(null);
    const lastItemRef = useRef(null);
    const historyRef = useRef([]);

    const isItemEditing = (index) => editMode[sectionKey]?.[index];


    // Get field structure from first item or default data
    const getEmptyItem = () => {
        const template = items[0] || getDefaultItem(sectionKey);
        return Object.keys(template).reduce((acc, key) => {
            acc[key] = Array.isArray(template[key]) ? [] : '';
            return acc;
        }, {});
    };

    const addItem = () => {
        const newIndex = items.length;
        const newItem = getEmptyItem();

        const newData = { ...data };
        newData[sectionKey] = [...items, newItem];
        setData(newData);
        setNewItemIndex(newIndex);
        toggleEditMode(sectionKey, items.length);
    };

    const handleInputChange = (index, field, value) => {
        const newData = { ...data };
        if (!Array.isArray(newData[sectionKey])) {
            newData[sectionKey] = [];
        }
        newData[sectionKey][index] = {
            ...newData[sectionKey][index],
            [field]: value
        };
        setData(newData);
    };

    const renderFields = (item, index, isEditing) => {
        if (!item) return null;

        return Object.entries(item).map(([field, value]) => (
            isEditing ? (
                <InputText
                    key={field}
                    value={value}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                    placeholder={field}
                    className="w-full"
                />
            ) : (
                <div key={field} className="flex gap-2">
                    {/* <span className="font-bold">{field}:</span> */}
                    <span>{value}</span>
                </div>
            )
        ));
    };


    const handleUndo = (index) => {
        if (historyRef.current[index]?.length > 0) {
            const previousState = historyRef.current[index].pop();
            const newData = { ...data };
            newData[sectionKey][index] = previousState;
            setData(newData);
        }
    };

    const handleAIUpdate = async (index, item) => {
        try {
            // Save current state to history
            if (!historyRef.current[index]) {
                historyRef.current[index] = [];
            }
            historyRef.current[index].push(JSON.stringify({ ...item }));

            // AI update logic here
            const newData = { ...data };
            newData[sectionKey][index] = {
                ...newData[sectionKey][index],
                ...item // Use updated data from AI
            };
            setData(newData);

            toast.current.show({
                severity: 'success',
                summary: 'AI Updated',
                detail: 'Item has been updated'
            });
        } catch (error) {
            console.error('AI Update Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'Failed to update item'
            });
        }
    };


    return (
        <SectionWrapper title={sectionKey.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')} onAdd={addItem} toast={toast}>
            {items.map((item, index) => (
                <ItemWrapper
                    key={index}
                    itemRef={index === 0 ? firstItemRef : index === items.length - 1 ? lastItemRef : null}
                    isNewItem={index === newItemIndex}
                    isEditing={isItemEditing(index)}
                    onEdit={() => toggleEditMode(sectionKey, index)}
                    onUndo={() => handleUndo(index)}
                    onAIUpdate={(updatedData) => handleAIUpdate(index, updatedData)}
                    canUndo={historyRef.current[index]?.length > 0}                    sectionData={item}
                    onDelete={() => removeSectionItem(sectionKey, index)}

                    editContent={
                        <div className="flex flex-column gap-3">
                            {renderFields(item, index, true)}
                        </div>
                    }
                    viewContent={
                        <div className="flex flex-column gap-2">
                            {renderFields(item, index, false)}
                        </div>
                    }
                />
            ))}
        </SectionWrapper>
    );
};

export default GenericSection;
