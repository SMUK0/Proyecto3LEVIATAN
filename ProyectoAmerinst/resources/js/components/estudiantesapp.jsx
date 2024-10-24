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

// Botón de agregar estudiante
const AddStudentButton = styled.button`
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

// Modal para agregar/editar estudiantes
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

const EstudiantesApp = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    curso_id: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Cargar estudiantes
    fetch('/api/estudiantes')
      .then((response) => response.json())
      .then((data) => setEstudiantes(data))
      .catch(() => toast.error('Error al cargar estudiantes'));

    // Cargar cursos
    fetch('/api/cursos')
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch(() => toast.error('Error al cargar cursos'));
  }, []);

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
      toast.error('La edad debe estar entre 12 y 20 años.');
      return;
    }

    setLoading(true);

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/estudiantes/${editId}` : '/api/estudiantes';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then((response) => response.json())
      .then((data) => {
        if (editMode) {
          setEstudiantes(estudiantes.map((est) => (est.estudiante_id === editId ? data : est)));
          toast.success('Estudiante actualizado exitosamente');
        } else {
          setEstudiantes([...estudiantes, data]);
          toast.success('Estudiante agregado exitosamente');
        }
        handleCloseModal();
      })
      .catch(() => toast.error('Error al crear o actualizar el estudiante'))
      .finally(() => setLoading(false));
  };

  const handleEdit = (estudiante) => {
    setForm({
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      fecha_nacimiento: estudiante.fecha_nacimiento,
      curso_id: estudiante.curso_id
    });
    setEditId(estudiante.estudiante_id);
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
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        fetch(`/api/estudiantes/${id}`, { method: 'DELETE' })
          .then(() => {
            setEstudiantes(estudiantes.filter((est) => est.estudiante_id !== id));
            toast.success('Estudiante eliminado exitosamente');
          })
          .catch(() => toast.error('Error al eliminar estudiante'))
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

  const getNombreGrado = (cursoId) => {
    const curso = cursos.find((curso) => curso.curso_id === cursoId);
    return curso ? curso.nombre : 'Sin asignar';
  };

  return (
    <TableContainer>
      <h1>CRUD Estudiantes</h1>
      {loading && <div>Cargando...</div>}

      <AddStudentButton onClick={() => {
        setShowModal(true);
        setEditMode(false);
        setForm({ nombre: '', apellido: '', fecha_nacimiento: '', curso_id: '' });
      }}>Agregar Estudiante</AddStudentButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Nombre Completo</TableHeader>
            <TableHeader>Edad</TableHeader>
            <TableHeader>Curso</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est) => (
            <TableRow key={est.estudiante_id}>
              <TableCell>{`${est.nombre} ${est.apellido}`}</TableCell>
              <TableCell>{calculateAge(est.fecha_nacimiento)} años</TableCell>
              <TableCell>{getNombreGrado(est.curso_id)}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(est)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(est.estudiante_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Estudiante' : 'Agregar Estudiante'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nombre</Label>
              <Input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Apellido</Label>
              <Input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Fecha Nacimiento</Label>
              <Input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Grado</Label>
              <Select name="curso_id" value={form.curso_id} onChange={handleChange} required>
                <option value="">Selecciona un grado</option>
                {cursos.map((curso) => (
                  <option key={curso.curso_id} value={curso.curso_id}>
                    {curso.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
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
  const rootElement = document.getElementById('crud-estudiante');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<EstudiantesApp />);
  } else {
    console.error("No se encontró el contenedor con id 'crud-estudiante'");
  }
};

export default EstudiantesApp;
