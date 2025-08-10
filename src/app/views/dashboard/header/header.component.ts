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
  showHeader = false;


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
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = true;

    } else if (currentUrl.startsWith('/prontuario/consultas')) {
      this.title = 'Consultas';
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = true;

    } else if (currentUrl.startsWith('/prontuario/medicos')) {
      this.title = 'Médicos';
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = true;

    } else if (currentUrl.startsWith('/prontuario/home')) {
      this.title = 'Home';
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = false;

    } else if (currentUrl.startsWith('/prontuario/usuarios')) {
      this.title = 'Usuários';
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = true;

    } else if (currentUrl.startsWith('/prontuario/configuracoes')) {
      this.title = 'Configurações';
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = true;

    } else if (currentUrl.startsWith('/prontuario/agendamentos')) {
      this.title = 'Agendamentos';
      this.showRegisterButton = this.shouldShowRegisterButton();
      this.showHeader = true;

    } else {
      this.title = '';
      this.showRegisterButton = false;
      this.showHeader = false;
    }
  }

  private shouldShowRegisterButton(): boolean {
    return !this.router.url.includes('editar') && !this.router.url.includes('cadastrar');
  }

  novoRegistro(): void {
    const currentRoute = this.router.url;
    const redirectTo = currentRoute + '/cadastrar'
    this.router.navigate([redirectTo]);
  }
}
