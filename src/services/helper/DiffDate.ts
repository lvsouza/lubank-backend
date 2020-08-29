
/**
 * Retorna a diferença inteira de dias entre duas datas
 * 
 * @param date1 Data inicial
 * @param date2 Data final
 */
export const diffDates = (date1: Date, date2: Date): number => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
}
