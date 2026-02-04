import React, { useState, useEffect } from 'react';
import {
    Modal,
    TextInput,
    NumberInput,
    Select,
    SelectItem,
    DatePicker,
    DatePickerInput,
    Toggle,
    TextArea,
    FormGroup,
    Grid,
    Column,
    InlineNotification
} from '@carbon/react';
import { FRECUENCIAS } from '../utils/calculations';
import { validateSubscription } from '../utils/validators';

const SubscriptionForm = ({ open, subscription, categories, onClose, onSave }) => {
    const isEdit = !!subscription;

    const initialState = {
        nombre: '',
        precio: 0,
        frecuencia: FRECUENCIAS.MENSUAL,
        categoria: categories[0]?.id || '',
        fechaInicio: '',
        diaCobroMensual: '',
        esPrueba: false,
        fechaFinPrueba: '',
        precioPostPrueba: 0,
        esCompartida: false,
        precioTotal: 0,
        miParte: 0,
        notas: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (subscription) {
            setFormData({
                ...initialState,
                ...subscription,
                fechaInicio: subscription.fechaInicio ? new Date(subscription.fechaInicio) : '',
                fechaFinPrueba: subscription.fechaFinPrueba ? new Date(subscription.fechaFinPrueba) : ''
            });
        } else {
            setFormData({
                ...initialState,
                categoria: categories[0]?.id || ''
            });
        }
        setErrors({});
    }, [subscription, open]); // Reset when opening/changing sub

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for field
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = () => {
        const { isValid, errors: newErrors } = validateSubscription(formData);

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        // Convert dates to ISO strings before saving
        const dataToSave = {
            ...formData,
            fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : null,
            fechaFinPrueba: formData.fechaFinPrueba ? new Date(formData.fechaFinPrueba).toISOString() : null,
            diaCobroMensual: formData.diaCobroMensual ? parseInt(formData.diaCobroMensual) : null,
            precio: parseFloat(formData.precio),
            miParte: formData.esCompartida ? parseFloat(formData.miParte) : 0,
            precioTotal: formData.esCompartida ? parseFloat(formData.precioTotal) : 0,
            precioPostPrueba: formData.esPrueba ? parseFloat(formData.precioPostPrueba) : 0,
        };

        onSave(dataToSave);
    };

    return (
        <Modal
            open={open}
            onRequestClose={onClose}
            modalHeading={isEdit ? "Editar Suscripción" : "Añadir Suscripción"}
            primaryButtonText="Guardar"
            secondaryButtonText="Cancelar"
            onRequestSubmit={handleSubmit}
            onSecondarySubmit={onClose}
            preventCloseOnClickOutside
        >
            <FormGroup>
                <TextInput
                    id="nombre"
                    labelText="Nombre de la suscripción"
                    placeholder="Ej: Netflix"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    invalid={!!errors.nombre}
                    invalidText={errors.nombre}
                />
            </FormGroup>

            <Grid className="form-grid">
                <Column sm={2} md={4} lg={8}>
                    <NumberInput
                        id="precio"
                        label="Precio (€)"
                        value={formData.precio}
                        onChange={(e, { value }) => handleChange('precio', value)}
                        invalid={!!errors.precio}
                        invalidText={errors.precio}
                        min={0}
                        step={0.01}
                    />
                </Column>
                <Column sm={2} md={4} lg={8}>
                    <Select
                        id="frecuencia"
                        labelText="Frecuencia"
                        value={formData.frecuencia}
                        onChange={(e) => handleChange('frecuencia', e.target.value)}
                    >
                        {Object.values(FRECUENCIAS).map(f => (
                            <SelectItem key={f} value={f} text={f.charAt(0).toUpperCase() + f.slice(1)} />
                        ))}
                    </Select>
                </Column>
            </Grid>

            <FormGroup style={{ marginTop: '1rem' }}>
                <Select
                    id="categoria"
                    labelText="Categoría"
                    value={formData.categoria}
                    onChange={(e) => handleChange('categoria', e.target.value)}
                >
                    {categories.map(c => (
                        <SelectItem key={c.id} value={c.id} text={c.nombre} />
                    ))}
                </Select>
            </FormGroup>

            <Grid className="form-grid" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Column sm={4} md={8} lg={16}>
                    <Toggle
                        id="esPrueba"
                        labelText="¿Es período de prueba?"
                        toggled={formData.esPrueba}
                        onToggle={(checked) => handleChange('esPrueba', checked)}
                    />
                </Column>
            </Grid>

            {formData.esPrueba && (
                <div style={{ padding: '1rem', background: '#f4f4f4', marginBottom: '1rem' }}>
                    <DatePicker datePickerType="single" dateFormat="d/m/Y" onChange={(dates) => handleChange('fechaFinPrueba', dates[0])} value={formData.fechaFinPrueba}>
                        <DatePickerInput
                            id="fechaFinPrueba"
                            labelText="Fecha Fin de Prueba"
                            placeholder="dd/mm/yyyy"
                            invalid={!!errors.fechaFinPrueba}
                            invalidText={errors.fechaFinPrueba}
                        />
                    </DatePicker>
                    <NumberInput
                        id="precioPost"
                        label="Precio después de prueba (€)"
                        value={formData.precioPostPrueba}
                        onChange={(e, { value }) => handleChange('precioPostPrueba', value)}
                        style={{ marginTop: '1rem' }}
                    />
                </div>
            )}

            <Grid className="form-grid" style={{ marginBottom: '1rem' }}>
                <Column sm={4} md={8} lg={16}>
                    <Toggle
                        id="esCompartida"
                        labelText="¿Es compartida?"
                        toggled={formData.esCompartida}
                        onToggle={(checked) => handleChange('esCompartida', checked)}
                    />
                </Column>
            </Grid>

            {formData.esCompartida && (
                <div style={{ padding: '1rem', background: '#e0e0e0', marginBottom: '1rem' }}>
                    <Grid>
                        <Column sm={2} md={4} lg={8}>
                            <NumberInput
                                id="precioTotal"
                                label="Precio Total (€)"
                                value={formData.precioTotal}
                                onChange={(e, { value }) => handleChange('precioTotal', value)}
                            />
                        </Column>
                        <Column sm={2} md={4} lg={8}>
                            <NumberInput
                                id="miParte"
                                label="Mi parte (€)"
                                value={formData.miParte}
                                onChange={(e, { value }) => handleChange('miParte', value)}
                                invalid={!!errors.miParte}
                                invalidText={errors.miParte}
                            />
                        </Column>
                    </Grid>
                </div>
            )}

            <FormGroup>
                <TextArea
                    labelText="Notas"
                    value={formData.notas}
                    onChange={(e) => handleChange('notas', e.target.value)}
                    rows={3}
                />
            </FormGroup>

        </Modal>
    );
};

export default SubscriptionForm;
