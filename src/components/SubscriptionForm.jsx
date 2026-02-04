import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Plus, ChevronDown } from 'lucide-react';
import { FluidInput } from './ui/FluidInput';
import { AnimatedButton } from './ui/AnimatedButton';

const SubscriptionForm = ({ categories, onAdd, onAddCategory, initialData = null }) => {
    // ... same state ...
    const [formData, setFormData] = useState(initialData || {
        nombre: '',
        precio: '',
        frecuencia: 'mensual',
        categoria: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        esPrueba: false,
        fechaFinPrueba: '',
        recordarCancelacion: false,
        esCompartida: false,
        miParte: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
        if (!formData.precio) newErrors.precio = 'El precio es obligatorio';
        if (!formData.categoria) newErrors.categoria = 'La categoría es obligatoria';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd({
            ...formData,
            precio: parseFloat(formData.precio),
            miParte: formData.esCompartida ? parseFloat(formData.miParte) : null
        });

        // Reset form
        setFormData({
            nombre: '',
            precio: '',
            frecuencia: 'mensual',
            categoria: '',
            fechaInicio: new Date().toISOString().split('T')[0],
            esPrueba: false,
            fechaFinPrueba: '',
            recordarCancelacion: false,
            esCompartida: false,
            miParte: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="subscription-form">
            <FluidInput
                id="nombre"
                label="Nombre de la suscripción"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                error={errors.nombre}
            />

            <div className="form-row-grid">
                <div className="grid-item">
                    <FluidInput
                        id="precio"
                        label="Precio (€)"
                        type="number"
                        value={formData.precio}
                        onChange={(e) => handleChange('precio', e.target.value)}
                        error={errors.precio}
                    />
                </div>
                <div className="grid-item">
                    <div className="custom-select-container">
                        <label className="select-label">Frecuencia</label>
                        <select
                            value={formData.frecuencia}
                            onChange={(e) => handleChange('frecuencia', e.target.value)}
                            className="custom-select"
                        >
                            <option value="mensual">Mensual</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="semestral">Semestral</option>
                            <option value="anual">Anual</option>
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>
            </div>

            <div className="custom-select-container">
                <label className="select-label">Categoría</label>
                <div className="select-with-action">
                    <div className="select-relative">
                        <select
                            value={formData.categoria}
                            onChange={(e) => handleChange('categoria', e.target.value)}
                            className="custom-select"
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                    <AnimatedButton type="button" variant="secondary" onClick={() => onAddCategory({ nombre: 'Nueva', color: 'gray' })} className="add-cat-btn">
                        <Plus size={18} />
                    </AnimatedButton>
                </div>
                {errors.categoria && <span className="error-text">{errors.categoria}</span>}
            </div>

            <FluidInput
                id="fechaInicio"
                label="Fecha de Inicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
            />

            <div className="toggles-section">
                <div
                    className={`toggle-item ${formData.esPrueba ? 'active' : ''}`}
                    onClick={() => handleChange('esPrueba', !formData.esPrueba)}
                >
                    <span>¿Período de prueba?</span>
                    {formData.esPrueba ? <ToggleRight color="var(--accent-color)" /> : <ToggleLeft color="var(--text-secondary)" />}
                </div>

                {formData.esPrueba && (
                    <FluidInput
                        id="fechaFinPrueba"
                        label="Fin de prueba"
                        type="date"
                        value={formData.fechaFinPrueba}
                        onChange={(e) => handleChange('fechaFinPrueba', e.target.value)}
                    />
                )}

                <div
                    className={`toggle-item ${formData.esCompartida ? 'active' : ''}`}
                    onClick={() => handleChange('esCompartida', !formData.esCompartida)}
                >
                    <span>¿Es compartida?</span>
                    {formData.esCompartida ? <ToggleRight color="var(--accent-color)" /> : <ToggleLeft color="var(--text-secondary)" />}
                </div>

                {formData.esCompartida && (
                    <FluidInput
                        id="miParte"
                        label="Mi parte del costo"
                        type="number"
                        value={formData.miParte}
                        onChange={(e) => handleChange('miParte', e.target.value)}
                    />
                )}
            </div>

            <AnimatedButton type="submit" isLoading={false} className="submit-btn" size="lg">
                Guardar Suscripción
            </AnimatedButton>

            <style>{`
                .subscription-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .form-row-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    align-items: start;
                }
                .grid-item {
                    width: 100%;
                }
                .custom-select-container {
                    position: relative;
                    width: 100%;
                }
                .select-label {
                    position: absolute;
                    top: -10px;
                    left: 12px;
                    font-size: 0.85rem;
                    color: var(--accent-color);
                    background: var(--card-bg);
                    padding: 0 4px;
                    border-radius: 4px;
                    z-index: 10;
                    pointer-events: none;
                }
                .select-with-action {
                    display: flex;
                    gap: 8px;
                    align-items: stretch;
                }
                .select-relative {
                    position: relative;
                    flex: 1;
                }
                .custom-select {
                    width: 100%;
                    padding: 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    appearance: none;
                    cursor: pointer;
                    height: 56px;
                }
                [data-theme='light'] .custom-select {
                    background: rgba(0,0,0,0.03);
                    border-color: rgba(0,0,0,0.15);
                    color: #1a1a1a;
                }
                .custom-select:focus {
                    border-color: var(--accent-color);
                    background: rgba(255,255,255,0.05);
                }
                [data-theme='light'] .custom-select:focus {
                    background: rgba(0,0,0,0.05);
                }
                .select-arrow {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                    pointer-events: none;
                }
                [data-theme='light'] .select-arrow {
                    color: #666;
                }
                .add-cat-btn {
                    padding: 0 12px !important;
                    height: auto;
                }
                .error-text {
                    color: #ff4d4d;
                    font-size: 0.8rem;
                    margin-top: 4px;
                    display: block;
                }
                .toggles-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px;
                }
                [data-theme='light'] .toggles-section {
                    background: rgba(0,0,0,0.02);
                    border-color: rgba(0,0,0,0.08);
                }
                .toggle-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    padding: 4px 0;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                }
                .submit-btn {
                    margin-top: 10px;
                    height: 52px;
                    font-weight: 600;
                }
            `}</style>
        </form>
    );
};

export default SubscriptionForm;
