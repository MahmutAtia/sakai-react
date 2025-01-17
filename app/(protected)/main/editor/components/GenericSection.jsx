import React, { useState, useRef } from 'react';
import { useResume } from '../ResumeContext';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import SectionWrapper from './SectionWrapper';
import ItemWrapper from './ItemWrapper';

const GenericSection = ({ sectionKey, fields }) => {
    const toast = useRef(null);
    const { data, setData, editMode, toggleEditMode, removeSectionItem } = useResume();
    const items = data[sectionKey] || [];
    const [showFieldDialog, setShowFieldDialog] = useState(false);
    const [editingItem, setEditingItem] = useState({});

    const handleInputChange = (index, field, value) => {
        const newData = { ...data };
        newData[sectionKey][index][field] = value;
        setData(newData);
    };

    const addItem = () => {
        const newItem = fields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setEditingItem(newItem);
        setShowFieldDialog(true);
    };

    const saveItem = () => {
        const newData = { ...data };
        if (!newData[sectionKey]) newData[sectionKey] = [];
        newData[sectionKey].push(editingItem);
        setData(newData);
        setShowFieldDialog(false);
    };

    return (
        <>
            <SectionWrapper title={sectionKey} onAdd={addItem} toast={toast}>
                {items.map((item, index) => (
                    <ItemWrapper
                        key={index}
                        isEditing={editMode[sectionKey]?.[index]}
                        onEdit={() => toggleEditMode(sectionKey, index)}
                        onDelete={() => removeSectionItem(sectionKey, index)}
                        editContent={
                            <div className="flex flex-column gap-3">
                                {fields.map(field => (
                                    <InputText
                                        key={field.name}
                                        placeholder={field.label}
                                        value={item[field.name] || ''}
                                        onChange={(e) => handleInputChange(index, field.name, e.target.value)}
                                        className="w-full"
                                    />
                                ))}
                            </div>
                        }
                        viewContent={
                            <div className="flex flex-column gap-2">
                                {fields.map(field => (
                                    <div key={field.name}>
                                        <span className="font-semibold">{field.label}: </span>
                                        <span>{item[field.name]}</span>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                ))}
            </SectionWrapper>

            <Dialog
                visible={showFieldDialog}
                onHide={() => setShowFieldDialog(false)}
                header="Add New Item"
                footer={
                    <div>
                        <Button label="Save" onClick={saveItem} />
                        <Button label="Cancel" onClick={() => setShowFieldDialog(false)} className="p-button-text" />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    {fields.map(field => (
                        <InputText
                            key={field.name}
                            placeholder={field.label}
                            value={editingItem[field.name] || ''}
                            onChange={(e) => setEditingItem({
                                ...editingItem,
                                [field.name]: e.target.value
                            })}
                            className="w-full"
                        />
                    ))}
                </div>
            </Dialog>
        </>
    );
};

export default GenericSection;
