import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const NotasApp = () => {
    const [notas, setNotas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [maestro, setMaestro] = useState(null); // Aquí almacenamos la info del maestro logueado
    const [form, setForm] = useState({
        estudiante_id: '',
        curso_id: '',
        materia_id: '',
        maestro_id: '',
        nota: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        observaciones: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener datos del usuario logueado y cargar los datos de la base de datos
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol === 2) {
            console.log('Datos del usuario logueado:', userData);
            setMaestro(userData); // Guardamos los datos del maestro logueado
            setForm(prevForm => ({
                ...prevForm,
                maestro_id: userData.maestro_id // Asumimos que maestro_id está en los datos del usuario
            }));
        } else {
            console.log('Usuario no autorizado, redirigiendo al login');
            window.location.href = '/login'; // Redirigir si no es maestro
        }

        fetch('/api/notas')
            .then(response => response.json())
            .then(data => {
                console.log('Datos de notas:', data);
                setNotas(data);
            })
            .catch((error) => {
                console.log('Error al cargar notas:', error);
                toast.error('Error al cargar notas');
            });

        fetch('/api/estudiantes')
            .then(response => response.json())
            .then(data => {
                console.log('Datos de estudiantes:', data);
                setEstudiantes(data);
            })
            .catch((error) => {
                console.log('Error al cargar estudiantes:', error);
                toast.error('Error al cargar estudiantes');
            });

        fetch('/api/cursos')
            .then(response => response.json())
            .then(data => {
                console.log('Datos de cursos:', data);
                setCursos(data);
            })
            .catch((error) => {
                console.log('Error al cargar cursos:', error);
                toast.error('Error al cargar cursos');
            });

        fetch('/api/materias')
            .then(response => response.json())
            .then(data => {
                console.log('Datos de materias:', data);
                setMaterias(data);
            })
            .catch((error) => {
                console.log('Error al cargar materias:', error);
                toast.error('Error al cargar materias');
            });
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
        console.log('Enviando datos del formulario:', form);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/notas/${editId}` : '/api/notas';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        .then(response => {
            console.log('Respuesta del servidor:', response);
            return response.json();
        })
        .then(data => {
            console.log('Respuesta procesada del servidor:', data);
            if (editMode) {
                setNotas(notas.map(nota => nota.nota_id === editId ? data : nota));
                toast.success('Nota actualizada exitosamente');
            } else {
                setNotas([...notas, data]);
                toast.success('Nota agregada exitosamente');
            }
            setShowModal(false);
            setForm({ estudiante_id: '', curso_id: '', materia_id: '', maestro_id: '', nota: '', fecha: new Date().toISOString().split('T')[0], observaciones: '' });
            setEditMode(false);
        })
        .catch((error) => {
            console.log('Error al crear o actualizar la nota:', error);
            toast.error('Error al crear o actualizar la nota');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleEdit = (nota) => {
        console.log('Editando nota:', nota);
        setForm({
            estudiante_id: nota.estudiante_id,
            curso_id: nota.curso_id,
            materia_id: nota.materia_id,
            maestro_id: nota.maestro_id,
            nota: nota.nota,
            fecha: nota.fecha,
            observaciones: nota.observaciones || ''
        });
        setEditId(nota.nota_id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        console.log('Eliminando nota con ID:', id);
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
                fetch(`/api/notas/${id}`, { method: 'DELETE' })
                .then(() => {
                    setNotas(notas.filter(nota => nota.nota_id !== id));
                    toast.success('Nota eliminada exitosamente');
                    Swal.fire('Eliminado!', 'La nota ha sido eliminada.', 'success');
                })
                .catch((error) => {
                    console.log('Error al eliminar la nota:', error);
                    toast.error('Error al eliminar la nota');
                })
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ estudiante_id: '', curso_id: '', materia_id: '', maestro_id: '', nota: '', fecha: new Date().toISOString().split('T')[0], observaciones: '' });
        setEditMode(false);
    };

    return (
        <div>
            <h1>CRUD Notas</h1>

            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => setShowModal(true)}>Agregar Nota</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Materia</th>
                        <th>Maestro</th>
                        <th>Nota</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {notas.map(nota => (
                        <tr key={nota.nota_id}>
                            <td>{nota.nota_id}</td>
                            <td>{nota.estudiante_id}</td>
                            <td>{nota.curso_id}</td>
                            <td>{nota.materia_id}</td>
                            <td>{nota.maestro_id}</td>
                            <td>{nota.nota}</td>
                            <td>{nota.fecha}</td>
                            <td>
                                <button onClick={() => handleEdit(nota)}>Editar</button>
                                <button onClick={() => handleDelete(nota.nota_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Nota' : 'Agregar Nota'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Estudiante</label>
                                    <select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required>
                                        <option value="">Seleccione un estudiante</option>
                                        {estudiantes.map(estudiante => (
                                            <option key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                                                {estudiante.nombre} {estudiante.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Curso</label>
                                    <select name="curso_id" value={form.curso_id} onChange={handleChange} required>
                                        <option value="">Seleccione un curso</option>
                                        {cursos.map(curso => (
                                            <option key={curso.curso_id} value={curso.curso_id}>
                                                {curso.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Materia</label>
                                    <select name="materia_id" value={form.materia_id} onChange={handleChange} required>
                                        <option value="">Seleccione una materia</option>
                                        {materias.map(materia => (
                                            <option key={materia.materia_id} value={materia.materia_id}>
                                                {materia.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Maestro</label>
                                    <input type="text" name="maestro" value={`${maestro?.nombre} ${maestro?.apellido}`} readOnly />
                                </div>
                                <div>
                                    <label>Nota</label>
                                    <input type="number" step="0.01" name="nota" value={form.nota} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Fecha</label>
                                    <input type="date" name="fecha" value={form.fecha} readOnly />
                                </div>
                                <div>
                                    <label>Observaciones</label>
                                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
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

// Montaje manual para pruebas del componente NotasApp
window.onload = () => {
    const rootElement = document.getElementById('crud-notas');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<NotasApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-notas'");
    }
};

export default NotasApp;
