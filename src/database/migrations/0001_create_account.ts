import Knex from "knex";

import { TableNames } from './../TableNames';
import { log } from "../MigrationHelp";

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.account, table => {

        table.bigIncrements('id').primary().index();
        table.integer('account_number', 4).unique().index().notNullable();
        table.integer('agency', 8).notNullable();
        table.decimal('balance').notNullable();
        table.dateTime('last_update').notNullable();

        table.bigInteger('user_id').references('id').inTable(TableNames.user).notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar as contas dos usuários do banco.");

    })
        .then(() => log(`# Created table ${TableNames.account}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.account)
        .then(() => log(`Dropped table ${TableNames.account}.`));
}
