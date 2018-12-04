export class EnderecoEntity {
    
      public idEndereco: number;
      public idCidade: number;
      public endereco: string;
      public bairro: string;
      public numeroEndereco: string;
      public complementoEndereco: string;
      public cepEndereco: string;

      public isCadastroCompleto: boolean;
      public isCadastroEnderecoCompleto: boolean;

      constructor(){
      }
    
    }