export class ProdutoFornecedorEntity {

  public idProdutoFornecedor: number;
  public idProduto: number;
  public idFornecedor: number;
  public idUsuario: number;

  public imagem: string;
  public nomeProduto: string;
  public descricaoProduto: string;

  public menorValor: number;

  public nomeFantasiaFornecedor: string;
  public horarioAtendimento: boolean
  public isAtendimento: boolean

  public kmDistancia: number;
  public valorFrete: number;
  public valor: number;
  public valorTotal: number;
  public unidadeProduto: string;
  public quantidadeProduto: number;

  public disponivel: boolean

  constructor(){
  }

}