/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. Crear tabla unidades_formativas
  await knex.schema.createTable('unidades_formativas', function (table) {
    table.increments('id').primary();
    table.string('codigo').notNullable().unique();
    table.string('titulo').notNullable();
    table.timestamps(true, true);
  });

  // 2. Crear tabla modulo_formativo
  await knex.schema.createTable('modulo_formativo', function (table) {
    table.increments('id').primary();
    table.string('codigo').notNullable().unique();
    table.string('titulo').notNullable();
    table.timestamps(true, true);
  });

  // 3. Crear tabla repaso_unidades_formativas con claves foráneas
  await knex.schema.createTable('repaso_unidades_formativas', function (table) {
    table.increments('id').primary();
    table
      .integer('unidad_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('unidades_formativas')
      .onDelete('CASCADE');

    table
      .integer('modulo_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('modulo_formativo')
      .onDelete('CASCADE');

    table.string('pregunta').notNullable();
    table.string('respuesta_correcta').notNullable();
    table.string('opcion_respuesta').notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // El orden inverso para evitar errores por foreign keys
  await knex.schema.dropTableIfExists('repaso_unidades_formativas');
  await knex.schema.dropTableIfExists('modulo_formativo');
  await knex.schema.dropTableIfExists('unidades_formativas');
}
