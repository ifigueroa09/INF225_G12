// server.js corregido y completo
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'paes'
});

function limpiarRut(rut) {
  return rut.replace(/\./g, '').replace(/-/g, '').toLowerCase();
}

function formatearRut(rutLimpio) {
  const dv = rutLimpio.slice(-1);
  const num = rutLimpio.slice(0, -1);
  return `${num}-${dv}`;
}

/* ---------- Usuarios --------------------------------------- */
app.get('/api/usuarios/:rut', (req, res) => {
  const rut = formatearRut(limpiarRut(req.params.rut));
  conn.query(`SELECT * FROM usuarios WHERE rut = ?`, [rut], (err, results) => {
    if (err) return res.status(500).send(err.message);
    if (results.length === 0) return res.status(404).send('Usuario no encontrado');
    const user = results[0];

    if (user.rol === 'alumno') {
      conn.query(
        `SELECT m.id, m.nombre FROM usuario_materia um JOIN materias m ON m.id = um.materia_id WHERE um.rut = ?`,
        [rut],
        (err2, mats) => {
          if (err2) return res.status(500).send(err2.message);
          if (!mats.length) return res.status(400).send('No tienes materia asignada');
          res.json({ ...user, materias: mats });
        }
      );
    } else {
      conn.query(`SELECT nombre FROM materias WHERE id = ?`, [user.materia_id], (err2, mats) => {
        if (err2) return res.status(500).send(err2.message);
        res.json({ ...user, materia_nombre: mats[0]?.nombre || null });
      });
    }
  });
});

app.post('/api/usuarios', (req, res) => {
  const { rut, nombre, rol, materia_id } = req.body;
  if (!rut || !nombre || !rol) return res.status(400).send('faltan datos');
  conn.query(
    `INSERT INTO usuarios (rut,nombre,rol,materia_id)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), rol=VALUES(rol), materia_id=VALUES(materia_id)`,
    [rut, nombre, rol, materia_id || null],
    err => err ? res.status(500).send(err.message) : res.send('ok')
  );
});

