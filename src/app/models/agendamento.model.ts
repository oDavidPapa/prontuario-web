export interface Agendamento {
    id: number;
    idMedico: string;
    idPaciente: string;
    tipoConsulta: string;
    descricao: string;
    dataAgendamento: any;
}