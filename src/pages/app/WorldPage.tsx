import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { VoxelWorld } from '../../VoxelWorld';
import { Player } from '../../Player';
import { ThirdPersonCamera } from '../../ThirdPersonCamera';
import { PlayerProvider, usePlayer } from '../../PlayerContext';
import { NPCProvider } from '../../NPCContext';
import { InteractionManager } from '../../InteractionManager';
import { Building } from '../../Building';
import { NPC } from '../../NPC';
import { useGameStore } from '../../store/gameStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Award, TrendingUp, Sparkles } from 'lucide-react';

export const WorldPage: React.FC = () => {
  const playerRef = usePlayer();
  const navigate = useNavigate();
  const { currentMission, updateMissionStep, triggerMarketEvent, initializeGame } = useGameStore();

  const [activeDialogue, setActiveDialogue] = useState<{ title: string; body: string; actionText?: string; onAction?: () => void } | null>(null);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleNPC1Interact = () => {
    // Talk to AI Mentor
    if (currentMission && currentMission.id === 'market_awakens' && currentMission.currentStep === 0) {
      updateMissionStep(1);
    }
    setActiveDialogue({
      title: 'AI Mentor - Beginner Village',
      body: 'Welcome to MarketVerse! Financial markets are driven by real-world events and supply shocks. Your first quest is to travel to the News Tower to investigate breaking news regarding Crude Oil prices.',
      actionText: 'View Mission Details',
      onAction: () => navigate('/app/missions'),
    });
  };

  const handleNPC2Interact = () => {
    // Talk to Trader at Stock Exchange
    if (currentMission && currentMission.id === 'market_awakens' && currentMission.currentStep === 2) {
      updateMissionStep(3);
    }
    setActiveDialogue({
      title: 'Floor Trader - Stock Exchange',
      body: 'The market is experiencing high volatility due to energy price spikes! Open the Market Desk to analyze Crude Oil and Gold assets before placing your trade.',
      actionText: 'Open Market Desk',
      onAction: () => navigate('/app/market'),
    });
  };

  const handleNPC3Interact = () => {
    // Talk to News Reporter at News Tower
    if (currentMission && currentMission.id === 'market_awakens' && currentMission.currentStep === 1) {
      updateMissionStep(2);
      triggerMarketEvent({
        id: 'oil_surge_event',
        title: 'CRUDE OIL PRICES SURGE 7%',
        description: 'Geopolitical tensions and supply bottlenecks cause energy prices to spike dramatically.',
        impact: { oil: 7, tech: -2, retail: -1, gold: 3.5 },
        category: 'GEOPOLITICAL',
        severity: 'HIGH',
        timestamp: Date.now(),
        duration: 0,
        affectedSectors: ['Energy', 'Technology', 'Consumer'],
      });
    }

    setActiveDialogue({
      title: 'News Anchor - News Tower',
      body: 'BREAKING NEWS: Global Crude Oil supply constraints have triggered a 7% surge in energy futures! Safe haven assets like Gold are rallying, while Tech and Retail sectors face cost margin pressures.',
      actionText: 'Proceed to Stock Exchange',
      onAction: () => {
        updateMissionStep(3);
        navigate('/app/market');
      },
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* 3D R3F Canvas */}
      <PlayerProvider playerRef={playerRef}>
        <NPCProvider>
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[20, 40, 20]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
            <VoxelWorld />
            <Player ref={playerRef} />
            <ThirdPersonCamera />
            <InteractionManager />

            {/* 8 World Buildings */}
            <Building type="house" position={[-20, 0, -20]} name="Beginner Village" />
            <Building type="market" position={[20, 0, 20]} name="Market City Hub" />
            <Building type="stock" position={[40, 0, 0]} name="Stock Exchange" />
            <Building type="news" position={[-40, 0, 0]} name="News Tower" />
            <Building type="forest" position={[0, 0, 40]} name="Learning Forest" />
            <Building type="risk" position={[-40, 0, 40]} name="Risk Mountains" />
            <Building type="psychology" position={[40, 0, -40]} name="Psychology Caverns" />
            <Building type="castle" position={[0, 0, -40]} name="Portfolio Castle" />

            {/* Interactive NPCs */}
            <NPC position={[-18, 0, -18]} name="AI Mentor" role="Educational Guide" onInteract={handleNPC1Interact} />
            <NPC position={[38, 0, 2]} name="Floor Trader" role="Market Execution" onInteract={handleNPC2Interact} />
            <NPC position={[-38, 0, 2]} name="News Anchor" role="Breaking Headlines" onInteract={handleNPC3Interact} />
          </Canvas>
        </NPCProvider>
      </PlayerProvider>

      {/* HUD Overlay - Top Active Mission Banner */}
      {currentMission && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xl text-xs z-10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{currentMission.title}</span>
              <Badge variant="emerald">Step {currentMission.currentStep + 1}/{currentMission.totalSteps}</Badge>
            </div>
            <p className="text-slate-300 text-[11px] truncate">
              {currentMission.steps[currentMission.currentStep]?.instruction || 'Explore MarketVerse'}
            </p>
          </div>
        </div>
      )}

      {/* HUD Overlay - Bottom Controls Help Bar */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-4 z-10 select-none">
        <span className="flex items-center gap-1 font-mono"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">WASD</kbd> Move</span>
        <span className="flex items-center gap-1 font-mono"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Shift</kbd> Sprint</span>
        <span className="flex items-center gap-1 font-mono"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Space</kbd> Jump</span>
        <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold"><kbd className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">E</kbd> Interact</span>
      </div>

      {/* NPC Dialogue Modal */}
      <Modal
        isOpen={Boolean(activeDialogue)}
        onClose={() => setActiveDialogue(null)}
        title={activeDialogue?.title || 'Dialogue'}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed">{activeDialogue?.body}</p>
          {activeDialogue?.actionText && (
            <Button
              variant="primary"
              className="w-full font-bold"
              onClick={() => {
                const action = activeDialogue.onAction;
                setActiveDialogue(null);
                if (action) action();
              }}
            >
              {activeDialogue.actionText}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};
