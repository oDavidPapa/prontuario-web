import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { catchError, of, tap } from 'rxjs';
import { PacienteCadastroDTO } from '../../../models/paciente-cadastro.model';
import { AlertService } from '../../base/alert/alert.service';

@Component({
  selector: 'app-cadastrar-pacientes',
  templateUrl: './cadastrar-pacientes.component.html',
  styleUrls: ['./cadastrar-pacientes.component.css']
})

export class CadastraPacientesComponent implements OnInit {
  pacienteForm!: FormGroup;
  pacienteId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
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


  onSubmit(): void {
    if (this.pacienteForm.valid) {
      const pacienteCadastroDTO = this.createDataForm(this.pacienteForm);

      this.pacienteService.cadastrarPaciente(pacienteCadastroDTO).pipe(
        tap(response => {
          const pacienteId = response.data.id;
          this.alertService.success('Sucesso!', 'Paciente cadastrado com sucesso!');
          this.router.navigate([`/prontuario/pacientes/editar/${pacienteId}`]);
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao cadastrar dados do paciente.');
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

}