export interface PlantaGuardada {
  id: string;
  nome_comum: string;
  nome_cientifico: string;
  descricao: string;
  familia: string;
  imagem_url: string;
  frequencia_agua: number;
  quantidade_agua: string;
  luminosidade: string;
  temperatura: string;
  tipo: string;
  ultima_rega: string;
  notificacoes_ativas: boolean;
}
