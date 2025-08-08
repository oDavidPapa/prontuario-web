import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArquivoService } from '../../../../services/arquivo.service';
import { Arquivo } from '../../../../models/arquivo.model';
import { Column } from '../../base/grid/column';
import { AlertService } from '../../base/alert/alert.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-arquivo',
  templateUrl: './upload-arquivo.component.html',
  styleUrls: ['./upload-arquivo.component.css']
})
export class UploadArquivoComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;

  iconButtons = [
    { icon: faDownload, actionName: 'donwloadArquivo', tooltip: 'Download Arquivo' },
  ];

  @Input() idConsulta!: any;

  arquivos: Arquivo[] = [];

  columns: Column[] = [
    { header: 'Descrição', field: 'descricao', align: 'left' },
    { header: 'Nome Arquivo', field: 'nome', align: 'left' },
  ];

  constructor(
    private fb: FormBuilder,
    private arquivoService: ArquivoService,
    private alertService: AlertService,
    private route: ActivatedRoute,

  ) {
    this.uploadForm = this.fb.group({
      arquivo: [null, Validators.required],
      descricao: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.carregarArquivos()
    console.log(this.arquivos)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idConsulta'] && this.idConsulta) {
      this.carregarArquivos()
    }
  }

  carregarArquivos(): void {
    this.reloadConsultaId();
    this.arquivoService.getArquivosByConsulta(this.idConsulta).subscribe({
      next: (res) => this.arquivos = res.data.list,
      error: () => this.alertService.error('Erro!', 'Erro ao carregar os arquivos.')
    });
  }

  onRemoveArquivo(arquivo: Arquivo): void {
    this.arquivoService.deleteArquivo(arquivo.id).subscribe({
      next: () => {
        this.carregarArquivos();
        this.alertService.success('Sucesso!', 'Arquivo exluído com sucesso.');
      },
      error: () => {
        this.alertService.error('Erro!', 'Erro ao excluir o arquivo.');
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
      this.alertService.warn('Ops!', 'Selecione um arquivo antes de salvar.');
      return;
    }

    if (this.uploadForm.invalid) {
      return;
    }

    const descricao = this.uploadForm.get('descricao')?.value;
    const nome = this.selectedFile.name;

    this.arquivoService.uploadArquivo(this.selectedFile, descricao, nome, this.idConsulta).subscribe({
      next: () => {
        this.alertService.success('Sucesso!', 'Arquivo salvo com sucesso.');
        this.uploadForm.reset();
        this.selectedFile = null;
        this.carregarArquivos()
      },
      error: () => {
        this.alertService.error('Erro!', 'Erro ao salvar o arquivo.');
      }
    });
  }

  onIconButtonClicked(event: { actionName: string, item: any }) {
    if (event.actionName === 'donwloadArquivo') {
      this.download(event.item.id, event.item.nome);
    }
  }

  private download(id: number, nomeArquivo: string): void {
    this.arquivoService.downloadArquivo(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.alertService.error('Erro!', 'Erro ao baixar o arquivo.');
      }
    });
  }

  private reloadConsultaId() {
    this.idConsulta = this.route.snapshot.paramMap.get('id');
  }
}
