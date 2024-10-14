import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Para las notificaciones

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Obtener el token CSRF desde el meta tag del HTML
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    // Manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken() // Añadimos el token CSRF
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en el inicio de sesión');
            }

            const data = await response.json(); // Obtenemos el nombre, apellido y rol del usuario

            // Mostrar en la consola la información del usuario logueado
            console.log(`Nombre: ${data.nombre}`);
            console.log(`Apellido: ${data.apellido}`);

            // Comprobar el rol del usuario y redirigir si es administrador
            let rolText;
            switch (data.rol) {
                case 1:
                    rolText = 'Administrador';
                    console.log(`Rol: ${rolText}`);
                    // Redirigir a la vista de administrador
                    window.location.href = '/administrador';
                    break;
                case 2:
                    rolText = 'Maestro';
                    console.log(`Rol: ${rolText}`);
                    break;
                case 3:
                    rolText = 'Padre';
                    console.log(`Rol: ${rolText}`);
                    break;
                default:
                    rolText = 'Rol desconocido';
                    console.log(`Rol: ${rolText}`);
                    break;
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
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
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
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <ToastContainer />
        </div>
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
