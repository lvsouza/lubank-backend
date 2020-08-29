
/**
 * Função que devolve números inteiros aleatórios
 * 
 * @param min Valor inicial, o resultado não será menor que o valor informado aqui
 * @param max Valor final, o resultado não será maior que o valor informado aqui
 */
export const randomize = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
