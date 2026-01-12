import React, { useState } from "react";

// ⚠️ Este componente contiene vulnerabilidades intencionales para demostración de SAST
// NO usar en producción

const VulnerableComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");

  // Vulnerabilidad 1: Uso de eval() - Permite ejecución de código arbitrario
  const executeCode = () => {
    try {
      const output = eval(userInput); // eslint-disable-line no-eval
      setResult(String(output));
    } catch (error) {
      setResult("Error: " + error.message);
    }
  };

  // Vulnerabilidad 2: Uso de innerHTML - Susceptible a XSS
  const renderHtml = () => {
    document.getElementById("output").innerHTML = userInput;
  };

  // Vulnerabilidad 3: dangerouslySetInnerHTML - XSS
  const renderDangerously = () => {
    return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
  };

  // Vulnerabilidad 4: Uso de Function constructor
  const createFunction = () => {
    const fn = new Function("return " + userInput);
    setResult(String(fn()));
  };

  // Vulnerabilidad 5: document.write - Manipulación insegura del DOM
  const writeToDocument = () => {
    document.write(userInput);
  };

  // Vulnerabilidad 6: Almacenamiento inseguro de datos sensibles
  const storePassword = (password) => {
    localStorage.setItem("password", password);
    sessionStorage.setItem("apiKey", "secret-key-12345");
  };

  // Vulnerabilidad 7: console.log con datos sensibles
  const handleLogin = (username, password) => {
    console.log("Username:", username);
    console.log("Password:", password); // Nunca loguear passwords
    console.log("API Key:", process.env.REACT_APP_API_KEY);
  };

  // Vulnerabilidad 8: Regex inseguro (ReDoS)
  const validateInput = (input) => {
    const pattern = /^(a+)+$/;
    return pattern.test(input);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Componente con Vulnerabilidades (Solo para Demo SAST)</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ingresa código o HTML"
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={executeCode}>Ejecutar con eval()</button>
        <button onClick={renderHtml}>Renderizar con innerHTML</button>
        <button onClick={createFunction}>Crear función dinámica</button>
        <button onClick={writeToDocument}>document.write()</button>
        <button onClick={() => storePassword("myPassword123")}>
          Guardar password
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Resultado:</h3>
        <div id="output" style={{ border: "1px solid #ccc", padding: "10px" }}>
          {result}
        </div>
        {renderDangerously()}
      </div>
    </div>
  );
};

export default VulnerableComponent;
