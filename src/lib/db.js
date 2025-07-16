import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 👇 esto es crucial para evitar el error de clave pública
    ssl: false,
    multipleStatements: true,
    // 👇 si no hiciste la opción 2 de antes, esto es necesario
    // allowPublicKeyRetrieval: true
  }
});

export default db;


export async function getPreguntas() {
  const preguntas = await db('repaso_unidades_formativas')
    .select('pregunta', 'respuesta_correcta')
    .orderByRaw('RAND()')
    .limit(15);
  return preguntas;
}
