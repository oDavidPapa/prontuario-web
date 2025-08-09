import { Component, Input, OnInit } from '@angular/core';
import { ResumoConsultaService } from '../../../../services/resumo-consulta.service';
import { DadosCID, DadosConsulta, DadosPaciente, DadosPrescricao } from '../../../../models/resumo-consulta.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-resumo',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.css']
})
export class ResumoComponent implements OnInit {
    @Input() idConsulta!: any;

    dadosPaciente: DadosPaciente = {
        nome: '',
        idade: 0,
        sexo: '',
    };

    dadosConsulta: DadosConsulta = {
        dataHora: '',
        medico: '',
        especialidade: '',
        tipo: '',
    };

    cids: DadosCID[] = [];

    prescricoes: DadosPrescricao[] = [];
    tratamento: string = '';
    examesSolicitados: string[] = [];
    alergias: string[] = [];
    diagnostico: string = '';


    constructor(
        private resumoConsulta: ResumoConsultaService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.carregarResumo();
    }

    carregarResumo() {
        this.reloadConsultaId();
        if (this.idConsulta) {
            this.resumoConsulta.getResumoConsulta(this.idConsulta).subscribe(res => {
                this.dadosPaciente = res.data.dadosPaciente;
                this.dadosConsulta = res.data.dadosConsulta;
                this.cids = res.data.cids;
                this.prescricoes = res.data.prescricoes;
                this.tratamento = res.data.tratamento;
                this.examesSolicitados = res.data.examesSolicitados;
                this.alergias = res.data.alergias;
                this.diagnostico = res.data.diagnostico;
            });
        }
    }

    private reloadConsultaId() {
        this.idConsulta = this.route.snapshot.paramMap.get('id');
    }
}
