import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AlertService } from '../../base/alert/alert.service';
import { MedicoCadastroDTO } from '../../../models/medico-cadastro.model';
import { MedicoService } from '../../../services/medico.service';

@Component({
  selector: 'app-cadastrar-medicos',
  templateUrl: './cadastrar-medicos.component.html',
  styleUrls: ['./cadastrar-medicos.component.css']
})

export class CadastraMedicosComponent implements OnInit {
  medicoForm!: FormGroup;
  medicoId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private medicoService: MedicoService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.medicoId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
  }



  private initializeForm(): void {
    this.medicoForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: ['', Validators.required],
      crm: ['', [Validators.required]],
      especialidade: ['', [Validators.required]],
      sexo: ['']
    });
  }


  onSubmit(): void {
    if (this.medicoForm.valid) {
      const medicoCadastroDTO = this.createDataForm(this.medicoForm);

      this.medicoService.cadastrarMedico(medicoCadastroDTO).pipe(
        tap(response => {
          const medicoId = response.data.id;
          this.alertService.success('Sucesso!', 'medico cadastrado com sucesso!');
          this.router.navigate([`/prontuario/medicos/editar/${medicoId}`]);
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao cadastrar dados do medico.');
          return of(null);
        })
      ).subscribe();
    }
  }

  cancel(): void {
    this.router.navigate(['/prontuario/medicos']);
  }


  createDataForm(form: any): MedicoCadastroDTO {
    const medicoCadastro: MedicoCadastroDTO = {
      especialidade: form.controls.especialidade,
      crm: form.controls.crm,
      pessoaCadastroDTO: {
        nome: form.controls.nome.value,
        cpf: form.controls.cpf.value,
        sexo: form.controls.sexo.value,
        dataNascimento: form.controls.dataNascimento.value
      }
    };

    return medicoCadastro;
  }
}