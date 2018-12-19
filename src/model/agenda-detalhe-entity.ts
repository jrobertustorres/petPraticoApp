export class AgendaDetalheEntity {
    
      public idAgenda: number;
      public funcionario: string;
      public fornecedor: string;
      public dataAgendaFormat: string;
      public statusAgenda: string;
      // public detalheServicoAgenda: string;

      public listDescricaoServico: string[] = [];

      constructor(){
      }
    
    }