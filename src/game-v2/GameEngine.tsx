import React, { useRef, useState, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Award, TrendingUp, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

// ============================================================
// 1. GAME ERROR BOUNDARY (FAILSAFE - NO BLANK SCREENS)
// ============================================================
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GameErrorBoundary extends Component<{ children: ReactNode; onRetry?: () => void }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('MarketVerse 3D Game Engine Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[500px] bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">MARKETVERSE FAILED TO LOAD</h2>
          <p className="text-xs text-slate-400 max-w-md">
            The 3D rendering context encountered a WebGL exception: {this.state.error?.message || 'Unknown R3F error'}
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onRetry) this.props.onRetry();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Retry Loading 3D World
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// 2. 3D VOXEL GROUND & ENVIRONMENT
// ============================================================
function WorldEnvironment() {
  return (
    <group>
      {/* Voxel Terrain Ground Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      <gridHelper args={[120, 60, '#10b981', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Decorative Voxel Trees */}
      {[-30, -10, 10, 30].map((x, i) =>
        [-30, 30].map((z, j) => (
          <group key={`tree_${i}_${j}`} position={[x, 0, z]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[0.6, 3, 0.6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 3.5, 0]} castShadow>
              <boxGeometry args={[2.5, 2.5, 2.5]} />
              <meshStandardMaterial color="#059669" />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

// ============================================================
// 3. 3D VOXEL BUILDINGS WITH HTML LABELS
// ============================================================
interface BuildingProps {
  position: [number, number, number];
  title: string;
  color: string;
  height: number;
  width?: number;
  depth?: number;
  badge: string;
}

function VoxelBuilding({ position, title, color, height, width = 6, depth = 6, badge }: BuildingProps) {
  return (
    <group position={position}>
      {/* Main Building Block */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Roof Edge / Accent */}
      <mesh position={[0, height + 0.3, 0]}>
        <boxGeometry args={[width + 0.6, 0.6, depth + 0.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Floating 3D HTML Label */}
      <Html position={[0, height + 2, 0]} center distanceFactor={20}>
        <div className="bg-slate-950/90 text-white border border-slate-700 px-3 py-1.5 rounded-lg shadow-xl text-center select-none whitespace-nowrap pointer-events-none">
          <div className="text-xs font-bold font-mono text-slate-100">{title}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{badge}</div>
        </div>
      </Html>
    </group>
  );
}

// ============================================================
// 4. PLAYER CHARACTER & WASD PHYSICS CONTROLLER
// ============================================================
interface PlayerProps {
  onPositionChange?: (pos: THREE.Vector3) => void;
}

function VoxelPlayer({ onPositionChange }: PlayerProps) {
  const meshRef = useRef<THREE.Group>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocityY = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const player = meshRef.current;
    if (!player) return;

    const moveZ = (keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : 0) - (keys.current['KeyS'] || keys.current['ArrowDown'] ? 1 : 0);
    const moveX = (keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : 0) - (keys.current['KeyA'] || keys.current['ArrowLeft'] ? 1 : 0);
    const isSprinting = Boolean(keys.current['ShiftLeft'] || keys.current['ShiftRight']);
    const speed = isSprinting ? 12 : 7;

    const dir = new THREE.Vector3(moveX, 0, moveZ);
    if (dir.lengthSq() > 0) dir.normalize();

    player.position.x += dir.x * speed * delta;
    player.position.z += dir.z * speed * delta;

    // Jump logic
    if (keys.current['Space'] && player.position.y <= 1.05) {
      velocityY.current = 8;
    }

    velocityY.current -= 20 * delta;
    player.position.y += velocityY.current * delta;

    if (player.position.y <= 1.0) {
      player.position.y = 1.0;
      velocityY.current = 0;
    }

    if (dir.lengthSq() > 0) {
      const angle = Math.atan2(dir.x, dir.z);
      player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, angle, 0.2);
    }

    if (onPositionChange) {
      onPositionChange(player.position);
    }
  });

  return (
    <group ref={meshRef} position={[0, 1, 0]}>
      {/* Voxel Torso */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 1.0, 0.5]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} />
      </mesh>
      {/* Voxel Head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.9, 0.2]}>
        <boxGeometry args={[0.5, 0.2, 0.15]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ============================================================
// 5. THIRD PERSON CAMERA CONTROLLER
// ============================================================
function CameraFollow({ playerPos }: { playerPos: THREE.Vector3 }) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(0, 5, -9));

  useFrame(() => {
    if (!playerPos) return;
    const targetPos = playerPos.clone().add(offset.current);
    camera.position.lerp(targetPos, 0.1);
    camera.lookAt(playerPos.clone().add(new THREE.Vector3(0, 1.2, 0)));
  });

  return null;
}

// ============================================================
// 6. INTERACTIVE NPC MENTOR COMPONENT
// ============================================================
function NPCMentor({ position, onInteract }: { position: [number, number, number]; onInteract: () => void }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.6]} />
        <meshStandardMaterial color="#10b981" roughness={0.2} emissive="#047857" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      <Html position={[0, 2.7, 0]} center distanceFactor={16}>
        <div className="flex flex-col items-center bg-slate-900/95 text-white px-3 py-1.5 rounded-lg border border-emerald-500/50 shadow-2xl text-xs select-none whitespace-nowrap pointer-events-none">
          <span className="font-bold text-emerald-400">AI MARKET MENTOR</span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40 mt-0.5">Press [E] to Talk</span>
        </div>
      </Html>
    </group>
  );
}

// ============================================================
// 7. MAIN GAME ENGINE COMPONENT (EXPORTED)
// ============================================================
export interface GameEngineProps {
  isTestRoute?: boolean;
}

export const GameEngine: React.FC<GameEngineProps> = ({ isTestRoute = false }) => {
  const navigate = useNavigate();
  const { currentMission, updateMissionStep, triggerMarketEvent, xp, cash } = useGameStore();

  const [playerPos, setPlayerPos] = useState<THREE.Vector3>(new THREE.Vector3(0, 1, 0));
  const [activeDialogue, setActiveDialogue] = useState<boolean>(false);
  const [keys, setKeys] = useState<{ e: boolean }>({ e: false });

  // Key press E detection for interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const npcPos = new THREE.Vector3(-12, 1, -12);
        if (playerPos.distanceTo(npcPos) < 7.0) {
          setActiveDialogue(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos]);

  return (
    <GameErrorBoundary>
      <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
        {/* R3F 3D Canvas */}
        <Canvas shadows camera={{ position: [0, 6, 12], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[30, 50, 30]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />

          {/* World Elements */}
          <WorldEnvironment />

          {/* 8 MarketVerse Building Structures */}
          <VoxelBuilding position={[-15, 0, -15]} title="Beginner Village" color="#8b4513" height={4} badge="SPAWN PLAZA" />
          <VoxelBuilding position={[25, 0, 0]} title="Stock Exchange" color="#1e40af" height={16} width={8} depth={8} badge="TRADING TOWER" />
          <VoxelBuilding position={[-25, 0, 0]} title="News Tower" color="#dc2626" height={18} width={6} depth={6} badge="HEADLINES" />
          <VoxelBuilding position={[0, 0, 25]} title="Learning House" color="#065f46" height={6} badge="CURRICULUM" />
          <VoxelBuilding position={[-25, 0, 25]} title="Risk District" color="#581c87" height={10} badge="DRAWDOWN ANALYTICS" />
          <VoxelBuilding position={[25, 0, -25]} title="Psychology Center" color="#312e81" height={8} badge="BEHAVIORAL LAB" />
          <VoxelBuilding position={[0, 0, -25]} title="Portfolio Castle" color="#0f766e" height={12} width={10} depth={10} badge="VAULT & BADGES" />
          <VoxelBuilding position={[15, 0, 15]} title="Market City Plaza" color="#d97706" height={6} width={8} depth={8} badge="CENTRAL COMMERCE" />

          {/* Interactive NPC Mentor */}
          <NPCMentor position={[-12, 0, -12]} onInteract={() => setActiveDialogue(true)} />

          {/* Player & Camera */}
          <VoxelPlayer onPositionChange={(pos) => setPlayerPos(pos.clone())} />
          <CameraFollow playerPos={playerPos} />
        </Canvas>

        {/* HUD Overlay - Top Active Mission Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-emerald-500/40 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xl text-xs z-10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{currentMission?.title || 'The Market Awakens'}</span>
              <Badge variant="emerald">Step {currentMission ? currentMission.currentStep + 1 : 1}/5</Badge>
            </div>
            <p className="text-slate-300 text-[11px] truncate">
              {currentMission?.steps[currentMission.currentStep]?.instruction || 'Approach AI Mentor in Beginner Village and press [E].'}
            </p>
          </div>
        </div>

        {/* HUD Overlay - Bottom Controls Bar */}
        <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-4 z-10 select-none">
          <span className="flex items-center gap-1 font-mono"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">WASD</kbd> Move</span>
          <span className="flex items-center gap-1 font-mono"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Shift</kbd> Sprint</span>
          <span className="flex items-center gap-1 font-mono"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Space</kbd> Jump</span>
          <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold"><kbd className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">E</kbd> Talk to NPC</span>
        </div>

        {/* Interactive NPC Dialogue Modal */}
        <Modal
          isOpen={activeDialogue}
          onClose={() => setActiveDialogue(false)}
          title="AI Market Mentor — Beginner Village"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-200 leading-relaxed">
              "Welcome to MarketVerse, Trader! Before executing orders, learn to understand how geopolitical events influence market regimes. Your first quest is to analyze the Crude Oil supply shock event."
            </p>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                className="w-full font-bold text-xs"
                onClick={() => {
                  updateMissionStep(1);
                  triggerMarketEvent({
                    id: 'oil_surge',
                    title: 'CRUDE OIL PRICES SURGE 7%',
                    description: 'Geopolitical tensions and supply bottlenecks cause energy prices to spike.',
                    impact: { oil: 7, tech: -2, retail: -1, gold: 3.5 },
                    category: 'GEOPOLITICAL',
                    severity: 'HIGH',
                    timestamp: Date.now(),
                    duration: 0,
                    affectedSectors: ['Energy', 'Technology'],
                  });
                  setActiveDialogue(false);
                  navigate('/app/market');
                }}
              >
                [START MISSION & OPEN MARKET DESK]
              </Button>

              <Button
                variant="secondary"
                className="w-full text-xs"
                onClick={() => {
                  setActiveDialogue(false);
                  navigate('/app/mentor');
                }}
              >
                [ASK ABOUT DOWNSIDE RISK]
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </GameErrorBoundary>
  );
};
