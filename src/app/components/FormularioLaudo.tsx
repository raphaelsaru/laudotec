'use client';

import { useState } from 'react';
import { DadosLaudo } from '../page';
import Image from 'next/image';

interface Props {
  onGerarLaudo: (dados: DadosLaudo) => void;
}

export function FormularioLaudo({ onGerarLaudo }: Props) {
  const [dados, setDados] = useState<DadosLaudo>({
    chassi: '',
    numeroOS: '',
    prmsNumero: '',
    veiculoModificado: '',
    blockFlagAtivado: '',
    abertoPRMS: '',
    fotoPainel: null,
    fotoChassi: null,
    reclamacaoDescricao: '',
    fotoSintoma: [],
    passos: [{ descricao: '', fotos: [] }],
    causaDescricao: '',
    fotosCausa: [],
    numeroPecaCausadora: '',
    descricaoPecaCausadora: '',
    correcaoDescricao: '',
    fotoVeiculoSemFalha: null,
    fotoPecaCausadoraEtiqueta: null,
    fotosPecasInstaladasEtiqueta: [],
    fotosPecasAdicionais: [],
  });

  const handleInputChange = (field: keyof DadosLaudo, value: string | File | File[] | null) => {
    setDados(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof DadosLaudo, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'fotoPainel' || field === 'fotoChassi' || field === 'fotoVeiculoSemFalha' || field === 'fotoPecaCausadoraEtiqueta') {
      handleInputChange(field, files[0] || null);
    } else {
      handleInputChange(field, Array.from(files));
    }
  };

  const adicionarPasso = () => {
    if (dados.passos.length < 5) {
      setDados(prev => ({
        ...prev,
        passos: [...prev.passos, { descricao: '', fotos: [] }]
      }));
    }
  };

  const removerPasso = (index: number) => {
    if (dados.passos.length > 1) {
      setDados(prev => ({
        ...prev,
        passos: prev.passos.filter((_, i) => i !== index)
      }));
    }
  };

  const atualizarPasso = (index: number, campo: 'descricao' | 'fotos', valor: string | File[]) => {
    setDados(prev => ({
      ...prev,
      passos: prev.passos.map((passo, i) => 
        i === index ? { ...passo, [campo]: valor } : passo
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGerarLaudo(dados);
  };

  const validarFormulario = () => {
    return dados.chassi && dados.numeroOS && dados.numeroPecaCausadora && dados.descricaoPecaCausadora;
  };

  // Função para criar URL de preview da imagem
  const criarUrlPreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Componente para preview de imagem única
  const PreviewImagemUnica = ({ file, onRemover }: { file: File | null, onRemover: () => void }) => {
    if (!file) return null;
    
    return (
      <div className="mt-2 relative inline-block">
        <Image 
          src={criarUrlPreview(file)} 
          alt="Preview" 
          width={128}
          height={128}
          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
          unoptimized
        />
        <button
          type="button"
          onClick={onRemover}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      </div>
    );
  };

  // Componente para preview de múltiplas imagens
  const PreviewImagensMultiplas = ({ files, onRemover }: { files: File[], onRemover: (index: number) => void }) => {
    if (files.length === 0) return null;
    
    return (
      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <Image 
              src={criarUrlPreview(file)} 
              alt={`Preview ${index + 1}`} 
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onRemover(index)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Identificação */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Identificação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chassi (VIN) *
            </label>
            <input
              type="text"
              value={dados.chassi}
              onChange={(e) => handleInputChange('chassi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número da OS *
            </label>
            <input
              type="text"
              value={dados.numeroOS}
              onChange={(e) => handleInputChange('numeroOS', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PRMS Nº
            </label>
            <input
              type="text"
              value={dados.prmsNumero}
              onChange={(e) => handleInputChange('prmsNumero', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Veículo Modificado?
            </label>
            <select
              value={dados.veiculoModificado}
              onChange={(e) => handleInputChange('veiculoModificado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block Flag Ativado?
            </label>
            <select
              value={dados.blockFlagAtivado}
              onChange={(e) => handleInputChange('blockFlagAtivado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aberto PRMS?
            </label>
            <select
              value={dados.abertoPRMS}
              onChange={(e) => handleInputChange('abertoPRMS', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fotos Iniciais */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Fotos Iniciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto do Painel de Instrumentos
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('fotoPainel', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagemUnica 
              file={dados.fotoPainel} 
              onRemover={() => handleInputChange('fotoPainel', null)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto do Chassi (VIN)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('fotoChassi', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagemUnica 
              file={dados.fotoChassi} 
              onRemover={() => handleInputChange('fotoChassi', null)}
            />
          </div>
        </div>
      </div>

      {/* Reclamação do Cliente */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Reclamação do Cliente</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Reclamação
            </label>
            <textarea
              value={dados.reclamacaoDescricao}
              onChange={(e) => handleInputChange('reclamacaoDescricao', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Descreva a reclamação do cliente..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fotos do Sintoma
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange('fotoSintoma', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagensMultiplas 
              files={dados.fotoSintoma} 
              onRemover={(index) => {
                const novasFotos = dados.fotoSintoma.filter((_, i) => i !== index);
                handleInputChange('fotoSintoma', novasFotos);
              }}
            />
          </div>
        </div>
      </div>

      {/* Método de Diagnóstico */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Método de Diagnóstico</h2>
        {dados.passos.map((passo, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-800">Passo {index + 1}</h3>
              {dados.passos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerPasso(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remover Passo
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Passo
                </label>
                <textarea
                  value={passo.descricao}
                  onChange={(e) => atualizarPasso(index, 'descricao', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Descreva o passo do diagnóstico..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotos do Passo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      atualizarPasso(index, 'fotos', Array.from(e.target.files));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <PreviewImagensMultiplas 
                  files={passo.fotos} 
                  onRemover={(fotoIndex) => {
                    const novasFotos = passo.fotos.filter((_, i) => i !== fotoIndex);
                    atualizarPasso(index, 'fotos', novasFotos);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        
        {dados.passos.length < 5 && (
          <button
            type="button"
            onClick={adicionarPasso}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
          >
            + Adicionar Passo
          </button>
        )}
      </div>

      {/* Causa do Problema */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Causa do Problema</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Causa
            </label>
            <textarea
              value={dados.causaDescricao}
              onChange={(e) => handleInputChange('causaDescricao', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Descreva a causa do problema..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fotos da Causa
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange('fotosCausa', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagensMultiplas 
              files={dados.fotosCausa} 
              onRemover={(index) => {
                const novasFotos = dados.fotosCausa.filter((_, i) => i !== index);
                handleInputChange('fotosCausa', novasFotos);
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número da Peça Causadora *
              </label>
              <input
                type="text"
                value={dados.numeroPecaCausadora}
                onChange={(e) => handleInputChange('numeroPecaCausadora', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição da Peça Causadora *
              </label>
              <input
                type="text"
                value={dados.descricaoPecaCausadora}
                onChange={(e) => handleInputChange('descricaoPecaCausadora', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Correção */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Correção</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição da Correção
          </label>
          <textarea
            value={dados.correcaoDescricao}
            onChange={(e) => handleInputChange('correcaoDescricao', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Descreva a correção aplicada..."
          />
        </div>
      </div>

      {/* Fotos Finais */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Fotos Finais</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Veículo sem falha
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('fotoVeiculoSemFalha', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagemUnica 
              file={dados.fotoVeiculoSemFalha} 
              onRemover={() => handleInputChange('fotoVeiculoSemFalha', null)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peça Causadora com Etiqueta
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('fotoPecaCausadoraEtiqueta', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagemUnica 
              file={dados.fotoPecaCausadoraEtiqueta} 
              onRemover={() => handleInputChange('fotoPecaCausadoraEtiqueta', null)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peças Instaladas com etiqueta
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange('fotosPecasInstaladasEtiqueta', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagensMultiplas 
              files={dados.fotosPecasInstaladasEtiqueta} 
              onRemover={(index) => {
                const novasFotos = dados.fotosPecasInstaladasEtiqueta.filter((_, i) => i !== index);
                handleInputChange('fotosPecasInstaladasEtiqueta', novasFotos);
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peças adicionais
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange('fotosPecasAdicionais', e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <PreviewImagensMultiplas 
              files={dados.fotosPecasAdicionais} 
              onRemover={(index) => {
                const novasFotos = dados.fotosPecasAdicionais.filter((_, i) => i !== index);
                handleInputChange('fotosPecasAdicionais', novasFotos);
              }}
            />
          </div>
        </div>
      </div>

      {/* Botão de Gerar Laudo */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!validarFormulario()}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          Gerar Laudo
        </button>
      </div>
    </form>
  );
}