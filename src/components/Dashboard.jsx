import React, { useMemo } from 'react';
import { calcularTotales } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import SavingsSuggestions from './SavingsSuggestions'; // Ensure this doesn't use Carbon either
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';

const Dashboard = ({ suscripciones, categorias }) => {
    const totals = useMemo(() => calcularTotales(suscripciones), [suscripciones]);

    // Simple visualization for categories (CSS bars for now)
    const categoryData = useMemo(() => {
        const data = [];
        suscripciones
            .filter(s => s.estado === 'activa' && !s.esPrueba)
            .forEach(sub => {
                const cat = categorias.find(c => c.id === sub.categoria);
                const group = cat ? cat.nombre : 'Otra';
                let cost = sub.precio;
                if (sub.frecuencia === 'trimestral') cost /= 3;
                if (sub.frecuencia === 'semestral') cost /= 6;
                if (sub.frecuencia === 'anual') cost /= 12;

                const existing = data.find(d => d.group === group);
                if (existing) {
                    existing.value += cost;
                } else {
                    data.push({ group, value: cost, color: cat?.color || 'gray' });
                }
            });
        return data.sort((a, b) => b.value - a.value);
    }, [suscripciones, categorias]);

    return (
        <div className="dashboard-container">
            <div className="stats-grid">
                <GlassCard>
                    <h3 className="stat-label">Gasto Mensual</h3>
                    <div className="stat-value">{formatCurrency(totals.gastoMensual)}</div>
                </GlassCard>
                <GlassCard>
                    <h3 className="stat-label">Gasto Anual</h3>
                    <div className="stat-value">{formatCurrency(totals.gastoAnual)}</div>
                </GlassCard>
                <GlassCard>
                    <h3 className="stat-label">Suscripciones</h3>
                    <div className="stat-value">{totals.totalSuscripciones}</div>
                </GlassCard>
            </div>

            <div className="charts-section">
                <GlassCard className="chart-card">
                    <h4>Gasto por Categoría</h4>
                    <div className="bars-container">
                        {categoryData.length > 0 ? categoryData.map(d => (
                            <div key={d.group} className="bar-row">
                                <div className="bar-label">
                                    <span>{d.group}</span>
                                    <span>{formatCurrency(d.value)}</span>
                                </div>
                                <div className="bar-bg">
                                    <motion.div
                                        className="bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / totals.gastoMensual) * 100}%` }}
                                        transition={{ duration: 1 }}
                                        style={{ background: d.color === 'magenta' ? 'var(--accent-color)' : 'var(--success)' }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="empty-text">Añade gastos para ver el gráfico</p>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Savings Suggestions would need to be checked if it uses Carbon */}
            <div style={{ marginTop: '20px' }}>
                <SavingsSuggestions suscripciones={suscripciones} />
            </div>

            <style>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }
                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .bars-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 16px;
                }
                .bar-row {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .bar-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                }
                .bar-bg {
                    width: 100%;
                    height: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .bar-fill {
                    height: 100%;
                    border-radius: 4px;
                }
                .empty-text {
                    color: var(--text-primary);
                    opacity: 0.6;
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
