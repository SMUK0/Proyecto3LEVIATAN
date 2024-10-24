import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';

// Contenedor de la tabla
const TableContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

// Botón de agregar relación
const AddButton = styled.button`
  background-color: #870e20;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #a22835;
  }

  &:focus {
    outline: none;
  }
`;

// Estilo de la tabla
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  background-color: #f4f4f9;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: #870e20;
  color: white;
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
`;

// Modal para agregar/editar relación
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h5`
  font-size: 20px;
  color: #870e20;
`;

const CloseButton = styled.button`
  background-color: transparent;
  color: #870e20;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #a22835;
  }

  &:focus {
    outline: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #870e20;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

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
            method: method,
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
        <TableContainer>
            <h1>CRUD Estudiante-Padres</h1>

            <AddButton onClick={() => setEditMode(false)}>Agregar Relación</AddButton>

            <StyledTable>
                <thead>
                    <tr>
                        <TableHeader>Estudiante ID</TableHeader>
                        <TableHeader>Padre ID</TableHeader>
                        <TableHeader>Acciones</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {relaciones.map(relacion => (
                        <TableRow key={`${relacion.estudiante_id}-${relacion.padre_id}`}>
                            <TableCell>{relacion.estudiante_id}</TableCell>
                            <TableCell>{relacion.padre_id}</TableCell>
                            <TableCell>
                                <ActionButton variant="edit" onClick={() => handleEdit(relacion)}>Editar</ActionButton>
                                <ActionButton variant="delete" onClick={() => handleDelete(relacion.estudiante_id, relacion.padre_id)}>Eliminar</ActionButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </StyledTable>

            {editMode && (
                <Modal>
                    <ModalHeader>
                        <ModalTitle>{editMode ? 'Editar Relación' : 'Agregar Relación'}</ModalTitle>
                        <CloseButton onClick={() => setEditMode(false)}>&times;</CloseButton>
                    </ModalHeader>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Estudiante ID</Label>
                            <Input type="text" name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Padre ID</Label>
                            <Input type="text" name="padre_id" value={form.padre_id} onChange={handleChange} required />
                        </FormGroup>
                        <SubmitButton type="submit">{editMode ? 'Actualizar' : 'Agregar'}</SubmitButton>
                    </form>
                </Modal>
            )}
        </TableContainer>
    );
};

// Montaje manual para pruebas
ReactDOM.createRoot(document.getElementById('crud-estudiante-padre')).render(<App />);
