export interface AgendamentoCadastroDTO {
    id?: number;
    idMedico: string;
    idPaciente: string;
    tipoConsulta: string;
    descricao: string;
    dataAgendamento: any;
}