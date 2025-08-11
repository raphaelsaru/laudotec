'use client';

import { DadosLaudo } from '../page';

interface Props {
  dados: DadosLaudo;
  onVoltar: () => void;
}

export function LaudoGerado({ dados, onVoltar }: Props) {
  const gerarNomeLaudo = () => {
    return `${dados.numeroOS} - ${dados.chassi} - ${dados.numeroPecaCausadora} - ${dados.descricaoPecaCausadora}`;
  };

  const formatarResposta = (valor: string) => {
    if (valor === 'sim') return 'Sim';
    if (valor === 'nao') return 'Não';
    return valor || 'Não informado';
  };

  // Componente para exibir imagem única
  const ExibirImagemUnica = ({ file, titulo }: { file: File | null, titulo: string }) => {
    if (!file) return null;
    
    return (
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 mb-1">{titulo}:</p>
        <img 
          src={URL.createObjectURL(file)} 
          alt={titulo}
          className="max-w-xs h-auto rounded border border-gray-300"
        />
      </div>
    );
  };

  // Componente para exibir múltiplas imagens
  const ExibirImagensMultiplas = ({ files, titulo }: { files: File[], titulo: string }) => {
    if (files.length === 0) return null;
    
    return (
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 mb-2">{titulo}:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {files.map((file, index) => (
            <img 
              key={index}
              src={URL.createObjectURL(file)} 
              alt={`${titulo} ${index + 1}`}
              className="w-full h-32 object-cover rounded border border-gray-300"
            />
          ))}
        </div>
      </div>
    );
  };

  const handleSalvarPDF = () => {
    // Definir o título do documento para aparecer na caixa de diálogo
    document.title = gerarNomeLaudo();
    
    // Abrir a caixa de diálogo de impressão (que permite salvar como PDF)
    window.print();
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg print:hidden">
        <h2 className="text-2xl font-bold text-gray-900">Laudo Técnico Gerado</h2>
        <div className="space-x-3">
          <button
            onClick={handleSalvarPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Salvar como PDF
          </button>
          <button
            onClick={onVoltar}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Voltar ao Formulário
          </button>
        </div>
      </div>

      <div id="laudo-content" className="p-8 bg-white border border-gray-200 rounded-lg">
        {/* Cabeçalho */}
        <div className="header text-center mb-8 pb-6 border-b-2 border-gray-300">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">LAUDO TÉCNICO</h1>
          <h2 className="text-xl text-gray-800">{gerarNomeLaudo()}</h2>
          <p className="text-gray-800 mt-2">Data de Geração: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Identificação */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            IDENTIFICAÇÃO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Chassi (VIN):</span>
              <span className="field-value ml-2 text-gray-800">{dados.chassi}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Número da OS:</span>
              <span className="field-value ml-2 text-gray-800">{dados.numeroOS}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold text-gray-800">PRMS Nº:</span>
              <span className="field-value ml-2 text-gray-800">{formatarResposta(dados.prmsNumero)}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Veículo Modificado:</span>
              <span className="field-value ml-2 text-gray-800">{formatarResposta(dados.veiculoModificado)}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Block Flag Ativado:</span>
              <span className="field-value ml-2 text-gray-800">{formatarResposta(dados.blockFlagAtivado)}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Aberto PRMS:</span>
              <span className="field-value ml-2 text-gray-800">{formatarResposta(dados.abertoPRMS)}</span>
            </div>
          </div>
        </div>

        {/* Fotos Iniciais */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            FOTOS INICIAIS
          </h3>
          <div className="space-y-4">
            <ExibirImagemUnica file={dados.fotoPainel} titulo="Foto do Painel de Instrumentos" />
            <ExibirImagemUnica file={dados.fotoChassi} titulo="Foto do Chassi (VIN)" />
          </div>
        </div>

        {/* Reclamação do Cliente */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            RECLAMAÇÃO DO CLIENTE
          </h3>
          <div className="field mb-3">
            <span className="field-label font-semibold text-gray-800">Descrição:</span>
            <div className="field-value ml-2 mt-1 p-3 bg-gray-50 rounded border text-gray-800">
              {dados.reclamacaoDescricao || 'Não informado'}
            </div>
          </div>
          <ExibirImagensMultiplas files={dados.fotoSintoma} titulo="Fotos do Sintoma" />
        </div>

        {/* Método de Diagnóstico */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            MÉTODO DE DIAGNÓSTICO
          </h3>
          {dados.passos.map((passo, index) => (
            <div key={index} className="step mb-4 p-4 bg-gray-50 rounded border">
              <div className="step-title font-bold text-blue-600 mb-2">Passo {index + 1}</div>
              <div className="field mb-2">
                <span className="field-label font-semibold text-gray-800">Descrição:</span>
                <div className="field-value ml-2 mt-1 text-gray-800">
                  {passo.descricao || 'Não informado'}
                </div>
              </div>
              <ExibirImagensMultiplas files={passo.fotos} titulo={`Fotos do Passo ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Causa do Problema */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            CAUSA DO PROBLEMA
          </h3>
          <div className="field mb-3">
            <span className="field-label font-semibold text-gray-800">Descrição:</span>
            <div className="field-value ml-2 mt-1 p-3 bg-gray-50 rounded border text-gray-800">
              {dados.causaDescricao || 'Não informado'}
            </div>
          </div>
          <ExibirImagensMultiplas files={dados.fotosCausa} titulo="Fotos da Causa" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Número da Peça Causadora:</span>
              <span className="field-value ml-2 text-gray-800">{dados.numeroPecaCausadora}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold text-gray-800">Descrição da Peça Causadora:</span>
              <span className="field-value ml-2 text-gray-800">{dados.descricaoPecaCausadora}</span>
            </div>
          </div>
        </div>

        {/* Correção */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            CORREÇÃO
          </h3>
          <div className="field">
            <span className="field-label font-semibold text-gray-800">Descrição:</span>
            <div className="field-value ml-2 mt-1 p-3 bg-gray-50 rounded border text-gray-800">
              {dados.correcaoDescricao || 'Não informado'}
            </div>
          </div>
        </div>

        {/* Fotos Finais */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            FOTOS FINAIS
          </h3>
          <div className="space-y-4">
            <ExibirImagemUnica file={dados.fotoVeiculoSemFalha} titulo="Veículo sem falha" />
            <ExibirImagemUnica file={dados.fotoPecaCausadoraEtiqueta} titulo="Peça Causadora com Etiqueta" />
            <ExibirImagensMultiplas files={dados.fotosPecasInstaladasEtiqueta} titulo="Peças Instaladas com etiqueta" />
            <ExibirImagensMultiplas files={dados.fotosPecasAdicionais} titulo="Peças adicionais" />
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center text-gray-800">
          <p>Laudo gerado automaticamente pelo Sistema de Laudo Técnico</p>
          <p>Data: {new Date().toLocaleDateString('pt-BR')} - Hora: {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}