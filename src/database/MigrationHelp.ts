
/**
 * Loga uma mensagem no console somente se não for o ambiente de 'test' 
 * @param mess Mensagem a ser exibida no console
 */
export const log = (mess: string) => {
    if (process.env.NODE_ENV === 'test') return;
    console.log(mess);
}