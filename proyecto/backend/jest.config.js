/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Usamos ts-jest para manejar TypeScript
  preset: "ts-jest",

  // Entorno de ejecución (Node.js, no navegador)
  testEnvironment: "node",

  // Dónde buscar los tests. Como este archivo ya está en 'backend', buscamos en './src'
  roots: ["<rootDir>/src"],

  // Limpiar mocks automáticamente para evitar contaminación entre tests
  clearMocks: true,

  // Configuración explícita de transformación para evitar errores de sintaxis
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Aseguramos que use la configuración de TS correcta
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
