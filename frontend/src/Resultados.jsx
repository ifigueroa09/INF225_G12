import { useState } from 'react';

export default function Resultados({ resultado, usuario_rut, volver }) {
  const [mostrarRetroalimentacion, setMostrarRetroalimentacion] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [preguntasConRespuestas, setPreguntasConRespuestas] = useState([]);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const cargarPreguntas = async () => {
    try {
      const response = await fetch(`/api/ensayos/${resultado.ensayo_id}`);
      if (!response.ok) throw new Error('Error al cargar preguntas');
      const preguntas = await response.json();
      setPreguntasConRespuestas(preguntas);
    } catch (err) {
      console.error(err);
      alert('Error al cargar las preguntas del ensayo');
    }
  };

  const guardar = async () => {
    try {
      const response = await fetch('/api/resultados', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ...resultado, usuario_rut })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al guardar resultados');
      }
      
      setGuardadoExitoso(true);
      await cargarPreguntas();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const porcentajeBuenas = resultado?.porcentaje_buenas || 0;
  const getNivelDesempeño = (porcentaje) => {
    if (porcentaje >= 90) return { text: 'Excelente', color: 'bg-green-500' };
    if (porcentaje >= 70) return { text: 'Bueno', color: 'bg-blue-500' };
    if (porcentaje >= 50) return { text: 'Regular', color: 'bg-yellow-500' };
    return { text: 'Necesita mejorar', color: 'bg-red-500' };
  };
  
  const nivel = getNivelDesempeño(porcentajeBuenas);

  const siguientePregunta = () => {
    if (preguntaActual < preguntasConRespuestas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    }
  };

  const anteriorPregunta = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  if (mostrarRetroalimentacion && preguntasConRespuestas.length > 0) {
    const pregunta = preguntasConRespuestas[preguntaActual];
    const respuestaUsuario = resultado.respuestas ? resultado.respuestas[preguntaActual] : null;
    const esCorrecta = respuestaUsuario === pregunta.correcta;

    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Retroalimentación</h2>
          <p className="text-gray-600">Pregunta {preguntaActual + 1} de {preguntasConRespuestas.length}</p>
        </div>
        
        <div className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-lg font-medium mb-4">
              <span className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-full mr-2">
                {preguntaActual + 1}
              </span>
              {pregunta.texto}
            </p>
            
            <div className="space-y-3 mt-4">
              {[pregunta.alt1, pregunta.alt2, pregunta.alt3, pregunta.alt4].map((alt, j) => {
                const esRespuestaCorrecta = j + 1 === pregunta.correcta;
                const esRespuestaUsuario = j + 1 === respuestaUsuario;
                
                let clase = "flex items-center p-3 rounded-lg";
                if (esRespuestaCorrecta) {
                  clase += " bg-green-100 border border-green-300";
                } else if (esRespuestaUsuario && !esCorrecta) {
                  clase += " bg-red-100 border border-red-300";
                } else {
                  clase += " bg-gray-50 border border-gray-200";
                }
                
                return (
                  <div key={j} className={clase}>
                    {esRespuestaCorrecta && (
                      <span className="mr-2 text-green-600">✓</span>
                    )}
                    {esRespuestaUsuario && !esCorrecta && (
                      <span className="mr-2 text-red-600">✗</span>
                    )}
                    <span className="font-medium">{alt}</span>
                  </div>
                );
              })}
            </div>
            
            {pregunta.explicacion && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">Explicación:</p>
                <p className="text-blue-700">{pregunta.explicacion}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={anteriorPregunta}
            disabled={preguntaActual === 0}
            className={`px-4 py-2 rounded ${preguntaActual === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          >
            Anterior
          </button>
          
          {preguntaActual < preguntasConRespuestas.length - 1 ? (
            <button 
              onClick={siguientePregunta}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Siguiente
            </button>
          ) : (
            <button 
              onClick={() => setMostrarRetroalimentacion(false)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Volver a resultados
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resultado del Ensayo</h2>
        <div className="mt-2 inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-800">
          Tu desempeño: <span className="font-bold">{nivel.text}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full ${nivel.color}`} 
            style={{ width: `${porcentajeBuenas}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-sm text-green-800 font-medium">Correctas</p>
            <p className="text-2xl font-bold text-green-800">{resultado.correctas}</p>
            <p className="text-sm text-green-700">{resultado.porcentaje_buenas.toFixed(2)}%</p>
          </div>
          
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="text-sm text-red-800 font-medium">Incorrectas</p>
            <p className="text-2xl font-bold text-red-800">{resultado.incorrectas}</p>
            <p className="text-sm text-red-700">{resultado.porcentaje_malas.toFixed(2)}%</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        {!guardadoExitoso ? (
          <button 
            onClick={guardar}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition"
          >
            Guardar resultados
          </button>
        ) : (
          <button 
            onClick={() => setMostrarRetroalimentacion(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition"
          >
            Ver retroalimentación
          </button>
        )}
        
        <button 
          onClick={volver}
          className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}