/* ---------- Banco de preguntas ----------------------------- */
app.get('/api/preguntas', (_, res) => {
  conn.query('SELECT * FROM preguntas ORDER BY creada DESC', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

app.get('/api/preguntas/:materiaId', (req, res) => {
  conn.query('SELECT * FROM preguntas WHERE materia_id = ? ORDER BY creada DESC', [req.params.materiaId], (e, r) => {
    if (e) return res.status(500).send(e.message);
    res.json(r);
  });
});

app.post('/api/preguntas', (req, res) => {
  const { materia_id, texto, alt1, alt2, alt3, alt4, correcta, explicacion, creador_rut } = req.body;
  
  // Validación de campos requeridos
  if (!materia_id || !texto || !alt1 || !alt2 || !alt3 || !alt4 || !correcta || !explicacion || !creador_rut) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios'
    });
  }

  conn.query(
    `INSERT INTO preguntas (materia_id, texto, alt1, alt2, alt3, alt4, correcta, explicacion, creador_rut)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [materia_id, texto, alt1, alt2, alt3, alt4, correcta, explicacion, creador_rut],
    err => {
      if (err) {
        console.error('Error al crear pregunta:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al guardar la pregunta'
        });
      }
      res.json({
        success: true,
        message: 'Pregunta agregada correctamente'
      });
    }
  );
});

/* ---------- Ensayos ---------------------------------------- */
app.get('/api/ensayos', (req, res) => {
  const materia = req.query.materia;
  const sql = materia
    ? 'SELECT id,titulo FROM ensayos WHERE materia_id=? ORDER BY creado DESC'
    : 'SELECT id,titulo FROM ensayos ORDER BY creado DESC';
  conn.query(sql, materia ? [materia] : [], (e, r) => e ? res.status(500).send(e.message) : res.json(r));
});

app.get('/api/ensayos/:id', (req, res) => {
  conn.query(
    `SELECT p.id,texto,alt1,alt2,alt3,alt4,correcta,explicacion
     FROM ensayo_pregunta ep
     JOIN preguntas p ON p.id=ep.pregunta_id
     WHERE ep.ensayo_id=?`,
    [req.params.id],
    (e, r) => e ? res.status(500).send(e.message) : res.json(r)
  );
});

app.post('/api/ensayos', (req, res) => {
  const { materia_id, titulo, creador_rut, preguntas } = req.body;

  conn.query(
    'SELECT materia_id FROM usuarios WHERE rut = ? AND rol = "profesor"',
    [creador_rut.replace(/\./g, '')],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      if (results.length === 0) return res.status(403).send('Usuario no encontrado o no es profesor');

      const profesorMateriaId = results[0].materia_id;
      if (profesorMateriaId !== parseInt(materia_id)) {
        return res.status(403).send('Un profesor solo puede crear ensayos de su materia asignada');
      }

      if (preguntas.length > 0) {
        conn.query('SELECT id, materia_id FROM preguntas WHERE id IN (?)', [preguntas], (err, preguntasResults) => {
          if (err) return res.status(500).send(err.message);
          const invalidas = preguntasResults.filter(p => p.materia_id !== parseInt(materia_id));
          if (invalidas.length > 0) {
            return res.status(403).send('Solo se pueden agregar preguntas de la misma materia');
          }
          crearEnsayo();
        });
      } else {
        crearEnsayo();
      }
    }
  );

  function crearEnsayo() {
    conn.beginTransaction(err => {
      if (err) return res.status(500).send(err.message);
      conn.query('INSERT INTO ensayos (materia_id,titulo,creador_rut) VALUES (?,?,?)', [materia_id, titulo, creador_rut], (e, r) => {
        if (e) return conn.rollback(() => res.status(500).send(e.message));
        const ensayoId = r.insertId;
        if (preguntas.length === 0) {
          return conn.commit(() => res.json({ ensayo_id: ensayoId }));
        }
        const vals = preguntas.map(id => [ensayoId, id]);
        conn.query('INSERT INTO ensayo_pregunta (ensayo_id,pregunta_id) VALUES ?', [vals], err2 => {
          if (err2) return conn.rollback(() => res.status(500).send(err2.message));
          conn.commit(() => res.json({ ensayo_id: ensayoId }));
        });
      });
    });
  }
});

/* ---------- Resultados ------------------------------------- */
app.post('/api/resultados', (req, res) => {
  const { ensayo_id, usuario_rut, correctas, incorrectas, porcentaje_buenas, porcentaje_malas, respuestas } = req.body;
  
  // Primero eliminamos cualquier resultado existente para este usuario y ensayo
  conn.query(
    `DELETE FROM resultados_ensayo WHERE ensayo_id = ? AND usuario_rut = ?`,
    [ensayo_id, usuario_rut],
    (err) => {
      if (err) return res.status(500).send(err.message);
      
      // Luego insertamos el nuevo resultado
      conn.query(
        `INSERT INTO resultados_ensayo
         (ensayo_id, usuario_rut, respuestas_correctas, respuestas_incorrectas, porcentaje_buenas, porcentaje_malas, respuestas)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ensayo_id, usuario_rut, correctas, incorrectas, porcentaje_buenas, porcentaje_malas, JSON.stringify(respuestas)],
        (err) => {
          if (err) return res.status(500).send(err.message);
          res.send('ok');
        }
      );
    }
  );
});

app.get('/api/resultados-todos', (req, res) => {
  const materiaId = req.query.materia_id;
  let sql = `
    SELECT re.*, u.nombre, e.titulo, e.materia_id
    FROM resultados_ensayo re
    JOIN usuarios u ON u.rut = re.usuario_rut
    JOIN ensayos  e ON e.id  = re.ensayo_id
    WHERE u.rol='alumno'
  `;
  const params = [];
  if (materiaId) {
    sql += ' AND e.materia_id = ?';
    params.push(materiaId);
  }
  sql += ' ORDER BY re.fecha DESC';
  conn.query(sql, params, (e, r) => {
    if (e) return res.status(500).send(e.message);
    res.json(r);
  });
});

app.listen(3001, () => console.log('API en http://localhost:3001'));
