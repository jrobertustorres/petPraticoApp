import { MeusItemPedidoEntity } from '../model/meus-item-pedido-entity';

export class MeusPedidoEntity {

  public idPedido: number;
  public idFornecedor: number;
  
  public nomeFantasiaFornecedor: string;
  public logoFornecedor: string;
  public horarioAtendimento: string;
  public isAtendimento: string;
  
  public valorFreteFormat: string;
  public valorFrete: number;
  public valorPedidoFormat: string;
  public valorTotalPedidoFormat: string;
  public valorTotalPedido: number;
  public endereco: string;
  public dataPedidoFormat: string;
  public tipoPagamento: string;
  
  public qtdItemcarrinhoCliente: number;
  
  public isCadastroCompleto: boolean;
  public isCadastroEnderecoCompleto: boolean;
  
  public isRequerDesconto: boolean;
  public isDireitoADesconto: boolean;
  public qtdPontos: number;
  public valorDescontoFormat: string;
  public valorDescontoPontoFormat: string;
  public primeiraCompra: boolean;

  public listMeusItemPedidoEntities: MeusItemPedidoEntity[] = [];

  constructor(){
  }

}