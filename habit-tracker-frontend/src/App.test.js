/**
 * Test unitario simple para App
 * Nota: Este es un test básico para demostrar el funcionamiento del pipeline CI/CD
 */

test("App component basic test", () => {
  // Test simple que siempre pasa para verificar que el sistema de tests funciona
  expect(true).toBe(true);
});

test("Variables de entorno básicas", () => {
  // Verificar que podemos acceder a variables de entorno de Node
  expect(process.env.NODE_ENV).toBeDefined();
});
