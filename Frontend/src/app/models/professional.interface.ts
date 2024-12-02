export interface Professional {
  _id?: string;
  nombre: string;
  email: string;
  especialidad: string;
  telefono: string;
  horariosDisponibles?: Array<{
    fecha: Date;
    horasDisponibles: string[];
  }>;
}
