import Knex from "knex";

import { TableNames } from './../TableNames';
import { log } from "../MigrationHelp";

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.billet, table => {

        table.bigIncrements('id').primary();
        table.decimal('value').notNullable();
        table.string('favored').notNullable();
        table.string('code').unique().index().notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar os boletos que poderão ser pagos pelo usuário.");

    })
        .then(() => log(`# Created table ${TableNames.billet}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.billet)
        .then(() => log(`Dropped table ${TableNames.billet}.`));
}
