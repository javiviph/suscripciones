import React from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    TableToolbarMenu,
    TableToolbarAction,
    Button,
    Tag,
    Select,
    SelectItem
} from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/icons-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calcularCostoMensual } from '../utils/calculations';

const headers = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'estado', header: 'Estado' },
    { key: 'precio', header: 'Precio' },
    { key: 'frecuencia', header: 'Frecuencia' },
    { key: 'costoMensual', header: 'Mensual (Est.)' },
    { key: 'proximoCobro', header: 'Próximo Cobro' },
    { key: 'actions', header: '' },
];

const SubscriptionList = ({ suscripciones, categorias, onEdit, onDelete, onAdd }) => {
    const [filterCategory, setFilterCategory] = React.useState('');
    const [filterFrequency, setFilterFrequency] = React.useState('');

    const filteredSubs = React.useMemo(() => {
        return suscripciones.filter(sub => {
            if (filterCategory && sub.categoria !== filterCategory) return false;
            if (filterFrequency && sub.frecuencia !== filterFrequency) return false;
            return true;
        });
    }, [suscripciones, filterCategory, filterFrequency]);

    const rows = filteredSubs.map(sub => {
        // Prepare row data
        const cat = categorias.find(c => c.id === sub.categoria);
        const costoMen = calcularCostoMensual(
            sub.esCompartida ? sub.miParte : sub.precio,
            sub.frecuencia
        );

        return {
            id: sub.id,
            nombre: sub.nombre,
            estado: sub.esPrueba ? <Tag type="magenta">Prueba</Tag> : (sub.estado === 'activa' ? <Tag type="green">Activa</Tag> : <Tag type="gray">{sub.estado}</Tag>),
            precio: formatCurrency(sub.esCompartida ? sub.miParte : sub.precio),
            frecuencia: sub.frecuencia,
            costoMensual: formatCurrency(costoMen),
            proximoCobro: '-',
            actions: (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button kind="ghost" size="sm" hasIconOnly renderIcon={Edit} iconDescription="Editar" onClick={() => onEdit(sub)} />
                    <Button kind="danger--ghost" size="sm" hasIconOnly renderIcon={TrashCan} iconDescription="Eliminar" onClick={() => onDelete(sub)} />
                </div>
            )
        };
    });

    return (

        <DataTable rows={rows} headers={headers}>
            {({
                rows,
                headers,
                getHeaderProps,
                getRowProps,
                getTableProps,
                onInputChange,
            }) => (
                <div style={{ background: 'white', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1rem 0 1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '200px' }}>
                                <Select
                                    id="filter-cat"
                                    labelText="Categoría"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    size="sm"
                                    inline
                                    hideLabel
                                    placeholder="Todas las categorías"
                                >
                                    <SelectItem value="" text="Todas las categorías" />
                                    {categorias.map(c => <SelectItem key={c.id} value={c.id} text={c.nombre} />)}
                                </Select>
                            </div>
                            <div style={{ width: '200px' }}>
                                <Select
                                    id="filter-freq"
                                    labelText="Frecuencia"
                                    value={filterFrequency}
                                    onChange={(e) => setFilterFrequency(e.target.value)}
                                    size="sm"
                                    inline
                                    hideLabel
                                    placeholder="Todas las frecuencias"
                                >
                                    <SelectItem value="" text="Todas las frecuencias" />
                                    {['mensual', 'trimestral', 'semestral', 'anual'].map(f => <SelectItem key={f} value={f} text={f.charAt(0).toUpperCase() + f.slice(1)} />)}
                                </Select>
                            </div>
                        </div>
                        <Button onClick={onAdd} renderIcon={Add} size="sm">Añadir Suscripción</Button>
                    </div>
                    <TableToolbar>
                        <TableToolbarContent>
                            <TableToolbarSearch onChange={onInputChange} placeholder="Buscar suscripción..." />
                        </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length > 0 ? rows.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    {row.cells.map((cell) => (
                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                    ))}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No se encontraron suscripciones
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </DataTable>
    );
};

export default SubscriptionList;
