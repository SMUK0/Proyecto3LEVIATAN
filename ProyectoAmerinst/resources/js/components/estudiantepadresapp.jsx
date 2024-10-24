import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import styled from 'styled-components';

// Estilos para el contenedor principal
const Container = styled.div`
    padding: 20px;
    background-color: #f4f4f9;
    min-height: 100vh;
`;

// Estilos para la tabla
const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #870e20;
        color: white;
    }
`;

// Estilos para los botones de acción
const ActionButton = styled.button`
    background-color: ${({ actionType }) => actionType === 'edit' ? '#007bff' : '#dc3545'};
    color: white;
    border: none;
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${({ actionType }) => actionType === 'edit' ? '#0056b3' : '#c82333'};
    }
`;

// Estilos para el modal y el formulario
const FormContainer = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    margin: 20px auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-top: 10px;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const SubmitButton = styled.button`
    background-color: #870e20;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
    cursor: pointer;

    &:hover {
        background-color: #a22835;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const App = () => {
    const [relaciones, setRelaciones] = useState([]);
    const [form, setForm] = useState({ estudiante_id: '', padre_id: '' });
    const [editMode, setEditMode] = useState(false);
    const [editIds, setEditIds] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/estudiante-padre')
            .then(response => response.json())
            .then(data => setRelaciones(data))
            .catch(() => Swal.fire('Error', 'Error al cargar relaciones', 'error'));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/estudiante-padre/${editIds.estudiante_id}/${editIds.padre_id}` : '/api/estudiante-padre';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                if (editMode) {
                    setRelaciones(relaciones.map(relacion =>
                        (relacion.estudiante_id === editIds.estudiante_id && relacion.padre_id === editIds.padre_id) ? data : relacion
                    ));
                    Swal.fire('Actualizado', 'Relación actualizada exitosamente', 'success');
                } else {
                    setRelaciones([...relaciones, data]);
                    Swal.fire('Creado', 'Relación creada exitosamente', 'success');
                }
                setForm({ estudiante_id: '', padre_id: '' });
                setEditMode(false);
            })
            .catch(() => Swal.fire('Error', 'Error al crear o actualizar relación', 'error'))
            .finally(() => setLoading(false));
    };

    const handleEdit = (relacion) => {
        setForm({ estudiante_id: relacion.estudiante_id, padre_id: relacion.padre_id });
        setEditIds({ estudiante_id: relacion.estudiante_id, padre_id: relacion.padre_id });
        setEditMode(true);
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
                fetch(`/api/estudiante-padre/${estudiante_id}/${padre_id}`, { method: 'DELETE' })
                    .then(() => {
                        setRelaciones(relaciones.filter(relacion => !(relacion.estudiante_id === estudiante_id && relacion.padre_id === padre_id)));
                        Swal.fire('Eliminado', 'Relación eliminada exitosamente', 'success');
                    })
                    .catch(() => Swal.fire('Error', 'Error al eliminar relación', 'error'));
            }
        });
    };

    return (
        <Container>
            <h1>CRUD Estudiante-Padres</h1>

            <div>
                <button onClick={() => setEditMode(false)}>Agregar Relación</button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Estudiante ID</th>
                        <th>Padre ID</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {relaciones.map(relacion => (
                        <tr key={`${relacion.estudiante_id}-${relacion.padre_id}`}>
                            <td>{relacion.estudiante_id}</td>
                            <td>{relacion.padre_id}</td>
                            <td>
                                <ActionButton actionType="edit" onClick={() => handleEdit(relacion)}>Editar</ActionButton>
                                <ActionButton actionType="delete" onClick={() => handleDelete(relacion.estudiante_id, relacion.padre_id)}>Eliminar</ActionButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {editMode && (
                <FormContainer>
                    <h5>{editMode ? 'Editar Relación' : 'Agregar Relación'}</h5>
                    <Form onSubmit={handleSubmit}>
                        <div>
                            <Label>Estudiante ID</Label>
                            <Input type="text" name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Padre ID</Label>
                            <Input type="text" name="padre_id" value={form.padre_id} onChange={handleChange} required />
                        </div>
                        <SubmitButton type="submit" disabled={loading}>
                            {editMode ? 'Actualizar' : 'Agregar'}
                        </SubmitButton>
                    </Form>
                </FormContainer>
            )}
        </Container>
    );
};

ReactDOM.createRoot(document.getElementById('crud-estudiante-padre')).render(<App />);
