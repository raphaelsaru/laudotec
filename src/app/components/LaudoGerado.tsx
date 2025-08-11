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

  // Função para converter File para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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

  const handleDownload = async () => {
    const elemento = document.getElementById('laudo-content');
    if (elemento) {
      // Converter todas as imagens para base64 para incluir no HTML
      const imagensBase64: { [key: string]: string } = {};
      
      try {
        // Converter imagens únicas
        if (dados.fotoPainel) {
          imagensBase64.fotoPainel = await fileToBase64(dados.fotoPainel);
        }
        if (dados.fotoChassi) {
          imagensBase64.fotoChassi = await fileToBase64(dados.fotoChassi);
        }
        if (dados.fotoVeiculoSemFalha) {
          imagensBase64.fotoVeiculoSemFalha = await fileToBase64(dados.fotoVeiculoSemFalha);
        }
        if (dados.fotoPecaCausadoraEtiqueta) {
          imagensBase64.fotoPecaCausadoraEtiqueta = await fileToBase64(dados.fotoPecaCausadoraEtiqueta);
        }

        // Converter arrays de imagens
        for (let i = 0; i < dados.fotoSintoma.length; i++) {
          imagensBase64[`fotoSintoma_${i}`] = await fileToBase64(dados.fotoSintoma[i]);
        }
        
        for (let i = 0; i < dados.fotosCausa.length; i++) {
          imagensBase64[`fotosCausa_${i}`] = await fileToBase64(dados.fotosCausa[i]);
        }

        for (let passoIndex = 0; passoIndex < dados.passos.length; passoIndex++) {
          for (let fotoIndex = 0; fotoIndex < dados.passos[passoIndex].fotos.length; fotoIndex++) {
            imagensBase64[`passo_${passoIndex}_foto_${fotoIndex}`] = await fileToBase64(dados.passos[passoIndex].fotos[fotoIndex]);
          }
        }

        for (let i = 0; i < dados.fotosPecasInstaladasEtiqueta.length; i++) {
          imagensBase64[`fotosPecasInstaladasEtiqueta_${i}`] = await fileToBase64(dados.fotosPecasInstaladasEtiqueta[i]);
        }

        for (let i = 0; i < dados.fotosPecasAdicionais.length; i++) {
          imagensBase64[`fotosPecasAdicionais_${i}`] = await fileToBase64(dados.fotosPecasAdicionais[i]);
        }

      } catch (error) {
        console.error('Erro ao converter imagens:', error);
      }

      // Criar HTML com imagens em base64
      let conteudoHtml = elemento.innerHTML;
      
      // Substituir URLs de objeto por base64
      Object.entries(imagensBase64).forEach(([key, base64]) => {
        const regex = new RegExp(`blob:[^"]*`, 'g');
        conteudoHtml = conteudoHtml.replace(regex, base64);
      });

      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${gerarNomeLaudo()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #1f2937; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; border-left: 4px solid #007bff; padding-left: 10px; }
            .field { margin-bottom: 8px; }
            .field-label { font-weight: bold; color: #1f2937; }
            .field-value { margin-left: 10px; color: #1f2937; }
            .step { margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; }
            .step-title { font-weight: bold; color: #007bff; }
            .photo-info { color: #1f2937; font-style: italic; }
            img { max-width: 300px; height: auto; margin: 5px; border: 1px solid #ddd; border-radius: 5px; }
            .image-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          ${conteudoHtml}
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