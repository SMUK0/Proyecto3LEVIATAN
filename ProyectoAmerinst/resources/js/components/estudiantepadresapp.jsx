import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const App = () => {
    const [relaciones, setRelaciones] = useState([]);
    const [form, setForm] = useState({ estudiante_id: '', padre_id: '' });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    // Cargar las relaciones desde el API al montar el componente
    useEffect(() => {
        fetch('/api/estudiante-padres')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRelaciones(data);
                } else {
                    Swal.fire('Error', 'Datos inválidos recibidos', 'error');
                }
            })
            .catch(() => Swal.fire('Error', 'Error al cargar relaciones', 'error'));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = 'POST';
        const url = '/api/estudiante-padres';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        .then(response => response.json())
        .then(data => {
            setRelaciones([...relaciones, data]);
            Swal.fire('Creado', 'Relación creada exitosamente', 'success');
            setForm({ estudiante_id: '', padre_id: '' });
            setModalVisible(false); // Cerrar el modal después de agregar
        })
        .catch((err) => {
            console.error('Error al crear relación:', err);
            Swal.fire('Error', 'Error al crear relación', 'error');
        })
        .finally(() => setLoading(false));
    };

    const handleDelete = (estudiante_id, padre_id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no puede deshacerse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/estudiante-padres/${estudiante_id}/${padre_id}`, { method: 'DELETE' })
                    .then(() => {
                        setRelaciones(relaciones.filter(relacion => 
                            !(relacion.estudiante_id === estudiante_id && relacion.padre_id === padre_id)
                        ));
                        Swal.fire('Eliminado', 'Relación eliminada exitosamente', 'success');
                    })
                    .catch(() => Swal.fire('Error', 'Error al eliminar relación', 'error'));
            }
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">CRUD Estudiante-Padres</h1>

            {/* Botón para abrir el modal */}
            <button 
                className="btn btn-success mb-4" 
                onClick={() => setModalVisible(true)} // Mostrar modal
            >
                Agregar Nueva Relación
            </button>

            {/* Tabla con las relaciones */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Estudiante ID</th>
                            <th>Padre ID</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relaciones.map((relacion) => (
                            <tr key={`${relacion.estudiante_id}-${relacion.padre_id}`}>
                                <td>{relacion.estudiante_id}</td>
                                <td>{relacion.padre_id}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(relacion.estudiante_id, relacion.padre_id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para agregar nueva relación */}
            {modalVisible && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar Relación</h5>
                                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Estudiante ID</label>
                                        <input 
                                            type="text" 
                                            name="estudiante_id" 
                                            value={form.estudiante_id} 
                                            onChange={handleChange} 
                                            className="form-control" 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Padre ID</label>
                                        <input 
                                            type="text" 
                                            name="padre_id" 
                                            value={form.padre_id} 
                                            onChange={handleChange} 
                                            className="form-control" 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Guardando...' : 'Agregar'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Fondo oscuro para modal */}
            {modalVisible && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

// Usar createRoot en lugar de ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('crud-estudiante-padre'));
root.render(<App />);
