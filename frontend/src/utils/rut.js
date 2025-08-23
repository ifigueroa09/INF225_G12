export const rutRegex = /^[0-9]{8}-[0-9kK]$/;

/** Normaliza: sin espacios y con dígito verificador en minúscula */
export const cleanRut = r => r.trim().toLowerCase();
