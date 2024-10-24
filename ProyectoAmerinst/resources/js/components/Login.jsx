import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Para las notificaciones
import styled from 'styled-components';

// Estilos para el contenedor principal
const LoginWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f9;
`;

// Estilos para el formulario
const LoginForm = styled.form`
    background-color: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
`;

// Estilos para el título del formulario
const Title = styled.h2`
    margin-bottom: 20px;
    color: #870e20;
`;

// Estilos para los campos de entrada
const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;

    &:focus {
        border-color: #870e20;
        outline: none;
    }
`;

// Estilos para el botón de enviar
const SubmitButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #870e20;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
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

// Estilos para los mensajes de error
const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
`;

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();

            // Mostrar logs del usuario
            console.log(`Usuario: ${data.nombre} ${data.apellido}`);
            console.log(`Rol: ${data.rol === 1 ? 'Administrador' : data.rol === 2 ? 'Maestro' : 'Padre'}`);

            // Guardar los datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));

            // Redirigir según el rol
            if (data.rol === 1) {
                window.location.href = '/administrador';
            } else if (data.rol === 2) {
                window.location.href = '/maestro'; // Redirección para el rol de maestro
            } else if (data.rol === 3) {
                window.location.href = '/padre';
            }

            toast.success('Inicio de sesión exitoso!');
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginWrapper>
            <LoginForm onSubmit={handleSubmit}>
                <Title>Iniciar Sesión</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div>
                    <label htmlFor="email">Correo electrónico:</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </SubmitButton>
            </LoginForm>
            <ToastContainer />
        </LoginWrapper>
    );
};

// Monta el componente en el div con id="login"
window.onload = () => {
    const rootElement = document.getElementById('login');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<Login />);
    } else {
        console.error("No se encontró el contenedor con id 'login'");
    }
};

export default Login;
