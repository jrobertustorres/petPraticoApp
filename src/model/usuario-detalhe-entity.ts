export class UsuarioDetalheEntity {
    
      public idUsuario: number;
      public idPessoa: number;
      public idEndereco: number;
      public idCidade: number;
      public idEstado: number;

      public nomePessoa: string;
      public cpfPessoa: string;
      public telefonePessoa: string;
      
      public emailUsuario: string;
      public senhaUsuario: string;
      public idUsuarioFacebook: string;
      
      public uuid: string;
      public versaoApp: string;
      
      public endereco: string;
      public bairro: string;
      public numeroEndereco: string;
      public complementoEndereco: string;
      public cepEndereco: string;
      public receberPromocoes: boolean;
      public isCadastroCompleto: boolean;
      public isCadastroEnderecoCompleto: boolean;
      public codigoIndicacao: string;

      constructor(){
      }
    }
    