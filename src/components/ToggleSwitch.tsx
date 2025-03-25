import React from 'react';
// import './ManageMenu'; // Add styles for the

interface ToggleSwitchProps {
    checked: boolean;
    onChange?: (checked: boolean) => void; // ✅ Make onChange optional
    label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)} // ✅ Use optional chaining
            />
            <span className="slider"></span>
            {label && <span className="switch-label">{label}</span>}
        </label>
    );
};

export default ToggleSwitch;
