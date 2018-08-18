export class UsuarioEntity {

  public idUsuario: number;
  public idPessoa: number;
  public nomePessoa: string;
  public idFornecedor: number;
  public nomeFornecedor: string;
  public idUsuarioFacebook: string;
  public tipoUsuario: string;
  public cpfPessoa: string;
  public telefone: string;
  public email: string;
  public emailUsuario: string;
  
  public senha: string;
  public token: string;
  public tokenPush: string;
  public receberPromocoes: boolean;
  public statusNovo: boolean;
  public status: boolean;
  public qtdItemcarrinho: number;

  public uuid: string;
  public versaoApp: string;

  public qtdPontuacaoIndicacao: number;
  public qtdPontos: number;
  public dataAtualizacaoPontosFormat: string;
  public qtdIndicacao: number;
  public novaSenha: string;

  public isCadastroCompleto: boolean;

  constructor(){
  }
}
