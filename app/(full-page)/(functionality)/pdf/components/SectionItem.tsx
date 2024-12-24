import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';




const SectionItem = ({ item, index, sectionKey, handleInputChange, handleDateChange, removeSectionItem, data, setData }) => {
    const [isItemEditing, setIsItemEditing] = React.useState(false);

    const toggleEdit = () => {
        setIsItemEditing(!isItemEditing);
    };

    return (
        <div key={item.id} className="border-b pb-4 mb-4 last:border-b-0">
            <div className="flex justify-end mb-2">
                <Button icon={isItemEditing ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text mr-2" onClick={toggleEdit} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => removeSectionItem(sectionKey, index, item.id)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(item)
                    .filter((key) => key !== 'id')
                    .map((field) => (
                        <div key={field} className="mb-2">
                            {isItemEditing && (
                                <label htmlFor={`${sectionKey}-${item.id}-${field}`} className="block text-gray-600 font-medium mb-1">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                                </label>
                            )}
                            {field.includes('date')
                                ? isItemEditing && <Calendar value={item[field] ? new Date(item[field]) : null} onChange={(e) => handleDateChange(sectionKey, field, index, e)} dateFormat="yy-mm-dd" className="w-full" />
                                : field === 'description'
                                ? isItemEditing && <InputTextarea value={item[field] || ''} onChange={(e) => handleInputChange(sectionKey, field, index, e)} rows={3} className="w-full" />
                                : field === 'keywords' && Array.isArray(item[field])
                                ? isItemEditing && (
                                      <div>
                                          {item[field].map((keyword: string, kIndex: number) => (
                                              <div key={kIndex} className="flex items-center space-x-2 mb-1">
                                                  <InputText
                                                      value={keyword}
                                                      onChange={(e) => {
                                                          const newData = JSON.parse(JSON.stringify(data));
                                                          newData[sectionKey][index][field][kIndex] = e.target.value;
                                                          setData(newData);
                                                      }}
                                                      className="w-full"
                                                  />
                                                  <Button
                                                      icon="pi pi-minus"
                                                      className="p-button-rounded p-button-danger"
                                                      onClick={() => {
                                                          const newData = JSON.parse(JSON.stringify(data));
                                                          newData[sectionKey][index][field].splice(kIndex, 1);
                                                          setData(newData);
                                                      }}
                                                  />
                                              </div>
                                          ))}
                                          <Button
                                              icon="pi pi-plus"
                                              className="p-button-rounded p-button-success"
                                              onClick={() => {
                                                  const newData = JSON.parse(JSON.stringify(data));
                                                  newData[sectionKey][index][field].push('');
                                                  setData(newData);
                                              }}
                                          />
                                      </div>
                                  )
                                : isItemEditing && <InputText id={`${sectionKey}-${item.id}-${field}`} value={item[field] || ''} onChange={(e) => handleInputChange(sectionKey, field, index, e)} className="w-full" />}
                            {!isItemEditing &&
                                item[field] &&
                                (field === 'keywords' && Array.isArray(item[field]) ? (
                                    <ul className="list-disc ml-6">
                                        {item[field].map((kw: string, ki: number) => (
                                            <li key={ki} className="text-gray-700">
                                                {kw}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed">{item[field]}</p>
                                ))}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default SectionItem;
