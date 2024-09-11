import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from '../services/contato.service';
import { catchError, of, tap } from 'rxjs';
import { Column } from '../dashboard/base/column';
import { Contato } from '../models/contato.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {
  contatoForm!: FormGroup;
  contatos: Contato[] = [];
  @Input() idPaciente!: number; // Recebe o ID do paciente


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
    private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadContatos()
  }

  private initializeForm(): void {
    this.contatoForm = this.fb.group({
      celular: ['', [Validators.required]],
      telefone: [''],
      email: ['', [Validators.required, Validators.email]],
      tipoContato: ['', Validators.required],
      idPessoa: [this.idPaciente, Validators.required]
    });
  }

  private loadContatos(): void {
    this.contatoService.getContatosByPessoa(this.idPaciente).pipe(
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
          console.log('Contato salvo com sucesso:', response);
          this.contatos.push(response.data); // Supondo que a resposta tenha uma propriedade 'data'
          this.contatoForm.reset();
          this.initializeForm();
        }),
        catchError(error => {
          // Manipule o erro e exiba uma mensagem de erro
          const errorMsg = 'Erro ao salvar contato. Por favor, tente novamente.';
          console.error('Erro ao salvar contato:', error);
          return of(null); // Retorna um Observable vazio para continuar o fluxo
        })
      ).subscribe();
    }
  }

  onRemoveContato(contato: Contato): void {
    this.contatos = this.contatos.filter(c => c !== contato);

    this.contatoService.delete(contato.id).subscribe(
      () => {
        console.log('Contato removido com sucesso');
        this.loadContatos(); // Recarregar a lista de contatos após a exclusão
      },
      (error) => {
        console.error('Erro ao remover contato:', error);
      }
    );
  }
}
