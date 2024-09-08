import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import { catchError, of, tap } from 'rxjs';
import { PacienteCadastroDTO } from '../../../models/paciente-cadastro.model';
import { ContatoService } from '../../../services/contato.service';
import { Contato } from '../../../models/contato.model';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-pacientes.component.html',
  styleUrls: ['./editar-pacientes.component.css']
})

export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  pacienteId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService,
    private contatoService: ContatoService,

  ) { }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadPaciente();
  }



  private initializeForm(): void {
    this.pacienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: ['', Validators.required],
      altura: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      peso: ['']
    });
  }

  private loadPaciente(): void {
    this.pacienteService.getPacienteById(this.pacienteId).pipe(
      tap(response => {
        if (response.success) {
          const paciente = response.data;
          // Atualizar os campos do formulário com os dados corretos
          this.pacienteForm.patchValue({
            nome: paciente.pessoa.nome,
            cpf: paciente.pessoa.cpf,
            dataNascimento: paciente.pessoa.dataNascimento,
            altura: paciente.altura,
            peso: paciente.peso
          });
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

      this.pacienteService.updatePaciente(this.pacienteId, pacienteCadastroDTO).pipe(
        tap(() => {
          this.router.navigate(['/pacientes']);
        }),
        catchError(error => {
          console.error('Erro ao atualizar dados do paciente', error);
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
        //sexo: form.controls.sexo.value,
        dataNascimento: form.controls.dataNascimento.value 
      }
    };

    return pacienteCadastro;
  }


  onContatosAtualizados(contatos: any[]): void {
    console.log('Contatos atualizados:', contatos);
    // Aqui você pode adicionar a lógica para integrar os dados de contatos com os dados do paciente
  }
}


