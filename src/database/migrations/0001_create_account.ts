import Knex from "knex";

import { TableNames } from './../TableNames';

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.account, table => {

        table.bigIncrements('id').primary().index();
        table.integer('accountNumber', 4).notNullable();
        table.integer('agency', 8).notNullable();
        table.decimal('balance').notNullable();

        table.bigInteger('userId').references('id').inTable(TableNames.user).notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar os usuários do sistema por tenant.");

    })
        .then(() => console.info(`# Created table ${TableNames.account}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.account)
        .then(() => console.info(`Dropped table ${TableNames.account}.`));
}
