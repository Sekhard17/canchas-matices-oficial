import axios from 'axios';

const API_URL = 'https://canchas-matices.fly.dev/api';

// Función auxiliar para decodificar texto con caracteres especiales
const decodeText = (text: string): string => {
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

// Mapeo de roles del backend a roles del frontend
const roleMapping = {
  'Administrador': 'admin',
  'Encargado': 'staff',
  'Cliente': 'client',
  'Usuario': 'client', // Mapeamos 'Usuario' a 'client' por defecto
} as const;

type BackendRole = keyof typeof roleMapping;
type FrontendRole = typeof roleMapping[BackendRole];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  rut: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: FrontendRole;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        correo: credentials.email,
        contraseña: credentials.password
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        // Decodificar el token JWT
        const decodedToken = this.decodeToken(response.data.token);
        return {
          token: response.data.token,
          user: {
            id: decodedToken.id,
            name: `${decodeText(decodedToken.nombre)} ${decodeText(decodedToken.apellido)}`,
            email: decodedToken.correo,
            role: this.mapRole(decodedToken.rol)
          }
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateToken(): Promise<AuthResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token');
    }

    try {
      // Decodificar el token existente
      const decodedToken = this.decodeToken(token);
      
      // Verificar si el token ha expirado
      if (this.isTokenExpired(decodedToken)) {
        throw new Error('Token expirado');
      }

      return {
        token,
        user: {
          id: decodedToken.id,
          name: `${decodeText(decodedToken.nombre)} ${decodeText(decodedToken.apellido)}`,
          email: decodedToken.correo,
          role: this.mapRole(decodedToken.rol)
        }
      };
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  private isTokenExpired(decodedToken: any): boolean {
    if (!decodedToken.exp) return true;
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate <= new Date();
  }

  private mapRole(backendRole: BackendRole | string): FrontendRole {
    // Si el rol existe en el mapeo, úsalo
    if (backendRole in roleMapping) {
      return roleMapping[backendRole as BackendRole];
    }
    
    // Si no existe, asigna el rol 'client' por defecto
    console.warn(`Rol no reconocido: ${backendRole}, asignando rol 'client' por defecto`);
    return 'client';
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Error en la autenticación';
      return new Error(message);
    }
    return error;
  }
}

export const authService = new AuthService();