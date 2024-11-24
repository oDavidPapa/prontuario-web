export interface ConsultaCadastroDTO {
    anamnese?: string;
    tipo: string;
    idMedico?: number;
    idConsulta?: number;
    idPaciente: number | undefined; 
    idAgendaConsulta?: number;
}