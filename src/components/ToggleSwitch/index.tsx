import React from 'react';
import './ToggleSwitch.css'; // ✅ Make sure to import the CSS

interface ToggleSwitchProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
    return (
        <label className="toggle-switch">
            <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
            <span className="slider"></span>
            {label && <span className="switch-label">{label}</span>}
        </label>
    );
};

export default ToggleSwitch;
