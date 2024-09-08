import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {
  contatoForm!: FormGroup;
  contatos: any[] = [];

  @Output() contatosAtualizados = new EventEmitter<any[]>();

  columns = [
    { header: 'Celular', field: 'celular' },
    { header: 'Telefone', field: 'telefone' },
    { header: 'Email', field: 'email' },
    { header: 'Tipo', field: 'tipo' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contatoForm = this.fb.group({
      celular: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      tipo: ['', Validators.required]
    });
  }

  onAddContato(): void {
    if (this.contatoForm.valid) {
      const novoContato = this.contatoForm.value;
      this.contatos.push(novoContato);
      this.contatoForm.reset();
      this.contatosAtualizados.emit(this.contatos);
    }
  }

  onRemoveContato(contato: any): void {
    this.contatos = this.contatos.filter(c => c !== contato);
  }

  onEditContato(contato: any): void {
    // Lógica para editar o contato selecionado
    console.log('Editar contato:', contato);
  }
}
