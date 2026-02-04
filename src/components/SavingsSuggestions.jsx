import React, { useState } from 'react';
import { Tile, Button, Modal } from '@carbon/react';
import { Idea, Calculator } from '@carbon/icons-react';
import { formatCurrency } from '../utils/formatters';

const SavingsSuggestions = ({ suscripciones }) => {
    const [isSimulating, setIsSimulating] = useState(false);

    // Analyze simple opportunities
    const activeSubs = suscripciones.filter(s => s.estado === 'activa' && !s.esPrueba);

    // 1. Top 3 most expensive
    const sortedByPrice = [...activeSubs].sort((a, b) => b.precio - a.precio);
    const top3 = sortedByPrice.slice(0, 3);
    const potentialSavings = top3.reduce((acc, curr) => acc + curr.precio, 0);

    if (activeSubs.length === 0) return null;

    return (
        <Tile style={{ marginTop: '1rem', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Idea size={20} fill="#0f62fe" />
                <h4 style={{ margin: 0 }}>Oportunidades de Ahorro</h4>
            </div>

            <p style={{ marginBottom: '1rem' }}>
                Podrías ahorrar hasta <strong>{formatCurrency(potentialSavings)}/mes</strong> cancelando tus 3 suscripciones más costosas:
            </p>
            <ul style={{ marginBottom: '1rem', paddingLeft: '1.2rem' }}>
                {top3.map(s => (
                    <li key={s.id}>{s.nombre} ({formatCurrency(s.precio)})</li>
                ))}
            </ul>

            <Button kind="tertiary" size="sm" renderIcon={Calculator} onClick={() => setIsSimulating(true)}>
                Simular ahorro
            </Button>

            <Modal
                open={isSimulating}
                onRequestClose={() => setIsSimulating(false)}
                modalHeading="Simulador de Ahorro"
                passiveModal
            >
                <p style={{ marginBottom: '1rem' }}>
                    Si cancelaras estas suscripciones, tu gasto anual se reduciría en <strong>{formatCurrency(potentialSavings * 12)}</strong>.
                </p>
                <p>
                    Esta es una simulación simple basada en tus suscripciones activas más costosas.
                </p>
            </Modal>
        </Tile>
    );
};

export default SavingsSuggestions;
