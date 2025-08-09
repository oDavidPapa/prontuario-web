import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EnderecoService } from "../../services/endereco.service";
import { EnderecoCadastroDTO } from "../../models/endereco-cadastro.model";
import { AlertService } from "../dashboard/base/alert/alert.service";
import { catchError, of, tap } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-endereco',
    templateUrl: './endereco.component.html',
    styleUrls: ['./endereco.component.css']
})
export class EnderecoComponent implements OnInit {
    enderecoForm!: FormGroup;
    @Input() idPessoa!: number;

    constructor(
        private fb: FormBuilder,
        private enderecoService: EnderecoService,
        private alertService: AlertService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.loadEndereco();
    }

    private initializeForm(): void {
        this.enderecoForm = this.fb.group({
            id: [],
            logradouro: ['', [Validators.required]],
            numero: [''],
            complemento: ['', [Validators.required]],
            bairro: ['', Validators.required],
            cep: ['', Validators.required],
            cidade: ['', Validators.required],
            uf: ['', Validators.required],
            pais: ['', Validators.required],
            idPessoa: [this.idPessoa, Validators.required]
        });
    }

    private loadEndereco(): void {
        this.enderecoService.getEnderecoPessoa(this.idPessoa).pipe(
            tap(response => {
                if (response.success) {
                    const endereco = response.data;
                    this.enderecoForm.patchValue({
                        id: endereco.id,
                        logradouro: endereco.logradouro,
                        numero: endereco.numero,
                        complemento: endereco.complemento,
                        bairro: endereco.bairro,
                        cep: endereco.cep,
                        cidade: endereco.cidade,
                        uf: endereco.uf,
                        pais: endereco.pais
                    });

                    this.idPessoa = endereco.idPessoa;
                } else {
                    console.error('Erro ao carregar dados do paciente');
                }
            }),
            catchError(error => {
                console.error('Erro ao carregar dados do paciente', error);
                return of(null);
            })
        ).subscribe();
    }

    onSubmit(): void {
        if (this.enderecoForm.valid) {
            const enderecoCadastroDTO = this.createDataForm(this.enderecoForm);
            const idEndereco = this.enderecoForm.get('id')?.value;

            if (!idEndereco) {
                this.salvar(enderecoCadastroDTO);
            } else {
                this.update(idEndereco, enderecoCadastroDTO)
            }
        }
    }

    private salvar(enderecoCadastroDTO: EnderecoCadastroDTO) {
        this.enderecoService.salvarEndereco(enderecoCadastroDTO).pipe(
            tap(response => {
                this.alertService.success('Sucesso!', 'Endereço cadastrado com sucesso!');
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao cadastrar o endereço.');
                return of(null);
            })
        ).subscribe();
    }

    private update(idEndereco: number, enderecoCadastroDTO: EnderecoCadastroDTO) {
        this.enderecoService.updateEndereco(idEndereco, enderecoCadastroDTO).pipe(
            tap(response => {
                this.alertService.success('Sucesso!', 'Endereço atualizado com sucesso!');
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao atualizar o endereço.');
                return of(null);
            })
        ).subscribe();
    }


    createDataForm(form: any): EnderecoCadastroDTO {
        const enderecoCadastroDTO: EnderecoCadastroDTO = {
            logradouro: form.controls.logradouro.value,
            numero: form.controls.numero.value,
            complemento: form.controls.complemento.value,
            bairro: form.controls.bairro.value,
            cep: form.controls.cep.value,
            cidade: form.controls.cidade.value,
            uf: form.controls.uf.value,
            pais: form.controls.pais.value,
            idPessoa: form.controls.idPessoa.value,
        };

        return enderecoCadastroDTO;
    }

    cancel() {
        this.router.navigate(['/prontuario/pacientes']);
    }
}