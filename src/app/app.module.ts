import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Necessário para ngModel
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';  // Corrigir o nome e a exportação

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  // Adiciona FormsModule
    AppRoutingModule  // Use o módulo de roteamento aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
