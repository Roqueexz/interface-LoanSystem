export default interface CalendarioDTO {
    tipo_evento: string;
    data_evento: string;
    valor: number;
    descricao: string;
    color: string;
    id?: number;
    id_relacionado?: number;
    status?: string;
}