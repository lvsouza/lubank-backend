export interface IBilletInfo {
    /**
     * Identificador na base de dados
     */
    id: number;
    /**
     * Código de barras do boleto
     */
    code: string;
    /**
     * Valor do boleto
     */
    value: number;
    /**
     * Nome da pessoa favorecida pelo boleto
     */
    favored: string;
}
