import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedButton.scss';
import { Loader2 } from 'lucide-react';

export const AnimatedButton = ({
    children,
    variant = 'primary',
    isLoading,
    className,
    ...props
}) => {
    return (
        <motion.button
            className={`animated-btn ${variant} ${className || ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="spinner" size={18} />}
            {children}
        </motion.button>
    );
};
