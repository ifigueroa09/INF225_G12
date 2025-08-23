import { useEffect, useState } from 'react';

export default function Ensayos({ materiaId, comenzar, onVolver }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ensayos?materia=${materiaId}`)
      .then(r => {
        if (!r.ok) throw new Error('Error al cargar ensayos');
        return r.json();
      })
      .then(data => {
        setLista(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los ensayos');
        setLoading(false);
      });
  }, [materiaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
        <span className="ml-2 text-gray-600">Cargando ensayos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (lista.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
        No hay ensayos disponibles en este momento.
        <button
          onClick={onVolver}
          className="mt-3 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Selecciona un ensayo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lista.map(e => (
          <button 
            key={e.id} 
            onClick={() => comenzar(e)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors shadow flex items-center justify-center"
          >
            <span className="font-medium">{e.titulo}</span>
          </button>
        ))}
      </div>
      {/* Botón de volver */}
      <button
        onClick={onVolver}
        className="mt-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Volver
      </button>
    </div>
  );
}