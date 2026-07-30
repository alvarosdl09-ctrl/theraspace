import React from 'react';
import TherapyCanvas from './TherapyCanvas';

function App() {
  // Simulando um ID de sala padrão para visualização no portfólio
  const sampleRoomId = "sala-demonstracao-123";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-sky-700">TheraSpace MVP</h1>
        <p className="text-slate-600 mt-1">Plataforma de Sessões Terapêuticas Interativas em Tempo Real</p>
      </header>

      <main className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <TherapyCanvas roomId={sampleRoomId} />
      </main>

      <footer className="mt-8 text-xs text-slate-400">
        Desenvolvido para portfólio profissional • React + Supabase + Konva.js
      </footer>
    </div>
  );
}

export default App;
