import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EstadisticasEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modelo, setModelo] = useState(null);
    const [estadisticas, setEstadisticas] = useState([]);
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Inicio de la carga de datos...');
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || userData.rol_id !== 3) {
                    console.error('Usuario no autorizado. Redirigiendo a login...');
                    window.location.href = '/login';
                    return;
                }

                const estudiantesData = await fetchEstudiantes(userData.user_id);
                console.log('Estudiantes cargados:', estudiantesData);

                if (estudiantesData.length > 0) {
                    const estudiantesIds = estudiantesData.map((est) => est.estudiante_id);
                    console.log('IDs de estudiantes:', estudiantesIds);

                    const notasData = await fetchNotas(estudiantesIds);
                    console.log('Notas cargadas:', notasData);

                    const materiasData = await fetchMaterias();
                    console.log('Materias cargadas:', materiasData);

                    if (notasData.length > 0 && materiasData.length > 0) {
                        setDataReady(true);
                    } else {
                        console.error('No se encontraron notas o materias.');
                    }
                } else {
                    console.error('No se encontraron estudiantes.');
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                toast.error('Error al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchEstudiantes = async (userId) => {
        try {
            const response = await fetch(`/api/estudiantes/relacionados/${userId}`);
            const estudiantesData = await response.json();
            setEstudiantes(estudiantesData);
            return estudiantesData;
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            return [];
        }
    };

    const fetchNotas = async (estudiantesIds) => {
        try {
            const response = await fetch('/api/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estudiantes_ids: estudiantesIds }),
            });
            const notasData = await response.json();
            setNotas(notasData);
            return notasData;
        } catch (error) {
            console.error('Error al cargar notas:', error);
            return [];
        }
    };

    const fetchMaterias = async () => {
        try {
            const response = await fetch('/api/materias');
            const materiasData = await response.json();
            setMaterias(materiasData);
            return materiasData;
        } catch (error) {
            console.error('Error al cargar materias:', error);
            return [];
        }
    };

    const normalizarDatos = (datos, max) => datos.map((d) => d / max);

    const entrenarModelo = () => {
        if (notas.length === 0) {
            console.error('No hay notas para entrenar el modelo.');
            toast.error('No hay notas para entrenar el modelo.');
            return;
        }

        console.log('Entrenando modelo...');
        const maxBimestre = 4; // Normalizar bimestres (1-4)
        const maxMateria = materias.length; // Normalizar materia_id según el número de materias
        const datosEntrenamiento = [];
        const etiquetas = [];

        notas.forEach((nota) => {
            datosEntrenamiento.push([
                nota.bimestre / maxBimestre, // Normalizado
                nota.materia_id / maxMateria, // Normalizado
            ]);
            etiquetas.push(clasificarRendimiento(parseFloat(nota.nota)));
        });

        console.log('Datos de entrenamiento normalizados:', datosEntrenamiento);
        console.log('Etiquetas:', etiquetas);

        const datosTensor = tf.tensor2d(datosEntrenamiento);
        const etiquetasTensor = tf.tensor1d(etiquetas, 'float32');

        const modelo = tf.sequential();
        modelo.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [2] }));
        modelo.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        modelo.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // 3 clases

        modelo.compile({
            optimizer: tf.train.adam(0.01), // Reducir el learning rate
            loss: 'sparseCategoricalCrossentropy',
            metrics: ['accuracy'],
        });

        modelo.fit(datosTensor, etiquetasTensor, {
            epochs: 100,
            validationSplit: 0.2,
        }).then(() => {
            setModelo(modelo);
            console.log('Modelo entrenado exitosamente.');
            toast.success('Modelo entrenado exitosamente.');
        });
    };

    const clasificarRendimiento = (nota) => {
        if (nota >= 8) return 0; // Alto rendimiento
        if (nota >= 5) return 1; // Rendimiento medio
        return 2; // Bajo rendimiento
    };

    const predecirRendimiento = (bimestre, materia_id) => {
        if (!modelo) {
            console.error('El modelo no está entrenado.');
            return null;
        }
        const tensorEntrada = tf.tensor2d([
            [bimestre / 4, materia_id / materias.length], // Normalizado
        ]);
        const prediccion = modelo.predict(tensorEntrada);
        const probabilidades = prediccion.arraySync()[0];
        const clase = prediccion.argMax(1).dataSync()[0];
        return { clase, probabilidades };
    };

    const generarEstadisticas = () => {
        if (!modelo) {
            console.error('El modelo no está entrenado. No se pueden generar estadísticas.');
            toast.error('El modelo no está entrenado. No se pueden generar estadísticas.');
            return;
        }
    
        console.log('Generando estadísticas basadas en el modelo...');
        const estadisticasPorMateria = materias.map((materia) => {
            const notasFiltradas = notas.filter((nota) => nota.materia_id === materia.materia_id);
    
            console.log(`Procesando materia: ${materia.nombre}`);
            console.log('Notas filtradas:', notasFiltradas);
    
            const resultados = estudiantes.map((estudiante) => {
                const notasEstudiante = notasFiltradas.filter(
                    (nota) => nota.estudiante_id === estudiante.estudiante_id
                );
    
                const predicciones = notasEstudiante.map((nota) => {
                    const prediccion = predecirRendimiento(nota.bimestre, nota.materia_id);
                    console.log(
                        `Predicción para "${estudiante.nombre}" en "${materia.nombre}":`,
                        prediccion
                    );
                    return prediccion.clase; // Clase predicha (0, 1, 2)
                });
    
                // Conteos por clase de rendimiento
                const altoRendimiento = predicciones.filter((prediccion) => prediccion === 0).length;
                const medioRendimiento = predicciones.filter((prediccion) => prediccion === 1).length;
                const bajoRendimiento = predicciones.filter((prediccion) => prediccion === 2).length;
    
                console.log(`Resultados del estudiante "${estudiante.nombre}" en "${materia.nombre}":`, {
                    altoRendimiento,
                    medioRendimiento,
                    bajoRendimiento,
                });
    
                return { altoRendimiento, medioRendimiento, bajoRendimiento };
            });
    
            console.log(`Resultados finales para la materia "${materia.nombre}":`, resultados);
    
            return {
                materia: materia.nombre,
                estadisticas: {
                    labels: estudiantes.map((est) => est.nombre),
                    datasets: [
                        {
                            label: `Alto Rendimiento en ${materia.nombre}`,
                            data: resultados.map((r) => r.altoRendimiento),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                        {
                            label: `Rendimiento Medio en ${materia.nombre}`,
                            data: resultados.map((r) => r.medioRendimiento),
                            borderColor: 'rgba(255, 206, 86, 1)',
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        },
                        {
                            label: `Bajo Rendimiento en ${materia.nombre}`,
                            data: resultados.map((r) => r.bajoRendimiento),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        },
                    ],
                },
            };
        });
    
        setEstadisticas(estadisticasPorMateria);
        console.log('Estadísticas generadas:', estadisticasPorMateria);
    };
    
    

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    return (
        <div className="container p-4">
            <h2 className="text-center mb-4">Estadísticas de Estudiantes</h2>

            {dataReady && (
                <div>
                    <button className="btn btn-primary me-2" onClick={entrenarModelo}>
                        Entrenar Modelo
                    </button>
                    <button className="btn btn-primary me-2" onClick={generarEstadisticas}>
                        Generar Estadísticas
                    </button>
                </div>
            )}

            <div>
                {estadisticas.length === 0 ? (
                    <p>No hay estadísticas disponibles.</p>
                ) : (
                    estadisticas.map((materiaEstadistica, index) => (
                        <div key={index}>
                            <h4>{materiaEstadistica.materia}</h4>
                            <Line data={materiaEstadistica.estadisticas} />
                        </div>
                    ))
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default EstadisticasEstudiantes;
