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

// Botón de agregar notificación
const AddNotificationButton = styled.button`
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

// Modal para agregar/editar notificaciones
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  resize: none;
`;

const CheckBoxLabel = styled.label`
  margin-left: 5px;
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
  const [notificaciones, setNotificaciones] = useState([]);
  const [form, setForm] = useState({
    usuario_id: '',
    estudiante_id: '',
    mensaje: '',
    leido: false
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Cargar todas las notificaciones al iniciar
  useEffect(() => {
    setLoading(true);
    fetch('/api/notificaciones')
      .then(response => response.json())
      .then(data => {
        setNotificaciones(data);
        console.log("Notificaciones cargadas desde la API:", data);
      })
      .catch(() => toast.error("Error al cargar notificaciones"))
      .finally(() => setLoading(false));
  }, []);

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
    console.log(`Campo actualizado: ${name}, Valor: ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Datos del formulario que se enviarán:", form);

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/notificaciones/${editId}` : '/api/notificaciones';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          ...form,
          usuario_id: parseInt(form.usuario_id, 10),
          estudiante_id: parseInt(form.estudiante_id, 10),
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', responseData);
        throw new Error(responseData.message || 'Error en la solicitud al servidor');
      }

      if (editMode) {
        setNotificaciones(notificaciones.map(notif => notif.notificacion_id === editId ? responseData : notif));
        toast.success("Notificación actualizada exitosamente");
      } else {
        setNotificaciones([...notificaciones, responseData]);
        toast.success("Notificación agregada exitosamente");
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al crear o actualizar la notificación:', error);
      toast.error(`Error al crear o actualizar la notificación: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notificacion) => {
    setForm({
      usuario_id: String(notificacion.usuario_id),
      estudiante_id: String(notificacion.estudiante_id),
      mensaje: notificacion.mensaje,
      leido: notificacion.leido
    });
    setEditId(notificacion.notificacion_id);
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
        fetch(`/api/notificaciones/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': getCsrfToken() } })
          .then(() => {
            setNotificaciones(notificaciones.filter(notif => notif.notificacion_id !== id));
            toast.success("Notificación eliminada exitosamente");
            Swal.fire('Eliminado!', 'La notificación ha sido eliminada.', 'success');
          })
          .catch(() => toast.error("Error al eliminar la notificación"))
          .finally(() => setLoading(false));
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ usuario_id: '', estudiante_id: '', mensaje: '', leido: false });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <TableContainer>
      <h1>CRUD Notificaciones</h1>

      {loading && <div>Cargando...</div>}

      <AddNotificationButton onClick={() => setShowModal(true)}>Agregar Notificación</AddNotificationButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Usuario ID</TableHeader>
            <TableHeader>Estudiante ID</TableHeader>
            <TableHeader>Mensaje</TableHeader>
            <TableHeader>Leído</TableHeader>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map(notif => (
            <TableRow key={`notif-${notif.notificacion_id}`}>
              <TableCell>{notif.notificacion_id}</TableCell>
              <TableCell>{notif.usuario_id}</TableCell>
              <TableCell>{notif.estudiante_id}</TableCell>
              <TableCell>{notif.mensaje}</TableCell>
              <TableCell>{notif.leido ? 'Sí' : 'No'}</TableCell>
              <TableCell>{notif.fecha}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(notif)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(notif.notificacion_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Notificación' : 'Agregar Notificación'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Usuario ID</Label>
              <Input
                type="number"
                name="usuario_id"
                value={form.usuario_id}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Estudiante ID</Label>
              <Input
                type="number"
                name="estudiante_id"
                value={form.estudiante_id}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Mensaje</Label>
              <TextArea name="mensaje" value={form.mensaje} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <input type="checkbox" name="leido" checked={form.leido} onChange={handleChange} />
              <CheckBoxLabel>Leído</CheckBoxLabel>
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Notificación' : 'Agregar Notificación'}
            </SubmitButton>
          </form>
        </Modal>
      )}

      <ToastContainer />
    </TableContainer>
  );
};

// Montaje manual del componente
window.onload = () => {
  const rootElement = document.getElementById('crud-notificaciones');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
  } else {
    console.error("No se encontró el contenedor con id 'crud-notificaciones'");
  }
};

export default App;
