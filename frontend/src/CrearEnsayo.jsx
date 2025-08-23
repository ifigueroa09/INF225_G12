import { useState, useEffect } from 'react';

export default function CrearEnsayo({ materiaId, materiaNombre, profeRut, volver }) {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ─── Carga SOLO las preguntas de la materia del profesor ─── */
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/preguntas/${materiaId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar preguntas');
        return res.json();
      })
      .then(data => {
        setPreguntas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar las preguntas.');
        setLoading(false);
      });
  }, [materiaId]);

  /* ─── Seleccionar/des-seleccionar ─── */
  const toggle = id => {
    const s = new Set(seleccionadas);
    s.has(id) ? s.delete(id) : s.add(id);
    setSeleccionadas(s);
  };

  /* ─── Crear ensayo ─── */
  const crear = async () => {
    if (!titulo || seleccionadas.size === 0) return;
    try {
      const res = await fetch('/api/ensayos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materia_id: materiaId,
          titulo,
          creador_rut: profeRut,
          preguntas: Array.from(seleccionadas)
        })
      });
      if (!res.ok) throw new Error(await res.text());
      volver();          // al volver se refresca el dashboard
    } catch (err) {
      setError(`No se pudo crear el ensayo: ${err.message}`);
    }
  };

  /* ─── UI ─── */
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nuevo Ensayo</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Materia: {materiaNombre}
        </span>
      </div>

      <input
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        placeholder="Título del ensayo"
        className="w-full p-2 border rounded"
      />

      <h3 className="font-medium">Seleccione preguntas para el ensayo</h3>

      {loading ? (
        <div className="py-6 text-center">Cargando preguntas…</div>
      ) : preguntas.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
          No hay preguntas para esta materia.
        </div>
      ) : (
        <p className="text-right text-sm text-gray-600">
          {seleccionadas.size} preguntas seleccionadas
        </p>
      )}

      <div className="space-y-4 max-h-80 overflow-auto">
        {preguntas.map(p => (
          <div
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`p-4 border rounded cursor-pointer ${
              seleccionadas.has(p.id)
                ? 'bg-blue-50 border-blue-400'
                : 'hover:bg-gray-50'
            }`}
          >
            {p.texto}
          </div>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4">
        <button
          onClick={crear}
          disabled={!titulo || seleccionadas.size === 0}
          className={`flex-1 py-3 rounded-lg transition ${
            !titulo || seleccionadas.size === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Crear Ensayo
        </button>
        <button
          onClick={volver}
          className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
