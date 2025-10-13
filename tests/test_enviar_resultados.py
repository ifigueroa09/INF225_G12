import unittest
import requests
import json

class TestEnviarResultados(unittest.TestCase):
    
    BASE_URL = "http://localhost:3000/api"
    
    ensayo_id = None
    alumno_rut = None
    profesor_rut = None
    materia_id = None
    
    @classmethod
    def setUpClass(cls):
        # Preparar datos de prueba
        cls.materia_id = 1
        cls.profesor_rut = "222222222"
        cls.alumno_rut = "111111111"
        
        # Crear usuario profesor
        profesor_data = {
            "rut": cls.profesor_rut,
            "nombre": "Profesor Resultados",
            "rol": "profesor",
            "materia_id": cls.materia_id
        }
        requests.post(f"{cls.BASE_URL}/usuarios", json=profesor_data)
        
        # Crear usuario alumno
        alumno_data = {
            "rut": cls.alumno_rut,
            "nombre": "Alumno Test",
            "rol": "alumno",
            "materia_id": cls.materia_id
        }
        requests.post(f"{cls.BASE_URL}/usuarios", json=alumno_data)
        
        # Crear preguntas
        preguntas = [
            {
                "materia_id": cls.materia_id,
                "texto": "¿Pregunta 1 de ensayo?",
                "alt1": "Opción A",
                "alt2": "Opción B",
                "alt3": "Opción C",
                "alt4": "Opción D",
                "correcta": 1,
                "explicacion": "La correcta es A",
                "creador_rut": cls.profesor_rut,
                "es_libre": False
            },
            {
                "materia_id": cls.materia_id,
                "texto": "¿Pregunta 2 de ensayo?",
                "alt1": "Opción 1",
                "alt2": "Opción 2",
                "alt3": "Opción 3",
                "alt4": "Opción 4",
                "correcta": 2,
                "explicacion": "La correcta es 2",
                "creador_rut": cls.profesor_rut,
                "es_libre": False
            }
        ]
        
        pregunta_ids = []
        for pregunta in preguntas:
            response = requests.post(f"{cls.BASE_URL}/preguntas", json=pregunta)
            if response.status_code == 200:
                pregunta_ids.append(len(pregunta_ids) + 1)
        
        # Crear ensayo
        ensayo_data = {
            "materia_id": cls.materia_id,
            "titulo": "Ensayo para Resultados",
            "creador_rut": cls.profesor_rut,
            "preguntas": pregunta_ids if pregunta_ids else [1, 2]
        }
        
        response = requests.post(f"{cls.BASE_URL}/ensayos", json=ensayo_data)
        if response.status_code == 200:
            cls.ensayo_id = response.json().get("ensayo_id", 1)
        else:
            cls.ensayo_id = 1
    
    @classmethod
    def tearDownClass(cls):
        pass
    
    def test_enviar_resultados_exitoso(self):
        # Caso exitoso: alumno envía resultados válidos
        resultados_data = {
            "ensayo_id": self.ensayo_id,
            "usuario_rut": self.alumno_rut,
            "correctas": 1,
            "incorrectas": 1,
            "porcentaje_buenas": 50,
            "porcentaje_malas": 50,
            "respuestas": [
                {"pregunta_id": 1, "respuesta": 1},
                {"pregunta_id": 2, "respuesta": 2}
            ]
        }
        
        response = requests.post(
            f"{self.BASE_URL}/resultados",
            json=resultados_data,
            headers={"Content-Type": "application/json"}
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.text, "ok")
    
    def test_enviar_resultados_datos_faltantes(self):
        # Caso excepcional: envío con datos null/faltantes
        resultados_data = {
            "ensayo_id": self.ensayo_id,
            "usuario_rut": self.alumno_rut,
            "correctas": None,
            "incorrectas": None,
            "porcentaje_buenas": None,
            "porcentaje_malas": None,
            "respuestas": None
        }
        
        response = requests.post(
            f"{self.BASE_URL}/resultados",
            json=resultados_data,
            headers={"Content-Type": "application/json"}
        )
        
        # El servidor debería fallar con datos null
        self.assertEqual(response.status_code, 500)


if __name__ == "__main__":
    unittest.main(verbosity=2)
