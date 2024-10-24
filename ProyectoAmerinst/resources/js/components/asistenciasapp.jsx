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

// Botón de agregar asistencia
const AddAttendanceButton = styled.button`
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

// Modal para agregar/editar asistencia
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

const AsistenciasApp = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    estudiante_id: '',
    curso_id: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Presente',
    observaciones: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/asistencias')
      .then((response) => response.json())
      .then((data) => setAsistencias(data))
      .catch(() => toast.error("Error al cargar asistencias"));

    fetch('/api/estudiantes')
      .then((response) => response.json())
      .then((data) => setEstudiantes(data))
      .catch(() => toast.error("Error al cargar estudiantes"));

    fetch('/api/cursos')
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch(() => toast.error("Error al cargar cursos"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "estudiante_id") {
      const estudianteSeleccionado = estudiantes.find(est => est.estudiante_id === parseInt(value));
      if (estudianteSeleccionado) {
        setForm({
          ...form,
          [name]: value,
          curso_id: estudianteSeleccionado.curso_id
        });
      } else {
        setForm({ ...form, [name]: value, curso_id: '' });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/asistencias/${editId}` : '/api/asistencias';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form)
    })
    .then((response) => response.json())
    .then((data) => {
      if (editMode) {
        setAsistencias(asistencias.map(asistencia => asistencia.asistencia_id === editId ? data : asistencia));
        toast.success("Asistencia actualizada exitosamente");
      } else {
        setAsistencias([...asistencias, data]);
        toast.success("Asistencia agregada exitosamente");
      }
      handleCloseModal();
    })
    .catch(() => toast.error("Error al crear o actualizar la asistencia"))
    .finally(() => setLoading(false));
  };

  const handleEdit = (asistencia) => {
    setForm({
      estudiante_id: asistencia.estudiante_id,
      curso_id: asistencia.curso_id,
      fecha: asistencia.fecha,
      estado: asistencia.estado,
      observaciones: asistencia.observaciones || ''
    });
    setEditId(asistencia.asistencia_id);
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
        fetch(`/api/asistencias/${id}`, { method: 'DELETE' })
          .then(() => {
            setAsistencias(asistencias.filter(asistencia => asistencia.asistencia_id !== id));
            toast.success("Asistencia eliminada exitosamente");
          })
          .catch(() => toast.error("Error al eliminar asistencia"))
          .finally(() => setLoading(false));
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'Presente', observaciones: '' });
    setEditMode(false);
  };

  const getEstudianteNombre = (id) => {
    const estudiante = estudiantes.find(e => e.estudiante_id === id);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'Desconocido';
  };

  const getCursoNombre = (id) => {
    const curso = cursos.find(c => c.curso_id === id);
    return curso ? curso.nombre : 'Sin asignar';
  };

  return (
    <TableContainer>
       <h1>CRUD Asistencias</h1>
      {loading && <div>Cargando...</div>}

      <AddAttendanceButton onClick={() => {
        setShowModal(true);
        setEditMode(false);
        setForm({ estudiante_id: '', curso_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'Presente', observaciones: '' });
      }}>Agregar Asistencia</AddAttendanceButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Estudiante</TableHeader>
            <TableHeader>Curso</TableHeader>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {asistencias.map(asistencia => (
            <TableRow key={asistencia.asistencia_id}>
              <TableCell>{asistencia.asistencia_id}</TableCell>
              <TableCell>{getEstudianteNombre(asistencia.estudiante_id)}</TableCell>
              <TableCell>{getCursoNombre(asistencia.curso_id)}</TableCell>
              <TableCell>{asistencia.fecha}</TableCell>
              <TableCell>{asistencia.estado}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(asistencia)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(asistencia.asistencia_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Asistencia' : 'Agregar Asistencia'}</ModalTitle>
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
              <Input
                type="text"
                name="curso"
                value={getCursoNombre(form.curso_id)}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label>Fecha</Label>
              <Input type="date" name="fecha" value={form.fecha} readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <Select name="estado" value={form.estado} onChange={handleChange} required>
                <option value="Presente">Presente</option>
                <option value="Ausente">Ausente</option>
                <option value="Tarde">Tarde</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Observaciones</Label>
              <textarea name="observaciones" value={form.observaciones} onChange={handleChange}></textarea>
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Asistencia' : 'Agregar Asistencia'}
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
  const rootElement = document.getElementById('crud-asistencias');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<AsistenciasApp />);
  } else {
    console.error("No se encontró el contenedor con id 'crud-asistencias'");
  }
};

export default AsistenciasApp;
