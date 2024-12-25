import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ArrayField = ({ values, onChange, onAdd, onRemove, placeholder }) => {
  return (
    <div>
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <InputText
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(index, e)}
            className="w-full"
          />
          <Button
            icon="pi pi-minus"
            className="p-button-rounded p-button-danger"
            onClick={() => onRemove(index)}
          />
        </div>
      ))}
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-success mt-2"
        onClick={onAdd}
      />
    </div>
  );
};

export default ArrayField;
