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

// Botón de agregar curso
const AddCourseButton = styled.button`
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

// Modal para agregar/editar cursos
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

const Select = styled.select`
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

const CursosApp = () => {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ nombre: '', grado: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/cursos')
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch(() => toast.error('Error al cargar cursos'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/cursos/${editId}` : '/api/cursos';

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
          setCursos(cursos.map((curso) => (curso.curso_id === editId ? data : curso)));
          toast.success('Curso actualizado exitosamente');
        } else {
          setCursos([...cursos, data]);
          toast.success('Curso agregado exitosamente');
        }
        setShowModal(false);
        setForm({ nombre: '', grado: '' });
        setEditMode(false);
      })
      .catch(() => {
        toast.error('Error al crear o actualizar el curso');
      })
      .finally(() => setLoading(false));
  };

  const handleShowAddForm = () => {
    setForm({ nombre: '', grado: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (curso) => {
    setForm({ nombre: curso.nombre, grado: curso.grado });
    setEditId(curso.curso_id);
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
        fetch(`/api/cursos/${id}`, { method: 'DELETE' })
          .then(() => {
            setCursos(cursos.filter((curso) => curso.curso_id !== id));
            toast.success('Curso eliminado exitosamente');
            Swal.fire('Eliminado!', 'El curso ha sido eliminado.', 'success');
          })
          .catch(() => {
            toast.error('Error al eliminar curso');
          })
          .finally(() => setLoading(false));
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ nombre: '', grado: '' });
    setEditMode(false);
    setEditId(null);
  };

  const opcionesGrado = [
    { value: '1er Grado', label: '1er Grado' },
    { value: '2do Grado', label: '2do Grado' },
    { value: '3er Grado', label: '3er Grado' },
    { value: '4to Grado', label: '4to Grado' },
    { value: '5to Grado', label: '5to Grado' },
    { value: '6to Grado', label: '6to Grado' },
    { value: '7mo Grado', label: '7mo Grado' },
    { value: '8vo Grado', label: '8vo Grado' },
  ];

  return (
    <TableContainer>
      <h1>CRUD Cursos</h1>
      {loading && <div>Cargando...</div>}

      <AddCourseButton onClick={handleShowAddForm}>Agregar Curso</AddCourseButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Grado</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <TableRow key={curso.curso_id}>
              <TableCell>{curso.nombre}</TableCell>
              <TableCell>{curso.grado}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(curso)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(curso.curso_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Curso' : 'Agregar Curso'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nombre</Label>
              <Input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Grado</Label>
              <Select name="grado" value={form.grado} onChange={handleChange} required>
                <option value="">Selecciona un grado</option>
                {opcionesGrado.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Curso' : 'Agregar Curso'}
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
  const rootElement = document.getElementById('crud-curso');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<CursosApp />);
  } else {
    console.error("No se encontró el contenedor con id 'crud-curso'");
  }
};

export default CursosApp;
