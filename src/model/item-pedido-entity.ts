export class ItemPedidoEntity {

  public idItemPedido: number;
  public idProdutoFornecedor: number;
  public idPedido: number;
  public idProduto: number;
  public idFornecedor: number;
  public valorUnitarioFormat: string;
  public qtdItem: number;
  public valorTotalFormat: string;
  
  public valorPedidoFormat: string;
  public valorDescontoFormat: string;
  public valorTotalPedidoFormat: string;
  public valorFreteFormat: string;
  public qtdItemCarrinho: number;
  
  public primeiraCompra: boolean;
  
  public valorDescontoPontoFormat: string;

  public isRequerDesconto: boolean;
	
  constructor(){
  }

}