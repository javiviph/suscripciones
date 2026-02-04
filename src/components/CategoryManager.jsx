import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORES_CARBON } from '../constants/categorias';
import { FluidInput } from './ui/FluidInput';
import { AnimatedButton } from './ui/AnimatedButton';
import { GlassCard } from './ui/GlassCard';

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
        <AnimatePresence>
            {open && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <GlassCard className="modal-content-centered">
                        <div className="modal-header">
                            <h3>Gestionar Categorías</h3>
                            <button onClick={onClose}><X size={24} color="white" /></button>
                        </div>

                        <div className="add-section">
                            <h4>Añadir nueva</h4>
                            <div className="add-row">
                                <FluidInput
                                    id="new-cat-name"
                                    label="Nombre de categoría"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                />
                                <div className="color-picker">
                                    {COLORES_CARBON.map(c => (
                                        <div
                                            key={c.value}
                                            className={`color-dot ${newCatColor === c.value ? 'selected' : ''}`}
                                            style={{ background: c.value === 'magenta' ? 'var(--accent-color)' : c.value }} // mapping logic needed potentially
                                            onClick={() => setNewCatColor(c.value)}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                                <AnimatedButton onClick={handleAdd} disabled={!newCatName.trim()} size="sm">
                                    +
                                </AnimatedButton>
                            </div>
                        </div>

                        <div className="list-section">
                            <h4>Existentes</h4>
                            <div className="tags-container">
                                {categories.map(cat => (
                                    <div key={cat.id} className="category-tag">
                                        <span className="cat-name">{cat.nombre}</span>
                                        {cat.esPersonalizada && (
                                            <button className="del-btn" onClick={() => onDelete(cat.id)}>
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>

                    <style>{`
                        .modal-content-centered {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 90%;
                            max-width: 500px;
                            z-index: 101;
                            background: rgba(15, 12, 41, 0.95);
                        }
                        .add-section { margin-bottom: 2rem; }
                        .add-row { display: flex; gap: 10px; alignItems: center; flex-wrap: wrap; }
                        .color-picker { display: flex; gap: 8px; margin: 10px 0; }
                        .color-dot {
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            cursor: pointer;
                            border: 2px solid transparent;
                            background: gray; /* fallback */
                        }
                        .color-dot.selected { border-color: white; transform: scale(1.2); }
                        
                        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; }
                        .category-tag {
                            background: rgba(255,255,255,0.1);
                            padding: 6px 12px;
                            border-radius: 20px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 0.9rem;
                        }
                        .del-btn {
                            background: none;
                            border: none;
                            color: #ff4b2b;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CategoryManager;
