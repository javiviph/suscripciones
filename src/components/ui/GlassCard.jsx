import React from 'react';
import { motion } from 'framer-motion';
import './GlassCard.scss';

export const GlassCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            className={`glass-card ${className || ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
