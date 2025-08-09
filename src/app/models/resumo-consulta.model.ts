export interface DadosPaciente {
    nome: string;
    idade: number;
    sexo: string;
}

export interface DadosConsulta {
    dataHora: string;
    medico: string;
    especialidade: string;
    tipo: string;
}

export interface DadosCID {
    codigo: string;
    descricao: string;
}

export interface DadosPrescricao {
    medicamento: string;
    instrucoes: string;
}
