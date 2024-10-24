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

// Botón de agregar nota
const AddNoteButton = styled.button`
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

// Modal para agregar/editar notas
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

const NotasApp = () => {
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [maestro, setMaestro] = useState(null);
  const [form, setForm] = useState({
    estudiante_id: '',
    curso_id: '',
    materia_id: '',
    maestro_id: '',
    nota: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.rol === 2) {
      setMaestro(userData);
      setForm(prevForm => ({
        ...prevForm,
        maestro_id: userData.user_id
      }));
    } else {
      window.location.href = '/login';
    }

    fetch('/api/notas')
      .then(response => response.json())
      .then(data => setNotas(data))
      .catch(() => toast.error('Error al cargar notas'));

    fetch('/api/estudiantes')
      .then(response => response.json())
      .then(data => setEstudiantes(data))
      .catch(() => toast.error('Error al cargar estudiantes'));

    fetch('/api/cursos')
      .then(response => response.json())
      .then(data => setCursos(data))
      .catch(() => toast.error('Error al cargar cursos'));

    fetch('/api/materias')
      .then(response => response.json())
      .then(data => setMaterias(data))
      .catch(() => toast.error('Error al cargar materias'));
  }, []);

  const getEstudianteNombre = (id) => {
    const estudiante = estudiantes.find(e => e.estudiante_id === id);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'Desconocido';
  };

  const getCursoNombre = (id) => {
    const curso = cursos.find(c => c.curso_id === id);
    return curso ? curso.nombre : 'Sin asignar';
  };

  const getMateriaNombre = (id) => {
    const materia = materias.find(m => m.materia_id === id);
    return materia ? materia.nombre : 'Desconocida';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => {
      let updatedValue = value;

      if (name === 'nota') {
        updatedValue = value === '' ? '' : Math.min(Math.max(parseFloat(value), 0), 10);
      }

      if (name === 'estudiante_id') {
        const selectedEstudiante = estudiantes.find(est => est.estudiante_id === parseInt(value));
        if (selectedEstudiante) {
          return { ...prevForm, estudiante_id: value, curso_id: selectedEstudiante.curso_id };
        }
      }

      return { ...prevForm, [name]: updatedValue };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.maestro_id) {
      toast.error('El campo Maestro es obligatorio');
      setLoading(false);
      return;
    }

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/notas/${editId}` : '/api/notas';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          if (text.startsWith('<!DOCTYPE html>')) {
            throw new Error('El servidor devolvió HTML. Posible redireccionamiento.');
          }
          throw new Error(text);
        }
        return response.json();
      })
      .then(data => {
        if (editMode) {
          setNotas(notas.map(nota => nota.nota_id === editId ? data : nota));
          toast.success('Nota actualizada exitosamente');
        } else {
          setNotas([...notas, data]);
          toast.success('Nota agregada exitosamente');
        }
        setShowModal(false);
        resetForm();
      })
      .catch(error => {
        console.error('Error al crear o actualizar la nota:', error);
        let errorMessage = "Error al crear o actualizar la nota";
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            errorMessage += ": " + Object.values(errorData.errors).flat().join(", ");
          }
        } catch { }
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({
      estudiante_id: '',
      curso_id: '',
      materia_id: '',
      maestro_id: maestro?.user_id || '',
      nota: '',
      fecha: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (nota) => {
    setForm({
      estudiante_id: nota.estudiante_id,
      curso_id: nota.curso_id,
      materia_id: nota.materia_id,
      maestro_id: nota.maestro_id,
      nota: String(nota.nota),
      fecha: nota.fecha,
      observaciones: nota.observaciones || ''
    });
    setEditId(nota.nota_id);
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
        fetch(`/api/notas/${id}`, { method: 'DELETE' })
          .then(() => {
            setNotas(notas.filter(nota => nota.nota_id !== id));
            toast.success('Nota eliminada exitosamente');
          })
          .catch(() => toast.error('Error al eliminar la nota'))
          .finally(() => setLoading(false));
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <TableContainer>
      <h1>CRUD Notas</h1>

      {loading && <div>Cargando...</div>}

      <AddNoteButton onClick={() => {
        setEditMode(false);
        setEditId(null);
        setShowModal(true);
        resetForm();
      }}>
        Agregar Nota
      </AddNoteButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Estudiante</TableHeader>
            <TableHeader>Curso</TableHeader>
            <TableHeader>Materia</TableHeader>
            <TableHeader>Maestro</TableHeader>
            <TableHeader>Nota</TableHeader>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <TableRow key={`nota-${nota.nota_id}`}>
              <TableCell>{nota.nota_id}</TableCell>
              <TableCell>{getEstudianteNombre(nota.estudiante_id)}</TableCell>
              <TableCell>{getCursoNombre(nota.curso_id)}</TableCell>
              <TableCell>{getMateriaNombre(nota.materia_id)}</TableCell>
              <TableCell>{nota.maestro_id}</TableCell>
              <TableCell>{String(nota.nota)}</TableCell>
              <TableCell>{String(nota.fecha)}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(nota)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(nota.nota_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Nota' : 'Agregar Nota'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Estudiante</Label>
              <Select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required>
                <option value="">Seleccione un estudiante</option>
                {estudiantes.map(estudiante => (
                  <option key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                    {estudiante.nombre} {estudiante.apellido}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Curso</Label>
              <Input type="text" name="curso_id" value={getCursoNombre(form.curso_id)} readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Materia</Label>
              <Select name="materia_id" value={form.materia_id} onChange={handleChange} required>
                <option value="">Seleccione una materia</option>
                {materias.map(materia => (
                  <option key={materia.materia_id} value={materia.materia_id}>
                    {materia.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Maestro ID</Label>
              <Input type="text" name="maestro_id" value={form.maestro_id} readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Nota</Label>
              <Input
                type="number"
                step="0.01"
                name="nota"
                value={form.nota || ''}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Fecha</Label>
              <Input type="date" name="fecha" value={form.fecha} readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Observaciones</Label>
              <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Nota' : 'Agregar Nota'}
            </SubmitButton>
          </form>
        </Modal>
      )}

      <ToastContainer />
    </TableContainer>
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
