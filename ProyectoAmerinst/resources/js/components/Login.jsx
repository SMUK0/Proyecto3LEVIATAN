import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Para las notificaciones
import styled from 'styled-components'; // Para los estilos

// Contenedor del formulario de login
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff, #d95b5e);
  padding: 20px;
`;

const LoginForm = styled.form`
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-top: 6px solid #870e20; /* Línea decorativa superior */
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 28px;
  color: #870e20;
  font-family: 'Arial', sans-serif;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #870e20;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #d95b5e;
  }
`;

const Button = styled.button`
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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 15px;
  font-weight: bold;
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

      console.log(`Usuario: ${data.nombre} ${data.apellido}`);
      console.log(`Rol: ${data.rol === 1 ? 'Administrador' : data.rol === 2 ? 'Maestro' : 'Padre'}`);

      localStorage.setItem('user', JSON.stringify(data));

      if (data.rol === 1) {
        window.location.href = '/administrador';
      } else if (data.rol === 2) {
        window.location.href = '/maestro';
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
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Iniciar Sesión</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <InputGroup>
          <Label htmlFor="email">Correo electrónico:</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Contraseña:</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </LoginForm>
      <ToastContainer />
    </LoginContainer>
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
