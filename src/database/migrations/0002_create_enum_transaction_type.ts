import Knex from "knex";

import { TableNames } from '../TableNames';
import { log } from "../MigrationHelp";

const transactions = [
    { description: 'Deposito' },
    { description: 'Transferência' },
    { description: 'Pagamento' },
]

export async function up(knex: Knex) {
    return knex.schema.createTable(TableNames.transactionType, table => {

        table.bigIncrements('id').primary().index();
        table.string('description', 50).notNullable();

        // Comentário na tabela
        table.comment("Tabela usada para os tipos de transações.");

    })
        .then(() => knex(TableNames.transactionType).insert(transactions))
        .then(() => log(`# Created table ${TableNames.transactionType}.`))
        .then(() => log(`  + Inserted 'Deposito'.\n  + Inserted 'Transferência'.\n  + Inserted 'Pagamento'.`));
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(TableNames.transactionType)
        .then(() => log(`Dropped table ${TableNames.transactionType}.`));
}
