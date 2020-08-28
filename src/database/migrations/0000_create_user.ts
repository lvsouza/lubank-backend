import Knex from "knex";

import { TableNames } from './../TableNames';
import { log } from "../MigrationHelp";

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.user, table => {

        table.bigIncrements('id').primary().index();
        table.string('name', 150).notNullable();
        table.string('email').unique().index().notNullable();
        table.string('password').notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar os usuários do sistema.");

    })
        .then(() => log(`\n\n# Created table ${TableNames.user}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.user)
        .then(() => log(`Dropped table ${TableNames.user}.`));
}
