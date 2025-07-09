import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPacienteComponent } from './editar-pacientes.component';


describe('EditarPacientesComponent', () => {
  let component: EditarPacienteComponent;
  let fixture: ComponentFixture<EditarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
