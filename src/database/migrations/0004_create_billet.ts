import Knex from "knex";

import { TableNames } from './../TableNames';

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.billet, table => {

        table.bigIncrements('id').primary().index();
        table.decimal('value').notNullable();
        table.string('favored').notNullable();
        table.string('code').notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar os boletos que poderão ser pagos pelo usuário.");

    })
        .then(() => console.info(`# Created table ${TableNames.billet}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.billet)
        .then(() => console.info(`Dropped table ${TableNames.billet}.`));
}
