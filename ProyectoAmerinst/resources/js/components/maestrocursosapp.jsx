import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MaestroCursosApp = () => {
    const [maestroCursos, setMaestroCursos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({ maestro_id: '', curso_id: '' });
    const [originalMaestroId, setOriginalMaestroId] = useState(null);
    const [originalCursoId, setOriginalCursoId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/maestro-cursos')
            .then(response => response.json())
            .then(data => setMaestroCursos(data))
            .catch(() => toast.error("Error al cargar maestro-cursos"));

        fetch('/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data.filter(user => user.rol_id === 2)))
            .catch(() => toast.error("Error al cargar usuarios"));

        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => setCursos(data))
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    const getUserName = (maestro_id) => {
        const user = usuarios.find(user => user.user_id === maestro_id);
        return user ? `${user.nombre} ${user.apellido}` : 'Desconocido';
    };

    const getCursoName = (curso_id) => {
        const curso = cursos.find(curso => curso.curso_id === curso_id);
        return curso ? `${curso.nombre} - ${curso.grado}` : 'Desconocido';
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode
            ? `/api/maestro-cursos/${originalMaestroId}/${originalCursoId}`
            : '/api/maestro-cursos';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(response => {
                if (response.status === 404) {
                    throw new Error("Relación Maestro-Curso no encontrada para actualizar");
                }
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json();
            })
            .then(data => {
                if (editMode) {
                    setMaestroCursos(maestroCursos.map(mc =>
                        mc.maestro_id === originalMaestroId && mc.curso_id === originalCursoId ? data : mc
                    ));
                    toast.success("Maestro-Curso actualizado exitosamente");
                } else {
                    setMaestroCursos([...maestroCursos, data]);
                    toast.success("Maestro-Curso agregado exitosamente");
                }
                handleCloseModal();
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                toast.error(error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleShowAddForm = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (maestroCurso) => {
        setForm({ maestro_id: maestroCurso.maestro_id, curso_id: maestroCurso.curso_id });
        setOriginalMaestroId(maestroCurso.maestro_id);
        setOriginalCursoId(maestroCurso.curso_id);
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
                    .catch(error => {
                        console.error("Error al eliminar maestro-curso:", error);
                        toast.error("Error al eliminar el maestro-curso");
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    const resetForm = () => {
        setForm({ maestro_id: '', curso_id: '' });
        setOriginalMaestroId(null);
        setOriginalCursoId(null);
        setEditMode(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    return (
        <div className="container my-4">

            <button className="btn btn-primary mb-3" onClick={handleShowAddForm}>
                Agregar Maestro-Curso
            </button>

            {loading && <div className="alert alert-info">Cargando...</div>}

            <table className="table table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Maestro</th>
                        <th>Curso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {maestroCursos.map(mc => (
                        <tr key={`${mc.maestro_id}-${mc.curso_id}`}>
                            <td>{getUserName(mc.maestro_id)}</td>
                            <td>{getCursoName(mc.curso_id)}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(mc)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mc.maestro_id, mc.curso_id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editMode ? 'Editar Maestro-Curso' : 'Agregar Maestro-Curso'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Maestro</label>
                                        <select
                                            name="maestro_id"
                                            className="form-select"
                                            value={form.maestro_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un Maestro</option>
                                            {usuarios.map(user => (
                                                <option key={user.user_id} value={user.user_id}>
                                                    {user.nombre} {user.apellido}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Curso</label>
                                        <select
                                            name="curso_id"
                                            className="form-select"
                                            value={form.curso_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un Curso</option>
                                            {cursos.map(curso => (
                                                <option key={curso.curso_id} value={curso.curso_id}>
                                                    {curso.nombre} - {curso.grado}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {editMode ? 'Actualizar Maestro-Curso' : 'Agregar Maestro-Curso'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

const root = document.getElementById('crud-maestro-cursos');
if (root) {
    ReactDOM.createRoot(root).render(<MaestroCursosApp />);
} else {
    console.error("No se encontró el contenedor con id 'crud-maestro-cursos'");
}

export default MaestroCursosApp;
