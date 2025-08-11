'use client';

import { useState } from 'react';
import { FormularioLaudo } from './components/FormularioLaudo';
import { LaudoGerado } from './components/LaudoGerado';

export interface DadosLaudo {
  // Identificação
  chassi: string;
  numeroOS: string;
  prmsNumero: string;
  veiculoModificado: 'sim' | 'nao' | '';
  blockFlagAtivado: 'sim' | 'nao' | '';
  abertoPRMS: 'sim' | 'nao' | '';
  
  // Fotos Iniciais
  fotoPainel: File | null;
  fotoChassi: File | null;
  
  // Reclamação do Cliente
  reclamacaoDescricao: string;
  fotoSintoma: File[];
  
  // Método de Diagnóstico
  passos: Array<{
    descricao: string;
    fotos: File[];
  }>;
  
  // Causa do Problema
  causaDescricao: string;
  fotosCausa: File[];
  numeroPecaCausadora: string;
  descricaoPecaCausadora: string;
  
  // Correção
  correcaoDescricao: string;
  
  // Fotos Finais
  fotoVeiculoSemFalha: File | null;
  fotoPecaCausadoraEtiqueta: File | null;
  fotosPecasInstaladasEtiqueta: File[];
  fotosPecasAdicionais: File[];
}

export default function Home() {
  const [dadosLaudo, setDadosLaudo] = useState<DadosLaudo | null>(null);
  const [mostrarLaudo, setMostrarLaudo] = useState(false);

  const handleGerarLaudo = (dados: DadosLaudo) => {
    setDadosLaudo(dados);
    setMostrarLaudo(true);
  };

  const handleVoltarFormulario = () => {
    setMostrarLaudo(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900" >
            Sistema de Laudo Técnico
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!mostrarLaudo ? (
          <FormularioLaudo onGerarLaudo={handleGerarLaudo} />
        ) : (
          dadosLaudo && (
            <LaudoGerado 
              dados={dadosLaudo} 
              onVoltar={handleVoltarFormulario}
            />
          )
        )}
      </main>
    </div>
  );
}
