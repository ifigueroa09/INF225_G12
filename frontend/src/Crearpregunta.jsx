// CrearPregunta.jsx
import { useState } from 'react';

export default function CrearPregunta({ materiaId, materiaNombre, profeRut, volver }) {
  const [texto, setTexto] = useState('');
  const [alt1, setAlt1] = useState('');
  const [alt2, setAlt2] = useState('');
  const [alt3, setAlt3] = useState('');
  const [alt4, setAlt4] = useState('');
  const [correcta, setCorrecta] = useState(1);
  const [explicacion, setExplicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const crearPregunta = async () => {
    if (!texto || !alt1 || !alt2 || !alt3 || !alt4 || !explicacion) {
      return setError('Todos los campos son obligatorios');
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materia_id: materiaId,
          texto,
          alt1,
          alt2,
          alt3,
          alt4,
          correcta,
          explicacion,
          creador_rut: profeRut
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess('Pregunta creada exitosamente!');
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setTexto('');
        setAlt1('');
        setAlt2('');
        setAlt3('');
        setAlt4('');
        setExplicacion('');
        setCorrecta(1);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nueva Pregunta</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Materia: {materiaNombre}
        </span>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enunciado de la pregunta</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Escribe aquí el enunciado de la pregunta..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`p-3 border rounded ${correcta === num ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternativa {num} {correcta === num && '(Correcta)'}
              </label>
              <input
                type="text"
                value={num === 1 ? alt1 : num === 2 ? alt2 : num === 3 ? alt3 : alt4}
                onChange={(e) => {
                  if (num === 1) setAlt1(e.target.value);
                  if (num === 2) setAlt2(e.target.value);
                  if (num === 3) setAlt3(e.target.value);
                  if (num === 4) setAlt4(e.target.value);
                }}
                className="w-full p-2 border rounded"
                placeholder={`Texto alternativa ${num}`}
              />
              <div className="mt-2">
                <input
                  type="radio"
                  name="correcta"
                  checked={correcta === num}
                  onChange={() => setCorrecta(num)}
                  className="mr-2"
                />
                <span className="text-sm">Marcar como correcta</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Explicación</label>
          <textarea
            value={explicacion}
            onChange={(e) => setExplicacion(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Explicación de la respuesta correcta..."
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={volver}
          className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Volver
        </button>
        <button
          onClick={crearPregunta}
          disabled={loading}
          className={`flex-1 py-2 rounded text-white ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Creando...' : 'Crear Pregunta'}
        </button>
      </div>
    </div>
  );
}