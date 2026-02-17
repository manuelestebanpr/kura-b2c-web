import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  featuredServices = [
    {
      code: 'HEMO-001',
      name: 'Hemograma Completo',
      description: 'Análisis completo de sangre que incluye glóbulos rojos, blancos y plaquetas.',
      price: 45000,
    },
    {
      code: 'PERF-001',
      name: 'Perfil Lipídico',
      description: 'Colesterol total, HDL, LDL y triglicéridos. Requiere ayuno de 12 horas.',
      price: 78000,
    },
    {
      code: 'GLUC-001',
      name: 'Glucosa en Sangre',
      description: 'Medición de niveles de azúcar en sangre. Ideal para control diabético.',
      price: 25000,
    },
    {
      code: 'TIRO-001',
      name: 'Perfil Tiroideo',
      description: 'TSH, T3 y T4 libre. Evaluación completa de la función tiroidea.',
      price: 125000,
    },
  ];

  trustIndicators = [
    {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Laboratorios Certificados',
      description: 'Todos nuestros aliados cumplen con estándares ISO',
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Resultados en 24h',
      description: 'La mayoría de exámenes listos en menos de un día',
    },
    {
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'Paga en el Laboratorio',
      description: 'Sin pagos anticipados, paga cuando te atiendan',
    },
  ];
}
