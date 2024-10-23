import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Para las notificaciones

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
                    'X-CSRF-TOKEN': getCsrfToken()
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
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p>{error}</p>}
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
