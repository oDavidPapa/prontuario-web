export interface ConsultaCadastroDTO {
    anamnese?: string;
    tipo: string;
    idMedico?: number;
    idConsulta?: number;
    idPaciente: number; 
    idAgendaConsulta?: number;
}