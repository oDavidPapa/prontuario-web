import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente.model';
import { catchError, of, tap } from 'rxjs';

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
    private router: Router,
    private fb: FormBuilder,
    private pacienteService: PacienteService
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
      this.pacienteService.updatePaciente(this.pacienteId, this.pacienteForm.value).pipe(
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
}
