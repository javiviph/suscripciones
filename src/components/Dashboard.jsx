import React, { useMemo } from 'react';
import { Tile, Grid, Column } from '@carbon/react';
import { Currency, Calendar, Folder, WarningAlt } from '@carbon/icons-react';
import { SimpleBarChart, DonutChart } from '@carbon/charts-react';

import { calcularTotales } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import SavingsSuggestions from './SavingsSuggestions';
import '@carbon/charts/styles.css';


const Dashboard = ({ suscripciones, categorias }) => {

    // ... (imports remain)

    // ... (inside component)
    <Column lg={8} md={8} sm={4}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* existing alerts code */}
            {suscripciones
                .filter(s => s.esPrueba && s.fechaFinPrueba)
                .map(s => {
                    // ...
                })
            }

            <SavingsSuggestions suscripciones={suscripciones} />
        </div>
    </Column>

    const totals = useMemo(() => calcularTotales(suscripciones), [suscripciones]);

    // Data for Category Donut Chart
    const categoryData = useMemo(() => {
        const data = [];
        suscripciones
            .filter(s => s.estado === 'activa' && !s.esPrueba)
            .forEach(sub => {
                const cat = categorias.find(c => c.id === sub.categoria);
                const group = cat ? cat.nombre : 'Otra';
                const price = sub.esCompartida ? sub.miParte : sub.precio;
                // Simplify: just summing raw prices implies mixing frequencies, 
                // ideally we sum monthly cost
                // For accurate chart: sum monthly cost
                // But for visual simplicity let's stick to monthly cost contribution

                // Actually, let's calculate monthly cost for the chart
                let cost = sub.precio; // simplified, should use calc logic
                if (sub.frecuencia === 'trimestral') cost /= 3;
                if (sub.frecuencia === 'semestral') cost /= 6;
                if (sub.frecuencia === 'anual') cost /= 12;

                const existing = data.find(d => d.group === group);
                if (existing) {
                    existing.value += cost;
                } else {
                    data.push({ group, value: cost });
                }
            });
        return data.map(d => ({ ...d, value: parseFloat(d.value.toFixed(2)) }));
    }, [suscripciones, categorias]);

    const donutOptions = {
        title: 'Gasto por Categoría (Mensual)',
        resizable: true,
        height: '300px',
        donut: {
            center: {
                label: 'Mensual'
            }
        }
    };

    return (
        <div className="dashboard-container">
            <Grid>
                <Column lg={4} md={4} sm={4}>
                    <Tile className="stat-tile">
                        <h3 className="stat-label">Gasto Mensual</h3>
                        <div className="stat-value">{formatCurrency(totals.gastoMensual)}</div>
                    </Tile>
                </Column>
                <Column lg={4} md={4} sm={4}>
                    <Tile className="stat-tile">
                        <h3 className="stat-label">Gasto Anual</h3>
                        <div className="stat-value">{formatCurrency(totals.gastoAnual)}</div>
                    </Tile>
                </Column>
                <Column lg={4} md={4} sm={4}>
                    <Tile className="stat-tile">
                        <h3 className="stat-label">Suscripciones</h3>
                        <div className="stat-value">{totals.totalSuscripciones}</div>
                    </Tile>
                </Column>
                <Column lg={4} md={4} sm={4}>
                    <Tile className={`stat-tile ${totals.enPrueba > 0 ? "warning-tile" : ""}`}>
                        <h3 className="stat-label">En Prueba</h3>
                        <div className="stat-value">{totals.enPrueba}</div>
                    </Tile>
                </Column>
            </Grid>

            {suscripciones.length === 0 ? (
                <div className="empty-state">
                    <h3>No tienes suscripciones activas</h3>
                    <p>Comienza añadiendo tu primera suscripción para ver tus estadísticas.</p>
                </div>
            ) : (
                <Grid className="charts-grid">
                    <Column lg={8} md={8} sm={4}>
                        <div className="chart-card">
                            <h4 className="card-title">Distribución de Gastos</h4>
                            {categoryData.length > 0 ? (
                                <DonutChart data={categoryData} options={donutOptions} />
                            ) : (
                                <p className="no-data-text">Añade suscripciones con precio para ver el gráfico</p>
                            )}
                        </div>
                    </Column>
                    <Column lg={8} md={8} sm={4}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {suscripciones
                                .filter(s => s.esPrueba && s.fechaFinPrueba)
                                .map(s => {
                                    const daysLeft = Math.ceil((new Date(s.fechaFinPrueba) - new Date()) / (1000 * 60 * 60 * 24));
                                    if (daysLeft <= 7 && daysLeft >= 0) {
                                        return (
                                            <Tile key={s.id} className="alert-tile warning">
                                                <div className="alert-header">
                                                    <WarningAlt size={20} fill="#f1c21b" />
                                                    <span>Prueba finaliza pronto</span>
                                                </div>
                                                <div className="alert-body">
                                                    <strong>{s.nombre}</strong> termina en {daysLeft} días.
                                                    <br />
                                                    Costo futuro: {formatCurrency(s.precioPostPrueba)}
                                                </div>
                                            </Tile>
                                        );
                                    }
                                    return null;
                                })
                            }
                            <SavingsSuggestions suscripciones={suscripciones} />
                        </div>
                    </Column>
                </Grid>
            )}

            <style>{`
        .dashboard-container { padding-bottom: 2rem; }
        
        .stat-tile {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1.5rem;
            background: white;
            border-bottom: 4px solid #0f62fe; /* Accent color bottom */
        }
        .stat-label { font-size: 0.875rem; color: #697077; font-weight: 500; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 2.25rem; font-weight: 600; color: #161616; line-height: 1; }
        
        .charts-grid { margin-top: 1.5rem; }
        .chart-card {
            background: white;
            padding: 1.5rem;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-sm);
            height: 100%;
        }
        .card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem; }
        
        .warning-tile { border-bottom-color: #f1c21b !important; }
        
        .alert-tile {
            background: #fffcf0; /* Light yellow bg for alerts */
            border-left: 4px solid #f1c21b;
            padding: 1rem;
        }
        .alert-header { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; color: #b08600; }
        .alert-body { font-size: 0.875rem; line-height: 1.4; }

        .empty-state {
            text-align: center;
            padding: 4rem 1rem;
            background: white;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-sm);
            margin-top: 1.5rem;
        }
        .empty-state h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .empty-state p { color: #697077; }
        .no-data-text { color: #697077; font-style: italic; }
      `}</style>
        </div>
    );
};

export default Dashboard;
