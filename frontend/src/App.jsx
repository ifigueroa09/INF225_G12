import { useState, useEffect } from 'react';
import Ensayos from './Ensayos';
import Preguntas from './Preguntas';
import Resultados from './Resultados';
import VistaProfesor from './VistaProfesor';
import CrearEnsayo from './CrearEnsayo';
import CrearPregunta from './Crearpregunta';
import PreguntasLibres from './PreguntasLibres';

function limpiarRut(rutConGuion) {
  return rutConGuion.replace(/\./g, '').toUpperCase();
}

export default function App() {
  const [rol, setRol] = useState('');
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('inicio');
  const [ensayoActual, setEnsayoActual] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [crearModo, setCrearModo] = useState(false);
  const [crearPreguntaModo, setCrearPreguntaModo] = useState(false);
  const [preguntasLibresModo, setPreguntasLibresModo] = useState(false);

  const [materiaUsuario, setMateriaUsuario] = useState(null);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState('');
  const [rutValido, setRutValido] = useState(false);

  useEffect(() => {
    if (!rut) return setRutValido(false);
    const regex = /^[0-9]{7,8}-?[0-9kK]$/;
    const limpio = rut.replace(/\./g, '').replace(/-/g, '');
    setRutValido(regex.test(rut) && limpio.length >= 8);
  }, [rut]);

  const cargarUsuario = async () => {
    if (!rutValido || (rol === 'alumno' && !nombre)) return;
    setCargandoUsuario(true);
    setErrorUsuario('');
    try {
      const limpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
      const dv = limpio.slice(-1);
      const num = limpio.slice(0, -1);
      const rutFormateado = `${num}-${dv}`;

      const res = await fetch(`/api/usuarios/${encodeURIComponent(rutFormateado)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      if (data.rol !== rol) {
        throw new Error(`Este RUT corresponde a un ${data.rol}, no a un ${rol}.`);
      }

      setNombre(data.nombre);
      setRut(rutFormateado);

      if (rol === 'profesor') {
        if (!data.materia_id) throw new Error('No tienes materia asignada');
        setMateriaUsuario({ id: data.materia_id, nombre: data.materia_nombre });
      } else {
        if (!data.materias || data.materias.length === 0) {
          throw new Error('No tienes materias asignadas');
        }
        setMateriasDisponibles(data.materias);
      }
    } catch (err) {
      console.error(err);
      setErrorUsuario(err.message);
    } finally {
      setCargandoUsuario(false);
    }
  };

  const seleccionarMateria = (materia) => {
    setMateriaUsuario(materia);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Ensayos PAES</h1>
      </header>

      <main className="flex-grow p-4 flex justify-center">
        <div className="w-full max-w-3xl">
          {!rol ? (
            <div className="bg-white p-8 rounded shadow text-center">
              <h2 className="text-2xl mb-6">¿Quién eres?</h2>
              <div className="flex justify-center gap-4">
                <button onClick={() => setRol('alumno')} className="bg-green-500 px-6 py-3 text-white rounded">
                  Soy Alumno
                </button>
                <button onClick={() => setRol('profesor')} className="bg-blue-500 px-6 py-3 text-white rounded">
                  Soy Profesor
                </button>
              </div>
            </div>
          ) : !materiaUsuario && rol === 'alumno' && materiasDisponibles.length > 0 ? (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Hola {nombre}, elige una materia:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materiasDisponibles.map(m => (
                  <button
                    key={m.id}
                    onClick={() => seleccionarMateria(m)}
                    className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {m.nombre}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setRol(''); setRut(''); setNombre(''); setMateriasDisponibles([]); }}
                className="mt-4 w-full bg-gray-300 py-2 rounded"
              >
                Volver
              </button>
            </div>
          ) : !materiaUsuario ? (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Ingresa tu RUT de {rol}</h2>
              <input
                value={rut}
                onChange={e => setRut(e.target.value)}
                placeholder="12345678-9"
                className="w-full mb-3 p-2 border rounded"
              />
              {rol === 'alumno' && (
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full mb-3 p-2 border rounded"
                />
              )}
              {!rutValido && rut && <p className="text-red-500 mb-2">RUT inválido</p>}
              {errorUsuario && <p className="text-red-600 mb-2">{errorUsuario}</p>}
              <div className="flex justify-between">
                <button
                  onClick={() => { setRol(''); setRut(''); setNombre(''); setMateriasDisponibles([]); }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Volver
                </button>
                <button
                  onClick={cargarUsuario}
                  disabled={!rutValido || (rol === 'alumno' && !nombre) || cargandoUsuario}
                  className={`px-4 py-2 rounded ${rutValido && !cargandoUsuario && (rol === 'profesor' || nombre)
                    ? rol === 'profesor' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                >
                  {cargandoUsuario ? 'Cargando…' : 'Ingresar'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {rol === 'profesor' && !crearModo && !crearPreguntaModo && !preguntasLibresModo && (
                <>
                  <div className="bg-white p-4 my-4 rounded shadow">
                    <h3 className="text-lg">Bienvenido, {nombre}</h3>
                    <p>Materia: {materiaUsuario.nombre}</p>
                  </div>
                  <VistaProfesor
                    materiaId={materiaUsuario.id}
                    materiaNombre={materiaUsuario.nombre}
                    volver={() => { 
                      setRol(''); 
                      setRut(''); 
                      setNombre(''); 
                      setMateriaUsuario(null); 
                    }}
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setCrearModo(true)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Crear nuevo ensayo
                    </button>
                    <button
                      onClick={() => setCrearPreguntaModo(true)}
                      className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Crear nueva pregunta
                    </button>
                    <button
                      onClick={() => setPreguntasLibresModo(true)}
                      className="flex-1 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Gestionar preguntas libres
                    </button>
                  </div>
                </>
              )}

              {rol === 'profesor' && crearModo && (
                <CrearEnsayo
                  materiaId={materiaUsuario.id}
                  materiaNombre={materiaUsuario.nombre}
                  profeRut={rut.replace(/\./g, '')}
                  volver={() => setCrearModo(false)}
                />
              )}

              {rol === 'profesor' && crearPreguntaModo && (
                <CrearPregunta
                  materiaId={materiaUsuario.id}
                  materiaNombre={materiaUsuario.nombre}
                  profeRut={rut.replace(/\./g, '')}
                  volver={() => setCrearPreguntaModo(false)}
                />
              )}

              {rol === 'profesor' && preguntasLibresModo && (
                <PreguntasLibres
                  usuario={{ rut: rut.replace(/\./g, ''), nombre, rol, materia_id: materiaUsuario.id }}
                  onVolver={() => setPreguntasLibresModo(false)}
                />
              )}

              {rol === 'alumno' && (
                <div className="mt-6">
                  {estado === 'inicio' && !preguntasLibresModo && (
                    <>
                      <Ensayos
                        materiaId={materiaUsuario.id}
                        comenzar={e => { setEnsayoActual(e); setEstado('preguntas'); }}
                        onVolver={() => setMateriaUsuario(null)}
                      />
                      <div className="mt-4">
                        <button
                          onClick={() => setPreguntasLibresModo(true)}
                          className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Practicar con preguntas libres
                        </button>
                      </div>
                    </>
                  )}
                  {estado === 'inicio' && preguntasLibresModo && (
                    <PreguntasLibres
                      usuario={{ rut: rut.replace(/\./g, ''), nombre, rol }}
                      onVolver={() => setPreguntasLibresModo(false)}
                    />
                  )}
                  {estado === 'preguntas' && ensayoActual && (
                    <Preguntas
                      ensayo={ensayoActual}
                      terminar={r => {
                        setResultado({ ...r, ensayo_id: ensayoActual.id });
                        setEstado('resultados');
                      }}
                    />
                  )}
                  {estado === 'resultados' && (
                    <Resultados
                      resultado={resultado}
                      usuario_rut={rut.replace(/\./g, '')}
                      volver={() => setEstado('inicio')}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="bg-blue-500 text-white p-3 text-center">
        Plataforma de ensayos PAES - SIP
      </footer>
    </div>
  );
}
