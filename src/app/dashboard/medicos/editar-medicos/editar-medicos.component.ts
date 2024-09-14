import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from '../../../services/medico.service';
import { catchError, of, tap } from 'rxjs';
import { MedicoCadastroDTO } from '../../../models/medico-cadastro.model';
import { AlertService } from '../../base/alert/alert.service';

@Component({
  selector: 'app-editar-medico',
  templateUrl: './editar-medicos.component.html',
  styleUrls: ['./editar-medicos.component.css']
})

export class EditarMedicoComponent implements OnInit {
  medicoForm!: FormGroup;
  idMedico!: number;
  idPessoa!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private medicoService: MedicoService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.idMedico = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadMedico();
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

  private loadMedico(): void {
    this.medicoService.getMedicoById(this.idMedico).pipe(
      tap(response => {
        if (response.success) {
          const medico = response.data;
          // Atualizar os campos do formulário com os dados corretos
          this.medicoForm.patchValue({
            nome: medico.pessoa.nome,
            cpf: medico.pessoa.cpf,
            dataNascimento: medico.pessoa.dataNascimento,
            especialidade: medico.especialidade,
            crm: medico.crm,
            sexo: medico.pessoa.sexo
          });

          this.idPessoa = medico.pessoa.id;
        } else {
          console.error('Erro ao carregar dados do medico');
        }
      }),
      catchError(error => {
        console.error('Erro ao carregar dados do medico', error);
        return of(null); // Retorna um Observable vazio em caso de erro
      })
    ).subscribe(); // Apenas para garantir que a pipe seja executada
  }


  onSubmit(): void {
    if (this.medicoForm.valid) {
      var medicoCadastroDTO = this.createDataForm(this.medicoForm);

      this.medicoService.updateMedico(this.idMedico, medicoCadastroDTO).pipe(
        tap(() => {
          this.alertService.success('Sucesso!', 'Medico atualizado com sucesso!');
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao atualizar dados do medico.');
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
      especialidade: form.controls.especialidade.value,
      crm: form.controls.crm.value,
      pessoaCadastroDTO: {
        nome: form.controls.nome.value,
        cpf: form.controls.cpf.value,
        sexo: form.controls.sexo.value,
        dataNascimento: form.controls.dataNascimento.value
      }
    };

    return medicoCadastro;
  }


  onContatosAtualizados(contatos: any[]): void {
    console.log('Contatos atualizados:', contatos);
    // Aqui você pode adicionar a lógica para integrar os dados de contatos com os dados do medico
  }
}


