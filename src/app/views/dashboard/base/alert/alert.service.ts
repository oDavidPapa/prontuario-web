import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  error(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  confirm(title: string, message: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => result.isConfirmed);
  }
}
