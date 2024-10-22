import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

const EstudiantesApp = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]); // Cursos para llenar el select de grados
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        curso_id: ''  // Almacena el curso_id en lugar del nombre del grado
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Cargar estudiantes
        fetch('/api/estudiantes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar estudiantes');
                }
                return response.json();
            })
            .then(data => {
                console.log('Estudiantes cargados:', data);  // Verifica los datos de estudiantes cargados
                setEstudiantes(data);
            })
            .catch(() => toast.error("Error al cargar estudiantes"));

        // Cargar cursos (grados)
        fetch('/api/cursos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar cursos');
                }
                return response.json();
            })
            .then(data => {
                console.log('Cursos cargados:', data);  // Verifica los datos de cursos cargados
                setCursos(data);
            })
            .catch(() => toast.error("Error al cargar cursos"));
    }, []);

    // Calcular la edad desde la fecha de nacimiento
    const calculateAge = (fecha_nacimiento) => {
        const birthDate = new Date(fecha_nacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const isValidAge = (fecha_nacimiento) => {
        const age = calculateAge(fecha_nacimiento);
        return age >= 12 && age <= 20;
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidAge(form.fecha_nacimiento)) {
            toast.error("La edad debe estar entre 12 y 20 años.");
            return;
        }

        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/estudiantes/${editId}` : '/api/estudiantes';

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
                setEstudiantes(estudiantes.map(est => est.estudiante_id === editId ? data : est));
                toast.success("Estudiante actualizado exitosamente");
            } else {
                setEstudiantes([...estudiantes, data]);
                toast.success("Estudiante agregado exitosamente");
            }
            handleCloseModal(); // Cerrar el modal después de guardar
        })
        .catch(() => toast.error("Error al crear o actualizar el estudiante"))
        .finally(() => setLoading(false));
    };

    const handleEdit = (estudiante) => {
        setForm({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fecha_nacimiento: estudiante.fecha_nacimiento,
            curso_id: estudiante.curso_id  // Almacenar el curso_id en el formulario
        });
        setEditId(estudiante.estudiante_id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
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
                fetch(`/api/estudiantes/${id}`, { method: 'DELETE' })
                .then(() => {
                    setEstudiantes(estudiantes.filter(est => est.estudiante_id !== id));
                    toast.success("Estudiante eliminado exitosamente");
                })
                .catch(() => toast.error("Error al eliminar estudiante"))
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ nombre: '', apellido: '', fecha_nacimiento: '', curso_id: '' });
        setEditMode(false);
        setEditId(null);
    };

    // Función para obtener el nombre del curso basado en el curso_id
    const getNombreGrado = (cursoId) => {
        if (!cursos || cursos.length === 0) {
            console.warn('La lista de cursos está vacía o no se ha cargado correctamente');
            return 'Sin asignar';
        }

        const curso = cursos.find(curso => curso.curso_id === cursoId);
        if (!curso) {
            console.warn(`No se encontró un curso con curso_id: ${cursoId}`); // Log para verificar si el curso existe
        }
        return curso ? curso.nombre : 'Sin asignar';
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}

            <div>
                <button onClick={() => {
                    setShowModal(true);
                    setEditMode(false);
                    setForm({ nombre: '', apellido: '', fecha_nacimiento: '', curso_id: '' });
                }}>Agregar Estudiante</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Curso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.estudiante_id}>
                            <td>{`${est.nombre} ${est.apellido}`}</td>
                            <td>{calculateAge(est.fecha_nacimiento)} años</td>
                            <td>{getNombreGrado(est.curso_id)}</td>
                            <td>
                                <button onClick={() => handleEdit(est)}>Editar</button>
                                <button onClick={() => handleDelete(est.estudiante_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div>
                    <div>
                        <div>
                            <h5>{editMode ? 'Editar Estudiante' : 'Agregar Estudiante'}</h5>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Apellido</label>
                                    <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Fecha Nacimiento</label>
                                    <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Grado</label>
                                    <select name="curso_id" value={form.curso_id} onChange={handleChange} required>
                                        <option value="">Selecciona un grado</option>
                                        {cursos.map(curso => (
                                            <option key={curso.curso_id} value={curso.curso_id}>
                                                {curso.grado}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" disabled={loading}>
                                    {editMode ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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

// Montaje manual para pruebas
window.onload = () => {
    const rootElement = document.getElementById('crud-estudiante');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<EstudiantesApp />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-estudiante'");
    }
};

export default EstudiantesApp;
