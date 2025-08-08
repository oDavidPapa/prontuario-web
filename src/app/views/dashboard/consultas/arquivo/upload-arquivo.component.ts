import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArquivoService } from '../../../../services/arquivo.service';
import { Arquivo } from '../../../../models/arquivo.model';
import { Column } from '../../base/grid/column';

@Component({
  selector: 'app-upload-arquivo',
  templateUrl: './upload-arquivo.component.html',
  styleUrls: ['./upload-arquivo.component.css']
})
export class UploadArquivoComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;

  @Input() idConsulta!: number;

  arquivos: Arquivo[] = [];

  columns: Column[] = [
    { header: 'Descrição', field: 'descricao', align: 'left' },
    { header: 'Nome', field: 'nome', align: 'left' },
  ];


  constructor(
    private fb: FormBuilder,
    private arquivoService: ArquivoService
  ) {
    this.uploadForm = this.fb.group({
      arquivo: [null, Validators.required],
      descricao: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idConsulta'] && this.idConsulta) {
      this.carregarArquivos();
    }
  }

  carregarArquivos(): void {
    this.arquivoService.getArquivosByConsulta(this.idConsulta).subscribe({
      next: (res) => this.arquivos = res,
      error: () => alert('Erro ao carregar arquivos.')
    });
  }

  onRemoveArquivo(arquivo: Arquivo): void {
    this.arquivoService.deleteArquivo(arquivo.id).subscribe({
      next: () => {
        this.carregarArquivos();
        alert('Arquivo excluído com sucesso!');
      },
      error: () => {
        alert('Erro ao excluir o arquivo.');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ arquivo: this.selectedFile });
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Selecione um arquivo antes de enviar.');
      return;
    }

    if (this.uploadForm.invalid) {
      alert('Preencha a descrição do arquivo.');
      return;
    }

    const descricao = this.uploadForm.get('descricao')?.value;
    const nome = this.selectedFile.name;

    this.arquivoService.uploadArquivo(this.selectedFile, descricao, nome, this.idConsulta).subscribe({
      next: () => {
        alert('Arquivo enviado com sucesso!');
        this.uploadForm.reset();
        this.selectedFile = null;
      },
      error: () => {
        alert('Erro ao enviar arquivo.');
      }
    });
  }
}
