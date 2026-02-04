export const FRECUENCIAS = {
    MENSUAL: 'mensual',
    TRIMESTRAL: 'trimestral',
    SEMESTRAL: 'semestral',
    ANUAL: 'anual',
};

export const calcularCostoMensual = (precio, frecuencia) => {
    switch (frecuencia) {
        case FRECUENCIAS.MENSUAL:
            return precio;
        case FRECUENCIAS.TRIMESTRAL:
            return precio / 3;
        case FRECUENCIAS.SEMESTRAL:
            return precio / 6;
        case FRECUENCIAS.ANUAL:
            return precio / 12;
        default:
            return precio;
    }
};

export const calcularProximoCobro = (fechaInicio, diaCobro, frecuencia) => {
    const hoy = new Date();
    let baseDate = fechaInicio ? new Date(fechaInicio) : new Date();

    if (diaCobro) {
        // Si hay día de cobro fijo, intentamos ajustar al próximo mes con ese día
        let nextDate = new Date(hoy.getFullYear(), hoy.getMonth(), diaCobro);
        if (nextDate < hoy) {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }
        return nextDate;
    }

    // Lógica simplificada si solo tenemos fechaInicio + frecuencia
    // (Implementación más robusta requeriría iterar desde fechaInicio hasta pasar hoy)
    return baseDate;
};

export const calcularTotales = (suscripciones) => {
    const activas = suscripciones.filter(s => s.estado === 'activa' && !s.esPrueba);
    const pruebas = suscripciones.filter(s => s.estado === 'activa' && s.esPrueba);

    let gastoMensual = 0;
    let gastoAnual = 0;

    activas.forEach(sub => {
        const precioBase = sub.esCompartida ? sub.miParte : sub.precio;
        const costoMensual = calcularCostoMensual(Number(precioBase), sub.frecuencia);
        gastoMensual += costoMensual;
    });

    gastoAnual = gastoMensual * 12;

    return {
        gastoMensual,
        gastoAnual,
        totalSuscripciones: activas.length,
        enPrueba: pruebas.length
    };
};
