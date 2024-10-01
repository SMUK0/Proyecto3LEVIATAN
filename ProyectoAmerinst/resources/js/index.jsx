import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // Importar el componente principal
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar Bootstrap
import 'aos/dist/aos.css';  // Importar AOS
import '../css/app.css';  // Importar estilos personalizados
import AOS from 'aos';  // Importar AOS para animaciones
import '@fortawesome/fontawesome-free/css/all.min.css';


// Inicializar AOS
AOS.init();

ReactDOM.createRoot(document.getElementById('welcome-page')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
