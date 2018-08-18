import { ProdutoFornecedorEntity } from '../model/produto-fornecedor-entity';

export class ProdutoFornecedorDetalheEntity {

  public idProdutoFornecedor: number;
  public idProduto: number;
  public idFornecedor: number;
  public idUsuario: number;
  public idFavoritos: number;

  public nomeFornecedor: string;
  public enderecoFornecedor: string;

  public nomeProduto: string;
  public descricao: string;
  public dicas: string;
  public raca: string;
  public tipoAnimal: string;
  public idade: string;
  public linha: string;
  public marca: string;
  public imagem: string;
  public imagemLogo: string;

  public produtoFavoritos: boolean

  public listProdutoFornecedorEntities: ProdutoFornecedorEntity[] = [];

  constructor(){
  }

}