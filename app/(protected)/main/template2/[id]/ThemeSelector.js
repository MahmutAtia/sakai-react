"use client";
import React from "react";
import { useResume } from "./ResumeContext";
import { SelectButton } from 'primereact/selectbutton';
import { Tooltip } from 'primereact/tooltip';

const ThemeSelector = () => {
  const { theme, setTheme } = useResume();

  const themes = [
    { name: 'Light', value: 'light', icon: '☀️' },
    { name: 'Dark', value: 'dark', icon: '🌙' },
    { name: 'Professional', value: 'professional', icon: '👔' },
    { name: 'Creative', value: 'creative', icon: '🎨' }
  ];

  const themeTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option.icon}</span>
        <span>{option.name}</span>
      </div>
    );
  };

  return (
    <div className="flex justify-content-end mb-4 p-2">
      <div className="card">
        <SelectButton
          value={theme}
          onChange={(e) => setTheme(e.value)}
          options={themes}
          optionLabel="name"
          itemTemplate={themeTemplate}
          className="theme-selector"
        />
      </div>

      <style jsx>{`
        :global(.theme-selector) {
          border-radius: 8px;
          overflow: hidden;
        }
        :global(.theme-selector .p-selectbutton .p-button) {
          padding: 0.5rem 1rem;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          color: var(--text-color);
          transition: all 0.2s;
        }
        :global(.theme-selector .p-selectbutton .p-button:hover) {
          background: var(--surface-hover);
        }
        :global(.theme-selector .p-selectbutton .p-button.p-highlight) {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: var(--primary-color-text);
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;
