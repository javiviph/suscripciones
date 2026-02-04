import React, { useState } from 'react';
import { Lightbulb, Calculator, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import { GlassCard } from './ui/GlassCard';
import { AnimatedButton } from './ui/AnimatedButton';

const SavingsSuggestions = ({ suscripciones }) => {
    const [isSimulating, setIsSimulating] = useState(false);

    const activeSubs = suscripciones.filter(s => s.estado === 'activa' && !s.esPrueba);
    const sortedByPrice = [...activeSubs].sort((a, b) => b.precio - a.precio);
    const top3 = sortedByPrice.slice(0, 3);
    const potentialSavings = top3.reduce((acc, curr) => acc + curr.precio, 0);

    if (activeSubs.length === 0) return null;

    return (
        <GlassCard className="savings-card">
            <div className="card-header">
                <Lightbulb size={24} color="#f1c21b" />
                <h4>Oportunidades de Ahorro</h4>
            </div>

            <p className="suggestion-text">
                Podrías ahorrar hasta <strong>{formatCurrency(potentialSavings)}/mes</strong> cancelando tus 3 suscripciones más costosas:
            </p>
            <ul className="top-list">
                {top3.map(s => (
                    <li key={s.id}>
                        <span className="dot" />
                        {s.nombre} ({formatCurrency(s.precio)})
                    </li>
                ))}
            </ul>

            <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={() => setIsSimulating(true)}
                className="sim-btn"
            >
                <Calculator size={16} /> Simular ahorro
            </AnimatedButton>

            <AnimatePresence>
                {isSimulating && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <GlassCard className="modal-content-centered">
                            <div className="modal-header">
                                <h3>Simulador de Ahorro</h3>
                                <button onClick={() => setIsSimulating(false)}><X size={20} color="white" /></button>
                            </div>
                            <div className="sim-content">
                                <p>Si cancelaras estas suscripciones, tu gasto anual se reduciría en:</p>
                                <div className="big-saving">
                                    {formatCurrency(potentialSavings * 12)}
                                </div>
                                <p className="small-text">
                                    Esta es una simulación simple basada en tus suscripciones activas más costosas.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .savings-card {
                    border: 1px solid rgba(241, 194, 27, 0.3);
                    background: rgba(241, 194, 27, 0.05);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    h4 { margin: 0; }
                }
                .suggestion-text {
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin-bottom: 12px;
                }
                .top-list {
                    list-style: none;
                    margin-bottom: 16px;
                    li {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 0.9rem;
                        color: var(--text-secondary);
                        margin-bottom: 4px;
                    }
                    .dot {
                        width: 6px;
                        height: 6px;
                        background: var(--accent-color);
                        border-radius: 50%;
                    }
                }
                .sim-btn {
                    width: 100%;
                }
                .modal-content-centered {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 400px;
                    z-index: 101;
                    background: rgba(15, 12, 41, 0.95);
                }
                .big-saving {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #4caf50;
                    margin: 16px 0;
                    text-align: center;
                }
                .small-text {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-align: center;
                }
            `}</style>
        </GlassCard>
    );
};

export default SavingsSuggestions;
