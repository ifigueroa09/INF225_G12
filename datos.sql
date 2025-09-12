USE paes;

-- Materias
INSERT INTO materias (id, nombre) VALUES
  (1,'Módulo 1 – Matemáticas'),
  (2,'Módulo 2 – Matemáticas'),
  (3,'Competencia Lectora'),
  (4,'Historia'),
  (5,'Ciencias');

-- Usuarios
INSERT INTO usuarios (rut,nombre,rol,materia_id) VALUES
  ('10000000-1','Prof. M1','profesor',1),
  ('20000000-2','Prof. M2','profesor',2),
  ('30000000-3','Prof. CL','profesor',3),
  ('40000000-4','Prof. Hist','profesor',4),
  ('50000000-5','Prof. Sci','profesor',5),
  ('11111111-1','Alumno A','alumno',NULL),
  ('22222222-2','Alumno B','alumno',NULL),
  ('33333333-3','Alumno C','alumno',NULL);

-- Asignación de materias a alumnos
INSERT INTO usuario_materia (rut, materia_id) VALUES
  ('11111111-1',1),
  ('11111111-1',2),
  ('11111111-1',3),
  ('11111111-1',4),
  ('11111111-1',5),
  ('22222222-2',1),
  ('22222222-2',5),
  ('33333333-3',3);

-- Banco de preguntas
INSERT INTO preguntas
  (materia_id,texto,alt1,alt2,alt3,alt4,correcta,explicacion,creador_rut) VALUES
  (1,'Si x + 3 = 7, ¿cuál es x?','3','4','5','2',2,'Para resolver x + 3 = 7, resta 3 a ambos lados: x = 7 - 3 = 4. La operación inversa de la suma es la resta.','10000000-1'),
  (1,'¿Cuánto es 5·6?','11','30','35','25',2,'Multiplicar 5 por 6 es sumar 5 seis veces: 5 + 5 + 5 + 5 + 5 + 5 = 30.','10000000-1'),
  (1,'Raíz cuadrada de 49','6','7','8','9',2,'La raíz cuadrada de un número es el valor que, multiplicado por sí mismo, da el número original. 7 × 7 = 49.','10000000-1'),
  (2,'12/3 + 4 = ?','8','7','6','9',2,'Primero divide 12/3 = 4, luego suma 4 + 4 = 8. Recuerda el orden de operaciones: división antes que suma.','20000000-2'),
  (2,'2⁵ = ?','32','16','10','64',1,'2⁵ significa 2 multiplicado por sí mismo 5 veces: 2 × 2 × 2 × 2 × 2 = 32.','20000000-2'),
  (2,'Perímetro de un cuadrado de lado 5','20','15','25','10',1,'El perímetro de un cuadrado es la suma de sus 4 lados. Si cada lado mide 5, entonces 5 × 4 = 20.','20000000-2'),
  (3,'¿Qué conector indica contraste?','Además','Sin embargo','Porque','Por lo tanto',2,'"Sin embargo" es un conector adversativo que indica contraste entre ideas. Ejemplo: "Hacía frío, sin embargo, no llevaba abrigo".','30000000-3'),
  (3,'Idea principal de un texto descriptivo','Explicar','Narrar','Describir detalles','Argumentar',3,'Un texto descriptivo busca detallar características de objetos, personas o situaciones. La idea principal suele ser la imagen global que se describe.','30000000-3'),
  (3,'¿Cómo se llama el autor de una cita?','Narrador','Protagonista','Citado','Fuente',4,'El autor de una cita se llama "fuente". Es importante citar fuentes para dar crédito y evitar plagio.','30000000-3'),
  (4,'Año independencia de Chile','1810','1818','1821','1808',2,'Chile declaró su independencia el 12 de febrero de 1818, aunque el proceso comenzó en 1810 con la Primera Junta de Gobierno.','40000000-4'),
  (4,'Primer presidente de Chile','B. O'Higgins','Prat','Portales','Carrera',1,'Bernardo O'Higgins fue el primer Director Supremo de Chile después de la independencia y lideró el proceso de emancipación.','40000000-4'),
  (4,'Civilización de Machu Picchu','Mayas','Aztecas','Incas','Toltecas',3,'Los incas construyeron Machu Picchu en el siglo XV. Era un centro religioso y administrativo del Imperio Inca.','40000000-4'),
  (5,'Fórmula del agua','CO₂','H₂O','O₂H','HO₂',2,'La molécula de agua está formada por 2 átomos de hidrógeno (H) y 1 de oxígeno (O), por eso su fórmula es H₂O.','50000000-5'),
  (5,'Órgano que bombea la sangre','Pulmones','Riñones','Corazón','Hígado',3,'El corazón es el órgano muscular que bombea sangre a través del sistema circulatorio, llevando oxígeno y nutrientes al cuerpo.','50000000-5'),
  (5,'Proceso que convierte luz en energía química','Respiración','Fotosíntesis','Osmosis','Fermentación',2,'La fotosíntesis es el proceso en que las plantas convierten luz solar, CO₂ y agua en glucosa y oxígeno, usando clorofila.','50000000-5');

-- Ensayos
INSERT INTO ensayos (id,materia_id,titulo,creador_rut) VALUES
  (1,1,'Ensayo Matemático Básico','10000000-1'),
  (2,2,'Ensayo M2 Avanzado','20000000-2'),
  (3,3,'Comprensión de Lectura','30000000-3'),
  (4,4,'Historia de Chile','40000000-4'),
  (5,5,'Ciencias Básicas','50000000-5');

-- Preguntas de cada ensayo
INSERT INTO ensayo_pregunta (ensayo_id,pregunta_id,orden) VALUES
  (1,1,1), (1,2,2), (1,3,3),
  (2,4,1), (2,5,2), (2,6,3),
  (3,7,1), (3,8,2), (3,9,3),
  (4,10,1), (4,11,2), (4,12,3),
  (5,13,1), (5,14,2), (5,15,3);
