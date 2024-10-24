import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components'; // Importar styled-components

// Contenedor de la tabla
const TableContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

// Botón de agregar materia
const AddSubjectButton = styled.button`
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

// Botones de acción (Editar y Eliminar)
const ActionButton = styled.button`
  background-color: ${(props) => (props.variant === 'edit' ? '#4caf50' : '#d95b5e')};
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.variant === 'edit' ? '#45a049' : '#a22835'};
  }

  &:focus {
    outline: none;
  }
`;

// Modal para agregar/editar materias
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

const MateriasApp = () => {
  const [materias, setMaterias] = useState([]);
  const [form, setForm] = useState({ nombre: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/materias')
      .then((response) => response.json())
      .then((data) => setMaterias(data))
      .catch(() => toast.error('Error al cargar materias'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/materias/${editId}` : '/api/materias';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editMode) {
          setMaterias(materias.map((materia) => (materia.materia_id === editId ? data : materia)));
          toast.success('Materia actualizada exitosamente');
        } else {
          setMaterias([...materias, data]);
          toast.success('Materia agregada exitosamente');
        }
        setShowModal(false);
        setForm({ nombre: '' });
        setEditMode(false);
        setEditId(null);
      })
      .catch(() => {
        toast.error('Error al crear o actualizar la materia');
      })
      .finally(() => setLoading(false));
  };

  const handleShowAddForm = () => {
    setForm({ nombre: '' });
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (materia) => {
    setForm({ nombre: materia.nombre });
    setEditId(materia.materia_id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        fetch(`/api/materias/${id}`, { method: 'DELETE' })
          .then(() => {
            setMaterias(materias.filter((materia) => materia.materia_id !== id));
            toast.success('Materia eliminada exitosamente');
            Swal.fire('Eliminado!', 'La materia ha sido eliminada.', 'success');
          })
          .catch(() => {
            toast.error('Error al eliminar la materia');
          })
          .finally(() => setLoading(false));
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ nombre: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <TableContainer>
      <h1>CRUD Materias</h1>
      {loading && <div>Cargando...</div>}

      <AddSubjectButton onClick={handleShowAddForm}>Agregar Materia</AddSubjectButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {materias.map((materia) => (
            <TableRow key={materia.materia_id}>
              <TableCell>{materia.nombre}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(materia)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(materia.materia_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Materia' : 'Agregar Materia'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nombre</Label>
              <Input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Materia' : 'Agregar Materia'}
            </SubmitButton>
          </form>
        </Modal>
      )}

      <ToastContainer />
    </TableContainer>
  );
};

// Montaje manual para pruebas
window.onload = () => {
  const rootElement = document.getElementById('crud-materia');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<MateriasApp />);
  } else {
    console.error("No se encontró el contenedor con id 'crud-materia'");
  }
};

export default MateriasApp;
