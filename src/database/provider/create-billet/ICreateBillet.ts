export interface ICreateBillet {
    /**
     * Nome do favorecido pelo boleto
     */
    favored: string;
    /**
     * Valor do boleto a ser cadastrado
     */
    value: number;
    /**
     * Código de barras do boleto
     */
    code: string;
}
