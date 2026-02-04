import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FluidInput.scss';

export const FluidInput = ({ label, id, type = "text", error, className, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`fluid-input-container ${className || ''}`}>
            <label
                htmlFor={id}
                className={`fluid-label ${isFocused || props.value ? 'active' : ''}`}
            >
                {label}
            </label>
            <motion.input
                id={id}
                type={type}
                className={`fluid-input ${error ? 'error' : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                layout
                {...props}
            />
            {error && <span className="error-msg">{error}</span>}
        </div>
    );
};
