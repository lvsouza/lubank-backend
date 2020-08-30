import { IBilletInfo } from "../billet-info/IBilletInfo";
import { TableNames } from "../../TableNames";
import Knex from '../../connection';

export class PayBilletProvider {
    /**
     * Função paga um boleto, retornando o saldo atualizado do usuário
     * 
     * @param userId Usuário que pagará o boleto
     * @param code Código de barras do bolteto que será pago
     * @returns Saldo atualizado do usuário
     */
    async payByCode(userId:number, code: string): Promise<number | null> {
        throw new Error("Not implemented");
    }
}
