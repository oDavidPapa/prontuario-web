import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArquivoService } from '../../../../services/arquivo.service';

@Component({
  selector: 'app-upload-arquivo',
  templateUrl: './upload-arquivo.component.html',
  styleUrls: ['./upload-arquivo.component.css']
})
export class UploadArquivoComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;

    @Input() idConsulta!: number; 


  constructor(
    private fb: FormBuilder,
    private arquivoService: ArquivoService
  ) {
    this.uploadForm = this.fb.group({
      arquivo: [null, Validators.required],
      descricao: ['', Validators.required]
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
