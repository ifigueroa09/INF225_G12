import unittest
import requests
import json

class TestCrearEnsayo(unittest.TestCase):
    
    BASE_URL = "http://localhost:3000/api"
    
    materia_id = None
    profesor_rut = None
    alumno_rut = None
    pregunta_ids = []
    ensayo_ids_creados = []
    
    @classmethod
    def setUpClass(cls):
        # Preparar datos de prueba
        cls.materia_id = 1
        cls.profesor_rut = "123456789"
        cls.alumno_rut = "987654321"
        
        # Crear usuario profesor
        profesor_data = {
            "rut": cls.profesor_rut,
            "nombre": "Profesor Test",
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
        
        # Crear preguntas de prueba
        preguntas = [
            {
                "materia_id": cls.materia_id,
                "texto": "¿Cuál es la capital de Chile?",
                "alt1": "Santiago",
                "alt2": "Valparaíso",
                "alt3": "Concepción",
                "alt4": "La Serena",
                "correcta": 1,
                "explicacion": "Santiago es la capital de Chile",
                "creador_rut": cls.profesor_rut,
                "es_libre": False
            },
            {
                "materia_id": cls.materia_id,
                "texto": "¿Cuánto es 2 + 2?",
                "alt1": "3",
                "alt2": "4",
                "alt3": "5",
                "alt4": "6",
                "correcta": 2,
                "explicacion": "2 + 2 = 4",
                "creador_rut": cls.profesor_rut,
                "es_libre": False
            }
        ]
        
        for i, pregunta in enumerate(preguntas, start=1):
            response = requests.post(f"{cls.BASE_URL}/preguntas", json=pregunta)
            if response.status_code == 200:
                cls.pregunta_ids.append(i)
        
        if not cls.pregunta_ids:
            response = requests.get(f"{cls.BASE_URL}/preguntas/{cls.materia_id}")
            if response.status_code == 200:
                preguntas_existentes = response.json()
                cls.pregunta_ids = [p['id'] for p in preguntas_existentes[:2]]
    
    @classmethod
    def tearDownClass(cls):
        pass
    
    def test_crear_ensayo_exitoso(self):
        # Caso exitoso: profesor crea un ensayo
        ensayo_data = {
            "materia_id": self.materia_id,
            "titulo": "Ensayo de Prueba",
            "creador_rut": self.profesor_rut,
            "preguntas": self.pregunta_ids
        }
        
        response = requests.post(
            f"{self.BASE_URL}/ensayos",
            json=ensayo_data,
            headers={"Content-Type": "application/json"}
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("ensayo_id", response_data)
        self.assertIsInstance(response_data["ensayo_id"], int)
        self.assertGreater(response_data["ensayo_id"], 0)
        
        self.ensayo_ids_creados.append(response_data["ensayo_id"])
    
    def test_crear_ensayo_usuario_no_profesor(self):
        # Caso excepcional: alumno intenta crear un ensayo (debe fallar)
        ensayo_data = {
            "materia_id": self.materia_id,
            "titulo": "Ensayo por Alumno",
            "creador_rut": self.alumno_rut,
            "preguntas": self.pregunta_ids
        }
        
        response = requests.post(
            f"{self.BASE_URL}/ensayos",
            json=ensayo_data,
            headers={"Content-Type": "application/json"}
        )
        
        self.assertEqual(response.status_code, 403)
        response_text = response.text.lower()
        self.assertTrue(
            "no encontrado" in response_text or "no es profesor" in response_text
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
