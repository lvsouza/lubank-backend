import Knex from "knex";

import { TableNames } from './../TableNames';

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.user, table => {

        table.bigIncrements('id').primary().index();
        table.string('name', 150).unique().notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar os usuários do sistema por tenant.");

    })
        .then(() => console.info(`\n\n# Created table ${TableNames.user}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.user)
        .then(() => console.info(`Dropped table ${TableNames.user}.`));
}
