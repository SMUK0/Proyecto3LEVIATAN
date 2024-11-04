// Login.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    // Obtener el token CSRF
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejo de envío de formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                credentials: 'include', // Asegura el envío de cookies
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Credenciales incorrectas');
                } else {
                    throw new Error('Error al iniciar sesión');
                }
            }

            const data = await response.json();

            // Guardar los datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));

            // Redirigir según el rol
            switch (data.rol_id) {
                case 1:
                    window.location.href = '/administrador';
                    break;
                case 2:
                    window.location.href = '/maestro';
                    break;
                case 3:
                    window.location.href = '/padre';
                    break;
                default:
                    throw new Error('Rol desconocido');
            }

            toast.success('Inicio de sesión exitoso!');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.welcomeText}>Bienvenido a la Unidad Educativa</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.loginButton} disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>
            <button 
                onClick={() => window.location.href = '/'}
                style={styles.homeButton}
            >
                Regresar a Inicio
            </button>
            <ToastContainer />
        </div>
    );
};

// Estilos en línea
const styles = {
    container: {
        maxWidth: '380px',
        padding: '25px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        margin: 'auto',
        marginTop: '10vh'
    },
    welcomeText: {
        fontFamily: 'Georgia, serif',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '15px',
        textAlign: 'left'
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#555'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginTop: '5px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    loginButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#5cb85c',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '15px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    homeButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '10px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    }
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
