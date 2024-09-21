import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-paciente-resumo',
    templateUrl: './paciente-resumo.component.html',
    styleUrls: ['./paciente-resumo.component.css']
})
export class PacienteResumoComponent {
    @Input() selectedPaciente: any;  // Recebe o paciente selecionado de outro componente ou serviço
}
