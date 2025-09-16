import { Injectable } from '@angular/core';


export interface UsuarioLogado {
id: string;
nome: string;
email?: string;
perfis?: string[];
}


@Injectable({ providedIn: 'root' })
export class AuthService {
    getUsuarioId() {
      return 1;
    }
    getUsuario(): UsuarioLogado {
    return { id: 'U-123', nome: 'Funcionário Teste', email: 'funcionario@empresa.com' };
}
}