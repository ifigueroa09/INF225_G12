import { useEffect, useState } from 'react';

export default function VistaProfesor({ volver, materiaId, materiaNombre }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!materiaId) return;
    
    setLoading(true);
    setError('');
    
    // Obtener resultados filtrados por la materia del profesor
    fetch(`/api/resultados-todos?materia_id=${materiaId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar resultados');
        return res.json();
      })
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar los resultados. Intente nuevamente.');
        setLoading(false);
      });
  }, [materiaId]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Resultados de Ensayos</h2>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          Materia: <span className="font-bold">{materiaNombre}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      ) : data.length === 0 ? (
        <div className="p-6 bg-yellow-50 rounded-lg text-center">
          <p className="text-lg text-yellow-700">No hay resultados disponibles para mostrar.</p>
          <p className="text-sm text-yellow-600 mt-2">Los resultados aparecerán cuando los alumnos completen ensayos de su materia.</p>
        </div>
      ) : (
        <div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-3 border">Ensayo</th>
                <th className="p-3 border">Alumno</th>
                <th className="p-3 border">Correctas</th>
                <th className="p-3 border">Incorrectas</th>
                <th className="p-3 border">% Buenas</th>
                <th className="p-3 border">% Malas</th>
                <th className="p-3 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const pb = parseFloat(r.porcentaje_buenas);
                const pm = parseFloat(r.porcentaje_malas);
                return (
                  <tr key={r.id} className="hover:bg-blue-50 transition">
                    <td className="p-2 border">{r.titulo}</td>
                    <td className="p-2 border">{r.nombre} <span className="text-sm text-gray-500">({r.usuario_rut})</span></td>
                    <td className="p-2 border text-center">{r.respuestas_correctas}</td>
                    <td className="p-2 border text-center">{r.respuestas_incorrectas}</td>
                    <td className="p-2 border text-center">
                      {!isNaN(pb) ? `${pb.toFixed(2)}%` : '-'}
                    </td>
                    <td className="p-2 border text-center">
                      {!isNaN(pm) ? `${pm.toFixed(2)}%` : '-'}
                    </td>
                    <td className="p-2 border text-center">{new Date(r.fecha).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={volver}
        className="w-full py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
