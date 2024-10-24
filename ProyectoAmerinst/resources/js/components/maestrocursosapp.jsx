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

// Botón de agregar maestro-curso
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

// Modal para agregar/editar maestro-curso
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
    const [maestroCursos, setMaestroCursos] = useState([]);
    const [form, setForm] = useState({
        maestro_id: '',
        curso_id: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch('/api/maestro-cursos')
            .then(response => response.json())
            .then(data => setMaestroCursos(data))
            .catch(() => toast.error("Error al cargar maestro-cursos"));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `/api/maestro-cursos/${form.maestro_id}/${form.curso_id}` : '/api/maestro-cursos';

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
                setMaestroCursos(maestroCursos.map(mc => mc.maestro_id === form.maestro_id && mc.curso_id === form.curso_id ? data : mc));
                toast.success("Maestro-Curso actualizado exitosamente");
            } else {
                setMaestroCursos([...maestroCursos, data]);
                toast.success("Maestro-Curso agregado exitosamente");
            }
            setShowModal(false);
            setForm({ maestro_id: '', curso_id: '' });
            setEditMode(false);
        })
        .catch(() => toast.error("Error al crear o actualizar el maestro-curso"))
        .finally(() => setLoading(false));
    };

    const handleEdit = (maestroCurso) => {
        setForm({
            maestro_id: maestroCurso.maestro_id,
            curso_id: maestroCurso.curso_id
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = (maestro_id, curso_id) => {
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
                fetch(`/api/maestro-cursos/${maestro_id}/${curso_id}`, { method: 'DELETE' })
                .then(() => {
                    setMaestroCursos(maestroCursos.filter(mc => mc.maestro_id !== maestro_id || mc.curso_id !== curso_id));
                    toast.success("Maestro-Curso eliminado exitosamente");
                    Swal.fire('Eliminado!', 'El maestro-curso ha sido eliminado.', 'success');
                })
                .catch(() => toast.error("Error al eliminar el maestro-curso"))
                .finally(() => setLoading(false));
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ maestro_id: '', curso_id: '' });
        setEditMode(false);
    };

    return (
        <TableContainer>
            <h1>CRUD Maestro Cursos</h1>

            {loading && <div>Cargando...</div>}

            <AddButton onClick={() => setShowModal(true)}>Agregar Maestro-Curso</AddButton>

            <StyledTable>
                <thead>
                    <tr>
                        <TableHeader>Maestro ID</TableHeader>
                        <TableHeader>Curso ID</TableHeader>
                        <TableHeader>Acciones</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {maestroCursos.map(mc => (
                        <TableRow key={`${mc.maestro_id}-${mc.curso_id}`}>
                            <TableCell>{mc.maestro_id}</TableCell>
                            <TableCell>{mc.curso_id}</TableCell>
                            <TableCell>
                                <ActionButton variant="edit" onClick={() => handleEdit(mc)}>Editar</ActionButton>
                                <ActionButton variant="delete" onClick={() => handleDelete(mc.maestro_id, mc.curso_id)}>Eliminar</ActionButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </StyledTable>

            {showModal && (
                <Modal>
                    <ModalHeader>
                        <ModalTitle>{editMode ? 'Editar Maestro-Curso' : 'Agregar Maestro-Curso'}</ModalTitle>
                        <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
                    </ModalHeader>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Maestro ID</Label>
                            <Input type="number" name="maestro_id" value={form.maestro_id} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Curso ID</Label>
                            <Input type="number" name="curso_id" value={form.curso_id} onChange={handleChange} required />
                        </FormGroup>
                        <SubmitButton type="submit" disabled={loading}>
                            {editMode ? 'Actualizar Maestro-Curso' : 'Agregar Maestro-Curso'}
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
    const rootElement = document.getElementById('crud-maestro-cursos');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<App />);
    } else {
        console.error("No se encontró el contenedor con id 'crud-maestro-cursos'");
    }
};

export default App;
