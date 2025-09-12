import React, { useState, useEffect } from 'react';

const PreguntasLibres = ({ usuario, onVolver }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntasLibres, setPreguntasLibres] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [vistaActual, setVistaActual] = useState('gestionar'); // 'gestionar' o 'practicar'
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [indicePregunta, setIndicePregunta] = useState(0);

  useEffect(() => {
    cargarMaterias();
    cargarPreguntasLibres();
  }, []);

  useEffect(() => {
    if (materiaSeleccionada) {
      cargarPreguntas();
    }
  }, [materiaSeleccionada]);

  const cargarMaterias = async () => {
    try {
      const response = await fetch('/api/materias');
      const data = await response.json();
      setMaterias(data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const cargarPreguntas = async () => {
    try {
      const response = await fetch(`/api/preguntas/${materiaSeleccionada}`);
      const data = await response.json();
      setPreguntas(data);
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
    }
  };

  const cargarPreguntasLibres = async () => {
    try {
      const response = await fetch('/api/preguntas/libres');
      const data = await response.json();
      setPreguntasLibres(data);
    } catch (error) {
      console.error('Error al cargar preguntas libres:', error);
    }
  };

  const togglePreguntaLibre = async (preguntaId, esLibre) => {
    try {
      await fetch(`/api/preguntas/${preguntaId}/libre`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ es_libre: !esLibre }),
      });
      
      cargarPreguntas();
      cargarPreguntasLibres();
    } catch (error) {
      console.error('Error al actualizar pregunta:', error);
    }
  };

  const iniciarPractica = () => {
    if (preguntasLibres.length > 0) {
      setPreguntaActual(preguntasLibres[0]);
      setIndicePregunta(0);
      setRespuestaSeleccionada(null);
      setMostrarExplicacion(false);
      setVistaActual('practicar');
    }
  };

  const responder = (alternativa) => {
    setRespuestaSeleccionada(alternativa);
    setMostrarExplicacion(true);
  };

  const siguientePregunta = () => {
    const siguiente = indicePregunta + 1;
    if (siguiente < preguntasLibres.length) {
      setPreguntaActual(preguntasLibres[siguiente]);
      setIndicePregunta(siguiente);
      setRespuestaSeleccionada(null);
      setMostrarExplicacion(false);
    } else {
      // Terminar práctica
      setVistaActual('gestionar');
      setPreguntaActual(null);
    }
  };

  if (vistaActual === 'practicar') {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setVistaActual('gestionar')} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Volver a Gestión
          </button>
          <span>Pregunta {indicePregunta + 1} de {preguntasLibres.length}</span>
        </div>

        {preguntaActual && (
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <p><strong>Materia:</strong> {preguntaActual.materia_nombre}</p>
            <h3>{preguntaActual.texto}</h3>
            
            <div style={{ marginTop: '20px' }}>
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => responder(num)}
                  disabled={mostrarExplicacion}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    margin: '5px 0',
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: mostrarExplicacion 
                      ? (num === preguntaActual.correcta ? '#d4edda' : respuestaSeleccionada === num ? '#f8d7da' : '#fff')
                      : '#fff',
                    borderColor: mostrarExplicacion 
                      ? (num === preguntaActual.correcta ? '#c3e6cb' : respuestaSeleccionada === num ? '#f5c6cb' : '#ddd')
                      : '#ddd',
                    cursor: mostrarExplicacion ? 'default' : 'pointer'
                  }}
                >
                  {num}. {preguntaActual[`alt${num}`]}
                </button>
              ))}
            </div>

            {mostrarExplicacion && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
                <h4>Explicación:</h4>
                <p>{preguntaActual.explicacion}</p>
                <p><strong>Respuesta correcta:</strong> {preguntaActual.correcta}. {preguntaActual[`alt${preguntaActual.correcta}`]}</p>
                
                <button 
                  onClick={siguientePregunta}
                  style={{ 
                    marginTop: '10px', 
                    padding: '8px 16px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px' 
                  }}
                >
                  {indicePregunta + 1 < preguntasLibres.length ? 'Siguiente Pregunta' : 'Terminar Práctica'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestión de Preguntas Libres</h2>
        <button onClick={onVolver} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
          Volver al Menú Principal
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          onClick={iniciarPractica}
          disabled={preguntasLibres.length === 0}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: preguntasLibres.length > 0 ? '#28a745' : '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: preguntasLibres.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Practicar ({preguntasLibres.length} preguntas disponibles)
        </button>
      </div>

      {usuario.rol === 'profesor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>Gestionar Preguntas</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Seleccionar Materia:</label>
              <select 
                value={materiaSeleccionada} 
                onChange={(e) => setMateriaSeleccionada(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Seleccione una materia</option>
                {materias.map(materia => (
                  <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                ))}
              </select>
            </div>

            {materiaSeleccionada && (
              <div>
                <h4>Preguntas de la Materia</h4>
                {preguntas.map(pregunta => (
                  <div key={pregunta.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    margin: '5px 0', 
                    borderRadius: '4px',
                    backgroundColor: pregunta.es_libre ? '#d4edda' : '#fff'
                  }}>
                    <span style={{ flex: 1, marginRight: '10px' }}>
                      {pregunta.texto.substring(0, 100)}...
                    </span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input
                        type="checkbox"
                        checked={pregunta.es_libre}
                        onChange={() => togglePreguntaLibre(pregunta.id, pregunta.es_libre)}
                      />
                      Libre
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>Preguntas Libres para Práctica</h3>
            {preguntasLibres.map(pregunta => (
              <div key={pregunta.id} style={{ 
                backgroundColor: '#e7f3ff', 
                padding: '15px', 
                margin: '10px 0', 
                borderRadius: '5px', 
                borderLeft: '4px solid #007bff' 
              }}>
                <p><strong>Materia:</strong> {pregunta.materia_nombre}</p>
                <p><strong>Pregunta:</strong> {pregunta.texto}</p>
                <small>Creada: {new Date(pregunta.creada).toLocaleDateString()}</small>
              </div>
            ))}
            {preguntasLibres.length === 0 && (
              <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                No hay preguntas marcadas como libres aún.
              </p>
            )}
          </div>
        </div>
      )}

      {usuario.rol === 'alumno' && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>Preguntas Libres para Práctica</h3>
          {preguntasLibres.map(pregunta => (
            <div key={pregunta.id} style={{ 
              backgroundColor: '#e7f3ff', 
              padding: '15px', 
              margin: '10px 0', 
              borderRadius: '5px', 
              borderLeft: '4px solid #007bff' 
            }}>
              <p><strong>Materia:</strong> {pregunta.materia_nombre}</p>
              <p><strong>Pregunta:</strong> {pregunta.texto}</p>
            </div>
          ))}
          {preguntasLibres.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
              No hay preguntas libres disponibles para practicar.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PreguntasLibres;
