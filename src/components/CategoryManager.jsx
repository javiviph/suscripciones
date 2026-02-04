import React, { useState } from 'react';
import {
    Modal,
    TextInput,
    Select,
    SelectItem,
    Tag,
    Button
} from '@carbon/react';
import { TrashCan } from '@carbon/icons-react';
import { COLORES_CARBON } from '../constants/categorias';

const CategoryManager = ({ open, categories, onClose, onAdd, onDelete }) => {
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState(COLORES_CARBON[0].value);

    const handleAdd = () => {
        if (newCatName.trim()) {
            onAdd({ nombre: newCatName, color: newCatColor });
            setNewCatName('');
        }
    };

    return (
        <Modal
            open={open}
            onRequestClose={onClose}
            modalHeading="Gestionar Categorías"
            passiveModal
        >
            <div style={{ marginBottom: '2rem' }}>
                <h4>Añadir nueva categoría</h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem' }}>
                    <TextInput
                        id="new-cat-name"
                        labelText="Nombre"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                    />
                    <Select
                        id="new-cat-color"
                        labelText="Color"
                        value={newCatColor}
                        onChange={(e) => setNewCatColor(e.target.value)}
                    >
                        {COLORES_CARBON.map(c => (
                            <SelectItem key={c.value} value={c.value} text={c.label} />
                        ))}
                    </Select>
                    <Button size="md" onClick={handleAdd} disabled={!newCatName.trim()}>Añadir</Button>
                </div>
            </div>

            <h4>Categorías existentes</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {categories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Tag type={cat.color}>{cat.nombre}</Tag>
                        {cat.esPersonalizada && (
                            <Button
                                kind="ghost"
                                size="sm"
                                hasIconOnly
                                renderIcon={TrashCan}
                                iconDescription="Eliminar"
                                onClick={() => onDelete(cat.id)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default CategoryManager;
