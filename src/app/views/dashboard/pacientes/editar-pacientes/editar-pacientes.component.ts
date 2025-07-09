import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../../services/paciente.service';
import { catchError, of, tap } from 'rxjs';
import { PacienteCadastroDTO } from '../../../../models/paciente-cadastro.model';
import { AlertService } from '../../base/alert/alert.service';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-pacientes.component.html',
  styleUrls: ['./editar-pacientes.component.css']
})

export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  idPaciente!: number;
  idPessoa!: number;

  isDadosPessoaisOpen = true;
  isEnderecoOpen = false;
  isContatoOpen = false;
  isAlergiaOpen = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.idPaciente = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadPaciente();
  }

  toggleSection(section: string): void {
    if (section === 'dadosPessoais') {
      this.isDadosPessoaisOpen = !this.isDadosPessoaisOpen;
    } else if (section === 'endereco') {
      this.isEnderecoOpen = !this.isEnderecoOpen;
    } else if (section === 'contato') {
      this.isContatoOpen = !this.isContatoOpen;
    } else if (section === 'alergia') {
      this.isAlergiaOpen = !this.isAlergiaOpen;
    }
  }


  private initializeForm(): void {
    this.pacienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: ['', Validators.required],
      altura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      sexo: ['']
    });
  }

  private loadPaciente(): void {
    this.pacienteService.getPacienteById(this.idPaciente).pipe(
      tap(response => {
        if (response.success) {
          const paciente = response.data;
          // Atualizar os campos do formulário com os dados corretos
          this.pacienteForm.patchValue({
            nome: paciente.pessoa.nome,
            cpf: paciente.pessoa.cpf,
            dataNascimento: paciente.pessoa.dataNascimento,
            altura: paciente.altura,
            peso: paciente.peso,
            sexo: paciente.pessoa.sexo
          });

          this.idPessoa = paciente.pessoa.id;

        } else {
          console.error('Erro ao carregar dados do paciente');
        }
      }),
      catchError(error => {
        console.error('Erro ao carregar dados do paciente', error);
        return of(null); // Retorna um Observable vazio em caso de erro
      })
    ).subscribe(); // Apenas para garantir que a pipe seja executada
  }


  onSubmit(): void {
    if (this.pacienteForm.valid) {
      var pacienteCadastroDTO = this.createDataForm(this.pacienteForm);

      this.pacienteService.updatePaciente(this.idPaciente, pacienteCadastroDTO).pipe(
        tap(() => {
          this.alertService.success('Sucesso!', 'Paciente atualizado com sucesso!');
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao atualizar dados do paciente.');
          return of(null);
        })
      ).subscribe();
    }
  }

  cancel(): void {
    this.router.navigate(['/prontuario/pacientes']);
  }

  createDataForm(form: any): PacienteCadastroDTO {
    const pacienteCadastro: PacienteCadastroDTO = {
      peso: parseFloat(form.controls.peso.value),
      altura: parseFloat(form.controls.altura.value),
      pessoaCadastroDTO: {
        nome: form.controls.nome.value,
        cpf: form.controls.cpf.value,
        sexo: form.controls.sexo.value,
        dataNascimento: form.controls.dataNascimento.value
      }
    };

    return pacienteCadastro;
  }


  onContatosAtualizados(contatos: any[]): void {
    console.log('Contatos atualizados:', contatos);
    // Aqui você pode adicionar a lógica para integrar os dados de contatos com os dados do paciente
  }

  onAlergiasAtualizadas(alergias: any[]): void {
    console.log('Contatos atualizados:', alergias);
    // Aqui você pode adicionar a lógica para integrar os dados de contatos com os dados do paciente
  }
}


