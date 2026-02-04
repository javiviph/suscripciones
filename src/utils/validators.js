export const validateSubscription = (data) => {
    const errors = {};

    if (!data.nombre?.trim()) errors.nombre = 'El nombre es obligatorio';
    if (data.precio <= 0) errors.precio = 'El precio debe ser mayor a 0';

    if (data.esCompartida) {
        if (data.miParte > data.precioTotal) {
            errors.miParte = 'Tu parte no puede ser mayor al total';
        }
    }

    if (data.esPrueba && !data.fechaFinPrueba) {
        errors.fechaFinPrueba = 'Fecha fin obligatoria para pruebas';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
