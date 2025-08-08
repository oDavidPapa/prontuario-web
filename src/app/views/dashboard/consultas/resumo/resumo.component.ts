import { Component, Input, OnInit } from '@angular/core';
import { ConsultaService } from '../../../../services/consulta.service';
import { AlertService } from '../../base/alert/alert.service';

@Component({
    selector: 'app-resumo',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.css']
})
export class ResumoComponent implements OnInit {
    @Input() idConsulta!: any;

    consulta: any;
    carregando = true;

    constructor(
        private consultaService: ConsultaService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        if (this.idConsulta) {
            this.carregarResumo();
        }
    }

    private carregarResumo(): void {
        // this.consultaService.getResumoConsulta(this.idConsulta).subscribe({
        //   next: (res) => {
        //     this.consulta = res.data;
        //     this.carregando = false;
        //   },
        //   error: () => {
        //     this.alertService.error('Erro!', 'Não foi possível carregar o resumo da consulta.');
        //     this.carregando = false;
        //   }
        // });
    }

    // Mock dos dados
    dadosConsulta = {
        data: new Date('2024-08-08T14:30:00'),
        medico: 'Dr. João Silva',
        especialidade: 'Cardiologia',
        tipo: 'Rotina'
    };

    dadosPaciente = {
        nome: 'Maria da Silva',
        idade: 38,
        sexo: 'Feminino'
    };

    diagnostico = 'Hipertensão arterial controlada, recomendação de dieta e exercícios.';

    cids = [
        { codigo: 'I10', descricao: 'Hipertensão essencial (primária)' },
        { codigo: 'E78.5', descricao: 'Hipercolesterolemia isolada' }
    ];

    prescricoes = [
        { remedio: 'Losartana 50mg', instrucoes: '1 comprimido ao dia após o café da manhã' },
        { remedio: 'Sinvastatina 20mg', instrucoes: '1 comprimido à noite' }
    ];

    tratamento = 'Orientação nutricional e prática de atividade física regular.';

    alergias = [];

    examesSolicitados = ['Eletrocardiograma', 'Exame de sangue - perfil lipídico', 'Ecocardiograma'];

}
