import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PersonalInformation } from './types';

interface ResumeHeaderProps {
    data: PersonalInformation;
    editMode: boolean;
    handleInputChange: (section: string, field: string, index?: number, event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handlePhoneChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    toggleEditMode: () => void;
    addPhone: () => void;
    removePhone: (index: number) => void;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ data, editMode, handleInputChange, handlePhoneChange, toggleEditMode, addPhone, removePhone }) => {
    return (
        <header className="mb-8 border-b pb-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">
                        {editMode ? <InputText className="w-full" value={data.name} onChange={(e) => handleInputChange('personal_information', 'name', undefined, e)} /> : data.name}
                    </h1>
                </div>
                <div className="flex items-center">
                    <Button icon={editMode ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text edit-button" onClick={toggleEditMode} />
                </div>
            </div>
            <div className="text-gray-600">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <div className="flex items-center space-x-2">
                        <i className="pi pi-envelope"></i>
                        {editMode ? <InputText className="w-full" value={data.email} onChange={(e) => handleInputChange('personal_information', 'email', undefined, e)} /> : <span>{data.email}</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="pi pi-phone"></i>
                        <div>
                            {data.phone.map((phone, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                    {editMode ? <InputText className="w-full" value={phone} onChange={(e) => handlePhoneChange(index, e)} /> : <span>{phone}</span>}
                                    {editMode && <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => removePhone(index)} />}
                                </div>
                            ))}
                            {editMode && <Button icon="pi pi-plus" className="p-button-rounded p-button-success mt-1" onClick={addPhone} />}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-2">
                    {Object.entries(data.profiles).map(([key, value]) => (
                        value && (
                            <div key={key} className="flex items-center space-x-2">
                                <i className={`pi ${key === 'linkedin' ? 'pi-linkedin' : key === 'github' ? 'pi-github' : 'pi-globe'}`}></i>
                                {editMode ? <InputText className="w-full" value={value} onChange={(e) => handleInputChange('personal_information', `profiles.${key}`, undefined, e)} /> : <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{value}</a>}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </header>
    );
};

export default ResumeHeader;