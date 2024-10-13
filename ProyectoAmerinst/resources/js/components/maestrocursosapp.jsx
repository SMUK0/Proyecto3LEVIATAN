import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
    const [maestroCursos, setMaestroCursos] = useState([]);
    const [form, setForm] = useState({
        maestro_id: '',
        curso_id: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/maestro-cursos')
            .then(response => response.json())
            .then(data => setMaestroCursos(data))
            .catch(() => toast.error("Error al cargar maestro-cursos"));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/maestro-cursos/${form.maestro_id}/${form.curso_id}` : '/api/maestro-cursos';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        .then(response => response.json())
        .then(data => {
            if (editMode) {
                setMaestroCursos(maestroCursos.map(mc => mc.maestro_id === form.maestro_id && mc.curso_id === form.curso_id ? data : mc));
                toast.success("Maestro-Curso actualizado exitosamente");
            } else {
                setMaestroCursos([...maestroCursos, data]);
                toast.success("Maestro-Curso agregado exitosamente");
            }
            setShowModal(false);
            setForm({ maestro_id: '', curso_id: '' });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar el maestro-curso"))
        .finally(() => setLoading(false));
    };

    const handleEdit = (maestroCurso) => {
        setForm({
            maestro_id: maestroCurso.maestro_id,
            curso_id: maestroCurso.curso_id
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (maestro_id, curso_id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                fetch(`/api/maestro-cursos/${maestro_id}/${curso_id}`, { method: 'DELETE' })
                .then(() => {
                    setMaestroCursos(maestroCursos.filter(mc => mc.maestro_id !== maestro_id || mc.curso_id !== curso_id));
                    toast.success("Maestro-Curso eliminado exitosamente");
                    Swal.fire('Eliminado!', 'El maestro-curso ha sido eliminado.', 'success');
                })
                .catch(() => toast.error("Error al eliminar el maestro-curso"))
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ maestro_id: '', curso_id: '' });
        setEditMode(false);
    };

    return (
        <div>
            <h1>CRUD Maestro Cursos</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Maestro-Curso</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Maestro ID</th>
                        <th>Curso ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {maestroCursos.map(mc => (
                        <tr key={`${mc.maestro_id}-${mc.curso_id}`}>
                            <td>{mc.maestro_id}</td>
                            <td>{mc.curso_id}</td>
                            <td>
                                <button onClick={() => handleEdit(mc)}>Editar</button>
                                <button onClick={() => handleDelete(mc.maestro_id, mc.curso_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Maestro-Curso' : 'Agregar Maestro-Curso'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Maestro ID</label>
                                    <input type="number" name="maestro_id" value={form.maestro_id} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Curso ID</label>
                                    <input type="number" name="curso_id" value={form.curso_id} onChange={handleChange} required />
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Maestro-Curso' : 'Agregar Maestro-Curso'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('crud-maestro-cursos')).render(<App />);
