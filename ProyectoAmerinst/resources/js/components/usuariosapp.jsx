import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import styled from 'styled-components'; // Importar styled-components

// Contenedor de la tabla
const TableContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

// Botón de agregar usuario
const AddUserButton = styled.button`
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

// Modal para agregar/editar usuarios
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

const UsuariosApp = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: ''
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Cargar usuarios
    fetch('/api/usuarios')
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch(() => toast.error('Error al cargar usuarios'));

    // Cargar roles desde la API
    fetch('/api/roles')
      .then((response) => response.json())
      .then((data) => {
        console.log('Roles:', data);
        setRoles(data);
      })
      .catch(() => toast.error('Error al cargar roles'));
  }, []);

  const obtenerNombreRol = (rol_id) => {
    const rol = roles.find((r) => r.rol_id === rol_id);
    return rol ? rol.nombre : 'Sin rol';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!form.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'El formato del email es inválido';
    }
    if (!editMode && !form.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (
      form.password.length > 0 &&
      !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password)
    ) {
      newErrors.password =
        'La contraseña debe incluir al menos 1 mayúscula, 1 número y 1 carácter especial';
    }
    if (!form.rol_id.trim()) {
      newErrors.rol_id = 'El Rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: value };

      if (name === 'apellido') {
        newForm.email = generarEmail(newForm.nombre, newForm.apellido);
      }

      return newForm;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    const formData = { ...form };

    if (editMode && formData.password === '') {
      delete formData.password;
    }

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `/api/usuarios/${editId}` : '/api/usuarios';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .then((err) => {
              throw new Error(err.message || 'Error en la operación');
            });
        }
        return response.json();
      })
      .then((data) => {
        if (editMode) {
          setUsuarios(
            usuarios.map((usuario) =>
              usuario.user_id === editId ? data : usuario
            )
          );
          toast.success('Usuario actualizado exitosamente');
        } else {
          setUsuarios([...usuarios, data]);
          toast.success('Usuario agregado exitosamente');
        }
        setEditMode(false);
        setEditId(null);
        setForm({
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          rol_id: ''
        });
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error en la operación:', error);
        toast.error('Error al crear o actualizar el usuario: ' + error.message);
      })
      .finally(() => setLoading(false));
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
        fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error al eliminar usuario');
            }
            setUsuarios(usuarios.filter((usuario) => usuario.user_id !== id));
            toast.success('Usuario eliminado exitosamente');
          })
          .catch((error) => {
            console.error('Error al eliminar usuario:', error);
            toast.error('Error al eliminar usuario: ' + error.message);
          })
          .finally(() => setLoading(false));

        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    });
  };

  const handleShowAddForm = () => {
    setForm({ nombre: '', apellido: '', email: '', password: '', rol_id: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: '',
      rol_id: usuario.rol_id
    });
    setEditMode(true);
    setEditId(usuario.user_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <TableContainer>
      <h1>CRUD Usuarios</h1>
      {loading && <div>Cargando...</div>}

      <AddUserButton onClick={handleShowAddForm}>Agregar Usuario</AddUserButton>

      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Nombre y Apellido</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Rol</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.user_id}>
              <TableCell>{usuario.nombre} {usuario.apellido}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{obtenerNombreRol(usuario.rol_id)}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEdit(usuario)}>Editar</ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(usuario.user_id)}>Eliminar</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nombre</Label>
              <Input name="nombre" value={form.nombre} onChange={handleChange} required />
              {errors.nombre && <div>{errors.nombre}</div>}
            </FormGroup>
            <FormGroup>
              <Label>Apellido</Label>
              <Input name="apellido" value={form.apellido} onChange={handleChange} required />
              {errors.apellido && <div>{errors.apellido}</div>}
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={handleChange} required readOnly />
              {errors.email && <div>{errors.email}</div>}
            </FormGroup>
            <FormGroup>
              <Label>Contraseña</Label>
              <Input name="password" type="password" value={form.password} onChange={handleChange} required={!editMode} />
              {errors.password && <div>{errors.password}</div>}
            </FormGroup>
            <FormGroup>
              <Label>Rol</Label>
              <Select name="rol_id" value={form.rol_id} onChange={handleChange} required>
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.rol_id} value={rol.rol_id}>
                    {rol.nombre}
                  </option>
                ))}
              </Select>
              {errors.rol_id && <div>{errors.rol_id}</div>}
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
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
  const rootElement = document.getElementById('crud-usuario');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<UsuariosApp />);
  } else {
    console.error("No se encontró el contenedor con id 'crud-usuario'");
  }
};

export default UsuariosApp;
