import React, { useMemo } from 'react';
import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { AnimatedButton } from './ui/AnimatedButton';
import { formatCurrency } from '../utils/formatters';
import { calcularCostoMensual } from '../utils/calculations';

const SubscriptionList = ({ suscripciones, categorias, onEdit, onDelete }) => {
    const [filterCategory, setFilterCategory] = React.useState('');

    const filteredSubs = useMemo(() => {
        return suscripciones.filter(sub => {
            if (filterCategory && sub.categoria !== filterCategory) return false;
            return true;
        });
    }, [suscripciones, filterCategory]);

    if (suscripciones.length === 0) {
        return (
            <GlassCard className="empty-state">
                <h3>No hay suscripciones</h3>
                <p>Añade una nueva suscripción para comenzar</p>
            </GlassCard>
        );
    }

    return (
        <div className="subscription-list-container">
            <div className="filters">
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="cards-grid">
                {filteredSubs.map(sub => {
                    const cat = categorias.find(c => c.id === sub.categoria);
                    const costoMen = calcularCostoMensual(
                        sub.esCompartida ? sub.miParte : sub.precio,
                        sub.frecuencia
                    );

                    return (
                        <GlassCard key={sub.id} className="sub-card">
                            <div className="card-header">
                                <div className="sub-icon" style={{ background: cat?.color === 'magenta' ? 'var(--accent-color)' : (cat?.color || 'gray') }}>
                                    {sub.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className="sub-info">
                                    <h4>{sub.nombre}</h4>
                                    <span className="sub-freq">{sub.frecuencia}</span>
                                </div>
                                <div className="sub-price">
                                    {formatCurrency(sub.esCompartida ? sub.miParte : sub.precio)}
                                </div>
                            </div>

                            <div className="card-details">
                                <div className="detail-item">
                                    <Calendar size={14} />
                                    <span>Próx: {new Date().toLocaleDateString()}</span>
                                    {/* Placeholder date logic */}
                                </div>
                                <div className="detail-item">
                                    <CreditCard size={14} />
                                    <span>{formatCurrency(costoMen)}/mes</span>
                                </div>
                            </div>

                            <div className="card-actions">
                                <AnimatedButton variant="secondary" className="action-btn" onClick={() => onEdit(sub)}>
                                    <Edit2 size={14} />
                                </AnimatedButton>
                                <AnimatedButton variant="danger" className="action-btn" onClick={() => onDelete(sub.id)}>
                                    <Trash2 size={14} />
                                </AnimatedButton>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            <style>{`
                .subscription-list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .filter-select {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    color: var(--text-primary);
                    padding: 8px 12px;
                    border-radius: 10px;
                    outline: none;
                    cursor: pointer;
                    font-size: 0.85rem;
                    backdrop-filter: var(--glass-blur);
                }
                .cards-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                @media (min-width: 640px) {
                    .cards-grid {
                        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    }
                }
                .sub-card {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 16px;
                    transition: all 0.3s ease;
                    border: 1px solid var(--card-border);
                }
                .sub-card:hover {
                    transform: translateY(-2px);
                    border-color: var(--accent-color);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.05);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sub-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.2rem;
                    color: white; /* Conserve white icon on colored bg */
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    flex-shrink: 0;
                }
                .sub-info {
                    flex: 1;
                    min-width: 0;
                }
                .sub-info h4 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .sub-freq {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .sub-price {
                    font-weight: 800;
                    font-size: 1.15rem;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .card-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    background: rgba(0,0,0,0.03);
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid rgba(0,0,0,0.02);
                }
                [data-theme='dark'] .card-details {
                    background: rgba(255,255,255,0.03);
                    border-color: rgba(255,255,255,0.05);
                }
                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .detail-item span {
                    white-space: nowrap;
                }
                .card-actions {
                    display: flex;
                    gap: 8px;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    padding-top: 12px;
                    margin-top: 4px;
                }
                [data-theme='dark'] .card-actions {
                    border-color: rgba(255,255,255,0.05);
                }
                .action-btn {
                    flex: 1;
                    padding: 8px !important;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

export default SubscriptionList;
