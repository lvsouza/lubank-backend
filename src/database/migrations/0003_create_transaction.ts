import Knex from "knex";

import { TableNames } from './../TableNames';
import { log } from "../MigrationHelp";

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.transaction, table => {

        table.bigIncrements('id').primary().index();
        table.decimal('value').notNullable();

        table.bigInteger('user_id').references('id').inTable(TableNames.user).notNullable().index();
        table.bigInteger('type_id').references('id').inTable(TableNames.transactionType).notNullable().index();

        // Comentário na tabela
        table.comment("Tabela usada para armazenar as transações feitas pelos usuários do banco.");

    })
        .then(() => log(`# Created table ${TableNames.transaction}.`))
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.transaction)
        .then(() => log(`Dropped table ${TableNames.transaction}.`));
}
