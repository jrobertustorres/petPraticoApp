export class PedidoEntity {

  public idPedido: number;
  public idFornecedor: number;

  public dataPedido: Date;
  public dataPedidoFormat: string;
  public nomeFantasiaFornecedor: string;
  public logoFornecedor: string;

  public tipoEntrega: string;
  public idTipoPagamento: number;
  public trocoPedido: string;
  public statusPedido: string;

  constructor(){
  }

}