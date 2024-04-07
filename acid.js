const { Client } = require('pg');

const client = new Client({
  user: 'emm',
  host: '127.0.0.1',
  database: 'c3',
  password: '041130',
  port: 5432, 
});

client.connect();

class BaseDatos {
  constructor() {
    this.client = client;
    this.bloqueos = {};
  }

  async leer(dato) {
    // Fase 1: Solicitar bloqueo
    this.solicitarBloqueo(dato);

    // Fase 2: Acceder a los datos
    const query = `SELECT * FROM tu_tabla WHERE id = $1`;
    const result = await this.client.query(query, [dato]);
    console.log("Leyendo dato:", result.rows[0]);

    // Liberar bloqueo
    this.liberarBloqueo(dato);
  }

  async escribir(dato, valor) {
    // Fase 1: Solicitar bloqueo
    this.solicitarBloqueo(dato);

    // Fase 2: Actualizar los datos
    const query = `UPDATE tu_tabla SET valor = $1 WHERE id = $2`;
    await this.client.query(query, [valor, dato]);
    console.log("Dato escrito:", dato, "=", valor);

    // Liberar bloqueo
    this.liberarBloqueo(dato);
  }

  async actualizar(dato, nuevoValor) {
    // Fase 1: Solicitar bloqueo
    this.solicitarBloqueo(dato);

    // Fase 2: Actualizar los datos
    const query = `UPDATE tu_tabla SET valor = $1 WHERE id = $2`;
    await this.client.query(query, [nuevoValor, dato]);
    console.log("Dato actualizado:", dato, "=", nuevoValor);

    // Liberar bloqueo
    this.liberarBloqueo(dato);
  }

  async eliminar(dato) {
    // Fase 1: Solicitar bloqueo
    this.solicitarBloqueo(dato);

    // Fase 2: Eliminar el dato
    const query = `DELETE FROM tu_tabla WHERE id = $1`;
    await this.client.query(query, [dato]);
    console.log("Dato eliminado:", dato);

    // Liberar bloqueo
    this.liberarBloqueo(dato);
  }

  solicitarBloqueo(dato) {
    if (!this.bloqueos[dato]) {
      this.bloqueos[dato] = true;
      console.log("Bloqueo adquirido para:", dato);
    } else {
      console.log("Error: El dato", dato, "ya está bloqueado.");
    }
  }

  liberarBloqueo(dato) {
    delete this.bloqueos[dato];
    console.log("Bloqueo liberado para:", dato);
  }
}

// Ejemplo de uso
const db = new BaseDatos();

// Simulación de transacciones
db.leer(1);
db.escribir(2, 'Nuevo valor');
db.actualizar(1, 'Actualización');
db.eliminar(3);

// Cerrar la conexión al finalizar
client.end();
