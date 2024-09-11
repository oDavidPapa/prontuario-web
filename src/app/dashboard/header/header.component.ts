import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = '';
  showRegisterButton: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateHeader();
    });

    this.updateHeader();

  }

  private updateHeader(): void {
    const currentUrl = this.router.url;

    if (currentUrl.startsWith('/prontuario/pacientes')) {
      this.title = 'Pacientes';
      this.showRegisterButton = !currentUrl.includes('editar');
    } else if (currentUrl.startsWith('/prontuario/consultas')) {
      this.title = 'Consultas';
      this.showRegisterButton = false; // Sem botão para consultas
    } else if (currentUrl.startsWith('/prontuario/medicos')) {
      this.title = 'Médicos';
      this.showRegisterButton = false; // Sem botão para médicos
    } else if (currentUrl.startsWith('/prontuario/home')) {
      this.title = 'Home';
      this.showRegisterButton = false; // Sem botão para home
    } else if (currentUrl.startsWith('/prontuario/profile')) {
      this.title = 'Profile';
      this.showRegisterButton = false; // Sem botão para profile
    } else if (currentUrl.startsWith('/prontuario/settings')) {
      this.title = 'Settings';
      this.showRegisterButton = false; // Sem botão para settings
    } else {
      this.title = '';
      this.showRegisterButton = false;
    }
  }

  // onButtonClick(): void {
  //   // Lógica para o botão
  //   console.log('Botão clicado');
  //   // Redirecionar para a página de cadastro, dependendo do contexto
  //   if (this.title === 'Pacientes') {
  //     this.router.navigate(['/prontuario/pacientes/cadastrar']);
  //   }
  //   // Adicione redirecionamentos para outros títulos se necessário
  // }
}
