import { useState, useEffect } from 'react';

export default function Preguntas({ ensayo, terminar }) {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [tiempo, setTiempo] = useState(180);
  const [inter, setInter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ensayos/${ensayo.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Error al cargar preguntas');
        return r.json();
      })
      .then(data => {
        setPreguntas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar las preguntas');
        setLoading(false);
      });
    
    const id = setInterval(() => {
      setTiempo(prev => {
        if (prev <= 1) {
          clearInterval(id); 
          finalizar(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setInter(id);
    return () => clearInterval(id);
  }, [ensayo.id]);

  const finalizar = () => {
  clearInterval(inter);
  const correctas = preguntas.filter((p, i) => respuestas[i] === p.correcta).length;
  const incorrectas = preguntas.length - correctas;
  
  terminar({
    ensayo_id: ensayo.id,
    correctas,
    incorrectas,
    porcentaje_buenas: (correctas / preguntas.length) * 100,
    porcentaje_malas: (incorrectas / preguntas.length) * 100,
    respuestas: Object.values(respuestas) // Guardamos las respuestas del usuario
  });
};

  const responder = (i, val) => setRespuestas(prev => ({...prev, [i]: val}));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-gray-600">Cargando preguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => terminar({})} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Volver
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-800">{ensayo.titulo}</h2>
          <div className="text-lg font-medium flex items-center">
            <span className="mr-2">Tiempo restante:</span>
            <span className={`${tiempo < 30 ? 'text-red-600 animate-pulse' : 'text-blue-600'} font-mono`}>
              {formatTime(tiempo)}
            </span>
          </div>
        </div>
      </div>

      {preguntas.map((p, i) => (
        <div key={p.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-lg font-medium mb-4">
            <span className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-full mr-2">
              {i + 1}
            </span>
            {p.texto}
          </p>
          
          <div className="space-y-3 mt-4">
            {[p.alt1, p.alt2, p.alt3, p.alt4].map((alt, j) => (
              <label 
                key={j} 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  respuestas[i] === j + 1 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <input 
                  type="radio" 
                  name={`p${i}`} 
                  checked={respuestas[i] === j + 1}
                  onChange={() => responder(i, j + 1)}
                  className="mr-3"
                />
                <span className="font-medium">{alt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <button
          onClick={finalizar}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition"
        >
          Finalizar ensayo
        </button>
      </div>
    </div>
  );
}