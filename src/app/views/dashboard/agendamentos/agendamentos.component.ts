import { Component } from "@angular/core";
import { Agendamento } from "../../../models/agendamento.model";
import { Column } from "../base/grid/column";
import { AgendamentoService } from "../../../services/agendamento.service";
import { catchError, of, tap } from "rxjs";
import { PaginatedResponse } from "../../../models/pagination.model";
import { Router } from "@angular/router";
import { faNotesMedical } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-agendamentos',
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.css'
})

export class AgendamentosComponent {

  iconButtons = [
    { icon: faNotesMedical, actionName: 'createConsulta', tooltip: 'Gerar consulta' },
  ];

  agendamentos: Agendamento[] = [];
  columns: Column[] = [
    { header: '#', field: 'id' },
    { header: 'Data - Hora', field: 'dataConsulta' },
    { header: 'Paciente', field: 'paciente.pessoa.nome' },
    { header: 'Médico', field: 'medico.pessoa.nome' },
    { header: 'Tipo', field: 'tipoConsultaDescricao' }
  ];

  totalItems: number = 0; // Para paginação
  page: number = 0; // Página atual
  pageSize: number = 10; // Tamanho da página
  totalPages: number = 1; // Total de páginas

  constructor(private agendamentoService: AgendamentoService, private router: Router) { }


  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(page: number = 0): void {
    this.agendamentoService.getAgendamentos(page, this.pageSize).pipe(
      catchError(error => {
        console.error(error);
        return of({
          data: {
            list: [],
            total: 0,
            page: page,
            pageSize: this.pageSize
          },
          success: false
        } as PaginatedResponse<Agendamento>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.agendamentos = response.data.list;
        this.totalItems = response.data.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.carregarAgendamentos(this.page);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.carregarAgendamentos(this.page);
    }
  }

  editarAgendamento(agendamento: Agendamento): void {
    this.router.navigate([`/prontuario/agendamentos/editar/${agendamento.id}`]);
  }

onIconButtonClicked(event: { actionName: string, item: any }) {
  if (event.actionName === 'createConsulta') {
    this.agendamentoService.createConsulta(event.item.id)
      .pipe(
        tap((response) => {
              this.router.navigate([`/prontuario/consultas/editar/${response?.data}`]);
        }),
        catchError((err) => {
          console.error('Erro ao criar consulta', err);
          return of(null);
        })
      )
      .subscribe();
  }
}
}