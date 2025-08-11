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

  const handleDownload = () => {
    const elemento = document.getElementById('laudo-content');
    if (elemento) {
      const conteudo = elemento.innerHTML;
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${gerarNomeLaudo()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; border-left: 4px solid #007bff; padding-left: 10px; }
            .field { margin-bottom: 8px; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { margin-left: 10px; }
            .step { margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; }
            .step-title { font-weight: bold; color: #007bff; }
            .photo-info { color: #666; font-style: italic; }
          </style>
        </head>
        <body>
          ${conteudo}
        </body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gerarNomeLaudo()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900">Laudo Técnico Gerado</h2>
        <div className="space-x-3">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download HTML
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LAUDO TÉCNICO</h1>
          <h2 className="text-xl text-gray-700">{gerarNomeLaudo()}</h2>
          <p className="text-gray-600 mt-2">Data de Geração: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Identificação */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            IDENTIFICAÇÃO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <span className="field-label font-semibold">Chassi (VIN):</span>
              <span className="field-value ml-2">{dados.chassi}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Número da OS:</span>
              <span className="field-value ml-2">{dados.numeroOS}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">PRMS Nº:</span>
              <span className="field-value ml-2">{formatarResposta(dados.prmsNumero)}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Veículo Modificado:</span>
              <span className="field-value ml-2">{formatarResposta(dados.veiculoModificado)}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Block Flag Ativado:</span>
              <span className="field-value ml-2">{formatarResposta(dados.blockFlagAtivado)}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Aberto PRMS:</span>
              <span className="field-value ml-2">{formatarResposta(dados.abertoPRMS)}</span>
            </div>
          </div>
        </div>

        {/* Fotos Iniciais */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            FOTOS INICIAIS
          </h3>
          <div className="space-y-2">
            <div className="field">
              <span className="field-label font-semibold">Foto do Painel de Instrumentos:</span>
              <span className="photo-info ml-2 text-gray-600 italic">
                {dados.fotoPainel ? `Arquivo: ${dados.fotoPainel.name}` : 'Não anexado'}
              </span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Foto do Chassi (VIN):</span>
              <span className="photo-info ml-2 text-gray-600 italic">
                {dados.fotoChassi ? `Arquivo: ${dados.fotoChassi.name}` : 'Não anexado'}
              </span>
            </div>
          </div>
        </div>

        {/* Reclamação do Cliente */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            RECLAMAÇÃO DO CLIENTE
          </h3>
          <div className="field mb-3">
            <span className="field-label font-semibold">Descrição:</span>
            <div className="field-value ml-2 mt-1 p-3 bg-gray-50 rounded border">
              {dados.reclamacaoDescricao || 'Não informado'}
            </div>
          </div>
          <div className="field">
            <span className="field-label font-semibold">Fotos do Sintoma:</span>
            <span className="photo-info ml-2 text-gray-600 italic">
              {dados.fotoSintoma.length > 0 
                ? `${dados.fotoSintoma.length} arquivo(s) anexado(s)` 
                : 'Nenhum arquivo anexado'}
            </span>
          </div>
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
                <span className="field-label font-semibold">Descrição:</span>
                <div className="field-value ml-2 mt-1">
                  {passo.descricao || 'Não informado'}
                </div>
              </div>
              <div className="field">
                <span className="field-label font-semibold">Fotos:</span>
                <span className="photo-info ml-2 text-gray-600 italic">
                  {passo.fotos.length > 0 
                    ? `${passo.fotos.length} arquivo(s) anexado(s)` 
                    : 'Nenhum arquivo anexado'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Causa do Problema */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            CAUSA DO PROBLEMA
          </h3>
          <div className="field mb-3">
            <span className="field-label font-semibold">Descrição:</span>
            <div className="field-value ml-2 mt-1 p-3 bg-gray-50 rounded border">
              {dados.causaDescricao || 'Não informado'}
            </div>
          </div>
          <div className="field mb-3">
            <span className="field-label font-semibold">Fotos da Causa:</span>
            <span className="photo-info ml-2 text-gray-600 italic">
              {dados.fotosCausa.length > 0 
                ? `${dados.fotosCausa.length} arquivo(s) anexado(s)` 
                : 'Nenhum arquivo anexado'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <span className="field-label font-semibold">Número da Peça Causadora:</span>
              <span className="field-value ml-2">{dados.numeroPecaCausadora}</span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Descrição da Peça Causadora:</span>
              <span className="field-value ml-2">{dados.descricaoPecaCausadora}</span>
            </div>
          </div>
        </div>

        {/* Correção */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            CORREÇÃO
          </h3>
          <div className="field">
            <span className="field-label font-semibold">Descrição:</span>
            <div className="field-value ml-2 mt-1 p-3 bg-gray-50 rounded border">
              {dados.correcaoDescricao || 'Não informado'}
            </div>
          </div>
        </div>

        {/* Fotos Finais */}
        <div className="section mb-6">
          <h3 className="section-title text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            FOTOS FINAIS
          </h3>
          <div className="space-y-2">
            <div className="field">
              <span className="field-label font-semibold">Veículo sem falha:</span>
              <span className="photo-info ml-2 text-gray-600 italic">
                {dados.fotoVeiculoSemFalha ? `Arquivo: ${dados.fotoVeiculoSemFalha.name}` : 'Não anexado'}
              </span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Peça Causadora com Etiqueta:</span>
              <span className="photo-info ml-2 text-gray-600 italic">
                {dados.fotoPecaCausadoraEtiqueta ? `Arquivo: ${dados.fotoPecaCausadoraEtiqueta.name}` : 'Não anexado'}
              </span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Peças Instaladas com etiqueta:</span>
              <span className="photo-info ml-2 text-gray-600 italic">
                {dados.fotosPecasInstaladasEtiqueta.length > 0 
                  ? `${dados.fotosPecasInstaladasEtiqueta.length} arquivo(s) anexado(s)` 
                  : 'Nenhum arquivo anexado'}
              </span>
            </div>
            <div className="field">
              <span className="field-label font-semibold">Peças adicionais:</span>
              <span className="photo-info ml-2 text-gray-600 italic">
                {dados.fotosPecasAdicionais.length > 0 
                  ? `${dados.fotosPecasAdicionais.length} arquivo(s) anexado(s)` 
                  : 'Nenhum arquivo anexado'}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center text-gray-600">
          <p>Laudo gerado automaticamente pelo Sistema de Laudo Técnico</p>
          <p>Data: {new Date().toLocaleDateString('pt-BR')} - Hora: {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}