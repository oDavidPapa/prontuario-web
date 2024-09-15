import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from '../services/contato.service';
import { catchError, of, tap } from 'rxjs';
import { Contato } from '../models/contato.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Column } from '../dashboard/base/grid/column';
import { AlertService } from '../dashboard/base/alert/alert.service';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit, OnChanges {
  contatoForm!: FormGroup;
  contatos: Contato[] = [];
  @Input() idPessoa!: number;

  @Output() contatosAtualizados = new EventEmitter<any[]>();

  columns: Column[] = [
    { header: 'Celular', field: 'celular', format: 'celular' },
    { header: 'Telefone', field: 'telefone', format: 'telefone' },
    { header: 'Email', field: 'email' },
    { header: 'Tipo', field: 'tipoContato' }
  ];

  constructor(
    private fb: FormBuilder,
    private contatoService: ContatoService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadContatos()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPessoa'] && this.idPessoa) {
      this.initializeForm();
      this.loadContatos()
    }
  }

  private initializeForm(): void {
    this.contatoForm = this.fb.group({
      celular: ['', [Validators.required]],
      telefone: [''],
      email: ['', [Validators.required, Validators.email]],
      tipoContato: ['', Validators.required],
      idPessoa: [this.idPessoa, Validators.required]
    });
  }

  private loadContatos(): void {
    this.contatoService.getContatosByPessoa(this.idPessoa).pipe(
      catchError(error => {
        console.error('Erro ao carregar contatos', error);
        return of({
          data: {
            list: [],
            total: 0,
            page: 0,
            pageSize: 0
          },
          success: false
        } as PaginatedResponse<Contato>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.contatos = response.data.list;
      }
    });
  }

  onAddContato(): void {
    if (this.contatoForm.valid) {
      const novoContato = this.contatoForm.value;

      this.contatoService.saveContato(novoContato).pipe(
        tap(response => {
          // Manipule a resposta se necessário
          this.alertService.success('Sucesso!', 'Contato cadastrado com sucesso!');
          this.contatos.push(response.data); // Supondo que a resposta tenha uma propriedade 'data'
          this.contatoForm.reset();
          this.initializeForm();
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao cadastrar o contato.');
          return of(null); // Retorna um Observable vazio para continuar o fluxo
        })
      ).subscribe();
    }
  }

  onRemoveContato(contato: Contato): void {
    this.contatos = this.contatos.filter(c => c !== contato);

    this.contatoService.delete(contato.id).subscribe(
      () => {
        this.alertService.success('Sucesso!', 'Contato removido com sucesso!');
        this.loadContatos(); // Recarregar a lista de contatos após a exclusão
      },
      (error) => {
        console.error('Erro ao remover contato:', error);
      }
    );
  }
}
