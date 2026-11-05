'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  RotateCcw,
  Volume2,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  Shield,
  Crown,
  Coins,
  Heart,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { TextbookChapter, Subject } from '@/lib/db/types';

export type RobloxGameMode = 'obby' | 'kart' | 'tycoon' | 'treasure';

interface RobloxWorldGames3DProps {
  initialMode?: RobloxGameMode;
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
  isUKG?: boolean;
}

interface OutfitPreset {
  id: string;
  name: string;
  torsoColor: number;
  legsColor: number;
  headColor: number;
  armsColor: number;
  hatColor: number;
  badgeEmoji: string;
}

const OUTFITS: OutfitPreset[] = [
  {
    id: 'hero',
    name: 'Cyber Blox Hero',
    torsoColor: 0x2563eb,
    legsColor: 0x1e293b,
    headColor: 0xfde047,
    armsColor: 0xfde047,
    hatColor: 0xef4444,
    badgeEmoji: '🦸‍♂️',
  },
  {
    id: 'ninja',
    name: 'Shadow Ninja',
    torsoColor: 0x111827,
    legsColor: 0x1f2937,
    headColor: 0xfcd34d,
    armsColor: 0xef4444,
    hatColor: 0xef4444,
    badgeEmoji: '🥷',
  },
  {
    id: 'astro',
    name: 'Galaxy Astronaut',
    torsoColor: 0xf8fafc,
    legsColor: 0xe2e8f0,
    headColor: 0x38bdf8,
    armsColor: 0xf8fafc,
    hatColor: 0xf59e0b,
    badgeEmoji: '👨‍🚀',
  },
  {
    id: 'royal',
    name: 'Golden Knight',
    torsoColor: 0xf59e0b,
    legsColor: 0x78350f,
    headColor: 0xfde047,
    armsColor: 0xfbbf24,
    hatColor: 0xa855f7,
    badgeEmoji: '👑',
  },
];

interface QuizGateData {
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
}

function generateQuizQuestions(
  chapter?: TextbookChapter | null,
  subject?: Subject | null,
  isUKG?: boolean
): QuizGateData[] {
  const list: QuizGateData[] = [];

  if (chapter && chapter.keyTerms && chapter.keyTerms.length >= 2) {
    const terms = chapter.keyTerms;
    const topics = chapter.topics && chapter.topics.length > 0 ? chapter.topics : [chapter.title];

    terms.forEach((term, idx) => {
      const wrongTerm = terms[(idx + 1) % terms.length] || 'None';
      const clue = topics[idx % topics.length] || `Key concept in ${chapter.title}`;
      list.push({
        question: `Find the match: "${clue.slice(0, 48)}"`,
        correctAnswer: term,
        wrongAnswer: wrongTerm,
      });
    });
  }

  if (isUKG) {
    list.push(
      { question: '🍎 Apple starts with which letter?', correctAnswer: 'Letter A', wrongAnswer: 'Letter Z' },
      { question: '🔢 What is 2 + 2?', correctAnswer: '4', wrongAnswer: '7' },
      { question: '🐶 Which animal says Woof?', correctAnswer: 'Dog', wrongAnswer: 'Cat' },
      { question: '🌈 What color is the sunny sky?', correctAnswer: 'Blue', wrongAnswer: 'Purple' },
      { question: '🔢 Count: 3 + 1 = ?', correctAnswer: '4', wrongAnswer: '2' }
    );
  } else {
    list.push(
      { question: '⚡ Math Boost: What is 6 × 4?', correctAnswer: '24', wrongAnswer: '18' },
      { question: '🌍 Which planet do we live on?', correctAnswer: 'Earth', wrongAnswer: 'Mars' },
      { question: '🌱 Plants make food using?', correctAnswer: 'Sunlight', wrongAnswer: 'Moonlight' },
      { question: '🔢 What is 15 + 15?', correctAnswer: '30', wrongAnswer: '25' },
      { question: '💻 The brain of a computer is?', correctAnswer: 'CPU', wrongAnswer: 'Mouse' }
    );
  }

  return list;
}

// Helper to create 3D floating text label banner using CanvasTexture
function createLabelSprite(
  text: string,
  bgColor = '#1e293b',
  borderColor = '#38bdf8',
  textColor = '#ffffff',
  scaleWidth = 3.6,
  scaleHeight = 1.1
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '900 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const clean = text.length > 22 ? text.slice(0, 20) + '..' : text;
    ctx.fillText(clean, 256, 82);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scaleWidth, scaleHeight, 1);
  return sprite;
}

// Build a classic Roblox blocky R6/R15 style character rig
function createRobloxCharacter(outfit: OutfitPreset, playerName: string) {
  const group = new THREE.Group();

  // Stud/smooth plastic material helper
  const makePlastic = (color: number, roughness = 0.25) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.1 });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.25, 0.55), makePlastic(outfit.torsoColor));
  torso.position.y = 1.65;
  torso.castShadow = true;
  group.add(torso);

  // Chest Decal / Star Emblem
  const emblem = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.45, 0.58),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.3 })
  );
  emblem.position.y = 1.72;
  group.add(emblem);

  // Head (Blocky cylinder/rounded box look)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.68, 0);

  const headMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.72, 20), makePlastic(outfit.headColor));
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Classic Roblox Face (Eyes + Happy Smile) on front (-Z is forward in game, so place on both or -Z)
  const eyeGeo = new THREE.SphereGeometry(0.06, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.14, 0.08, -0.39);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.14, 0.08, -0.39);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0x0f172a })
  );
  smile.rotation.x = Math.PI;
  smile.position.set(0, -0.04, -0.39);
  headGroup.add(eyeL, eyeR, smile);

  // Cool Roblox Cap / Visor Crown
  const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.14, 0.92), makePlastic(outfit.hatColor));
  hatBrim.position.y = 0.38;
  const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), makePlastic(0xfacc15));
  hatTop.position.y = 0.52;
  headGroup.add(hatBrim, hatTop);

  group.add(headGroup);

  // Limbs with pivot at top so they swing naturally like Roblox avatars
  const makeLimb = (w: number, h: number, d: number, color: number, x: number, y: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), makePlastic(color));
    mesh.position.y = -h / 2;
    mesh.castShadow = true;
    pivot.add(mesh);
    group.add(pivot);
    return pivot;
  };

  const leftArm = makeLimb(0.45, 1.15, 0.48, outfit.armsColor, -0.82, 2.2);
  const rightArm = makeLimb(0.45, 1.15, 0.48, outfit.armsColor, 0.82, 2.2);
  const leftLeg = makeLimb(0.5, 1.05, 0.52, outfit.legsColor, -0.28, 1.05);
  const rightLeg = makeLimb(0.5, 1.05, 0.52, outfit.legsColor, 0.28, 1.05);

  // Floating Name Tag above Avatar
  const nameSprite = createLabelSprite(
    `⭐ ${playerName}`,
    'rgba(15, 23, 42, 0.85)',
    '#facc15',
    '#fde047',
    2.6,
    0.75
  );
  nameSprite.position.set(0, 3.85, 0);
  group.add(nameSprite);

  return {
    group,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    headGroup,
  };
}

export default function RobloxWorldGames3D({
  initialMode = 'obby',
  chapter,
  subject,
  isUKG = false,
}: RobloxWorldGames3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { activeChild, language, speak, addStars } = useApp();

  const [gameMode, setGameMode] = useState<RobloxGameMode>(initialMode);
  const [outfitIdx, setOutfitIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [bloxCoins, setBloxCoins] = useState(25);
  const [levelStage, setLevelStage] = useState(1);
  const [lives, setLives] = useState(3);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Use Arrow Keys / WASD or Touch Buttons to run & jump!'
  );
  const [activeQuestion, setActiveQuestion] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [victoryModal, setVictoryModal] = useState(false);
  const [tycoonBuildings, setTycoonBuildings] = useState<number>(0);

  // Sync initialMode prop when switched from parent
  useEffect(() => {
    setGameMode(initialMode);
  }, [initialMode]);

  // Input control refs for 60fps loop
  const keysRef = useRef<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
  });

  const resetTriggerRef = useRef<number>(0);
  const [restartCounter, setRestartCounter] = useState(0);

  const handleRestart = useCallback(() => {
    soundEffects.playPop();
    setScore(0);
    setLives(3);
    setLevelStage(1);
    setVictoryModal(false);
    setTycoonBuildings(0);
    resetTriggerRef.current += 1;
    setRestartCounter((c) => c + 1);
  }, []);

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
        // Prevent page scroll while playing
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
        }
      }
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keysRef.current.up = true;
      if (k === 's' || e.key === 'ArrowDown') keysRef.current.down = true;
      if (k === 'a' || e.key === 'ArrowLeft') keysRef.current.left = true;
      if (k === 'd' || e.key === 'ArrowRight') keysRef.current.right = true;
      if (k === ' ' || e.code === 'Space') keysRef.current.jump = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keysRef.current.up = false;
      if (k === 's' || e.key === 'ArrowDown') keysRef.current.down = false;
      if (k === 'a' || e.key === 'ArrowLeft') keysRef.current.left = false;
      if (k === 'd' || e.key === 'ArrowRight') keysRef.current.right = false;
      if (k === ' ' || e.code === 'Space') keysRef.current.jump = false;
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Main Three.js Roblox Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 850;
    const height = isFullscreen ? window.innerHeight - 140 : 520;

    const scene = new THREE.Scene();
    // Vibrant Roblox sky blue with distance fog
    const skyColors: Record<RobloxGameMode, number> = {
      obby: 0x38bdf8,
      kart: 0x0ea5e9,
      tycoon: 0x60a5fa,
      treasure: 0x10b981,
    };
    scene.background = new THREE.Color(skyColors[gameMode]);
    scene.fog = new THREE.FogExp2(skyColors[gameMode], 0.0085);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 1.35);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    sunLight.position.set(25, 45, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 160;
    const d = 45;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // --- Fluffy Blocky Clouds in Sky ---
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    for (let i = 0; i < 18; i++) {
      const cloudGroup = new THREE.Group();
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(5, 1.6, 3.2), cloudMat);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.6), cloudMat);
      c2.position.set(0.6, 0.5, 0);
      cloudGroup.add(c1, c2);
      cloudGroup.position.set(
        (Math.random() - 0.5) * 140,
        18 + Math.random() * 14,
        -i * 14 + 20
      );
      scene.add(cloudGroup);
    }

    // --- Build Player Avatar ---
    const currentOutfit = OUTFITS[outfitIdx % OUTFITS.length];
    const playerName = activeChild?.name || 'Blox Star';
    const avatar = createRobloxCharacter(currentOutfit, playerName);
    scene.add(avatar.group);

    // If Kart Mode, add a 3D Roblox Racing Kart around the player!
    let kartWheels: THREE.Mesh[] = [];
    if (gameMode === 'kart') {
      const kartGroup = new THREE.Group();
      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.55, 3.2),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.3 })
      );
      chassis.position.y = 0.55;
      chassis.castShadow = true;
      kartGroup.add(chassis);

      const bumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.35, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
      );
      bumper.position.set(0, 0.5, -1.65);
      kartGroup.add(bumper);

      const spoiler = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.2, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      spoiler.position.set(0, 1.25, 1.4);
      kartGroup.add(spoiler);

      const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.4, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
      const wheelPositions = [
        [-1.15, 0.48, -1.05],
        [1.15, 0.48, -1.05],
        [-1.15, 0.48, 1.05],
        [1.15, 0.48, 1.05],
      ];
      wheelPositions.forEach(([wx, wy, wz]) => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.position.set(wx, wy, wz);
        kartGroup.add(w);
        kartWheels.push(w);
      });

      avatar.group.add(kartGroup);
    }

    // --- Quiz Data from Active Chapter / Syllabus ---
    const quizList = generateQuizQuestions(chapter, subject, isUKG);

    // --- Game World Structures ---
    interface PlatformBox {
      mesh: THREE.Mesh;
      width: number;
      height: number;
      depth: number;
      type: 'normal' | 'bounce' | 'lava' | 'quiz_correct' | 'quiz_wrong' | 'goal' | 'moving';
      questionText?: string;
      answerLabel?: string;
      baseX?: number;
      moveSpeed?: number;
      passed?: boolean;
    }

    interface CollectibleCoin {
      mesh: THREE.Mesh;
      collected: boolean;
      value: number;
      label?: string;
    }

    interface PatrolBot {
      group: THREE.Group;
      baseX: number;
      baseZ: number;
      range: number;
      speed: number;
      phase: number;
    }

    interface TycoonPad {
      mesh: THREE.Mesh;
      id: number;
      cost: number;
      title: string;
      built: boolean;
      buildingGroup: THREE.Group;
      labelSprite: THREE.Sprite;
    }

    const platforms: PlatformBox[] = [];
    const coins: CollectibleCoin[] = [];
    const bots: PatrolBot[] = [];
    const tycoonPads: TycoonPad[] = [];

    const addPlatform = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      color: number,
      type: PlatformBox['type'] = 'normal',
      extra?: Partial<PlatformBox>
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const isEmissive = type === 'lava' || type === 'bounce' || type === 'goal';
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.12,
        emissive: isEmissive ? color : 0x000000,
        emissiveIntensity: type === 'lava' ? 0.45 : type === 'goal' ? 0.35 : 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);

      // Subtle stud top rim for authentic Roblox baseplate look
      const p: PlatformBox = {
        mesh,
        width: w,
        height: h,
        depth: d,
        type,
        baseX: x,
        ...extra,
      };
      platforms.push(p);
      return p;
    };

    const spawnCoin = (x: number, y: number, z: number, label?: string) => {
      const geo = new THREE.CylinderGeometry(0.65, 0.65, 0.22, 20);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.6,
        roughness: 0.2,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.25,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      if (label) {
        const sp = createLabelSprite(label, '#0f172a', '#facc15', '#fde047', 2.8, 0.8);
        sp.position.set(0, 1.25, 0);
        mesh.add(sp);
      }

      coins.push({ mesh, collected: false, value: 10, label });
    };

    // =========================================================================
    // WORLD 1: BLOX OBBY PARKOUR TOWER (Sky Obstacle Course + Quiz Bridges)
    // =========================================================================
    if (gameMode === 'obby') {
      setStatusMessage('🏃‍♂️ Jump across the 3D Sky Obby! Step on the CORRECT Knowledge Bridge tiles!');
      setActiveQuestion(quizList[0]?.question || 'Reach the Golden Crown!');

      // Starting Spawn Island
      addPlatform(0, -0.5, 0, 9, 1, 9, 0x22c55e, 'normal');
      const startSign = createLabelSprite('🏁 START OBBY QUEST', '#15803d', '#86efac', '#ffffff', 4.5, 1.1);
      startSign.position.set(0, 3.2, -3.2);
      scene.add(startSign);

      // Rainbow stepping stones
      const rainbowColors = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x06b6d4, 0x8b5cf6, 0xec4899];
      let curZ = -7.5;
      let curY = 0;

      for (let i = 0; i < 5; i++) {
        const xOff = (i % 2 === 0 ? -1 : 1) * 1.8;
        addPlatform(xOff, curY, curZ, 3.8, 0.8, 3.8, rainbowColors[i % rainbowColors.length], 'normal');
        spawnCoin(xOff, curY + 1.4, curZ);
        curZ -= 5.8;
        curY += 0.55;
      }

      // Quiz Bridge 1
      const q1 = quizList[0];
      addPlatform(0, curY, curZ, 8.5, 0.8, 4.5, 0x3b82f6, 'normal', { questionText: q1.question });
      const q1Sign = createLabelSprite(`❓ ${q1.question}`, '#1e1b4b', '#38bdf8', '#fde047', 6.5, 1.35);
      q1Sign.position.set(0, curY + 3.6, curZ - 1.5);
      scene.add(q1Sign);

      curZ -= 6.0;
      const leftCorrect1 = Math.random() > 0.5;
      const pLeft1 = addPlatform(
        -2.7,
        curY,
        curZ,
        3.6,
        0.7,
        5.5,
        0x6366f1,
        leftCorrect1 ? 'quiz_correct' : 'quiz_wrong',
        { questionText: q1.question, answerLabel: leftCorrect1 ? q1.correctAnswer : q1.wrongAnswer }
      );
      const sLeft1 = createLabelSprite(
        leftCorrect1 ? q1.correctAnswer : q1.wrongAnswer,
        '#1e293b',
        '#a855f7',
        '#ffffff',
        3.5,
        1.0
      );
      sLeft1.position.set(0, 1.8, 0);
      pLeft1.mesh.add(sLeft1);

      const pRight1 = addPlatform(
        2.7,
        curY,
        curZ,
        3.6,
        0.7,
        5.5,
        0xec4899,
        !leftCorrect1 ? 'quiz_correct' : 'quiz_wrong',
        { questionText: q1.question, answerLabel: !leftCorrect1 ? q1.correctAnswer : q1.wrongAnswer }
      );
      const sRight1 = createLabelSprite(
        !leftCorrect1 ? q1.correctAnswer : q1.wrongAnswer,
        '#1e293b',
        '#f472b6',
        '#ffffff',
        3.5,
        1.0
      );
      sRight1.position.set(0, 1.8, 0);
      pRight1.mesh.add(sRight1);

      // Moving Platforms + Bounce Pad Section
      curZ -= 6.5;
      addPlatform(0, curY, curZ, 6, 0.8, 4, 0x10b981, 'normal');
      spawnCoin(0, curY + 1.5, curZ);

      curZ -= 5.8;
      addPlatform(0, curY, curZ, 4.2, 0.8, 4.2, 0xfacc15, 'bounce');
      const bounceSign = createLabelSprite('⚡ SUPER BOUNCE PAD!', '#854d0e', '#fde047', '#ffffff', 3.8, 0.95);
      bounceSign.position.set(0, curY + 2.4, curZ);
      scene.add(bounceSign);

      curY += 2.8;
      curZ -= 7.0;
      addPlatform(0, curY, curZ, 4.5, 0.8, 4.5, 0x06b6d4, 'moving', { moveSpeed: 2.2 });
      spawnCoin(0, curY + 1.5, curZ);

      // Quiz Bridge 2
      curZ -= 6.5;
      const q2 = quizList[1 % quizList.length];
      addPlatform(0, curY, curZ, 8.5, 0.8, 4.5, 0x8b5cf6, 'normal', { questionText: q2.question });
      const q2Sign = createLabelSprite(`❓ ${q2.question}`, '#1e1b4b', '#c084fc', '#fde047', 6.5, 1.35);
      q2Sign.position.set(0, curY + 3.6, curZ - 1.5);
      scene.add(q2Sign);

      curZ -= 6.0;
      const leftCorrect2 = Math.random() > 0.5;
      const pLeft2 = addPlatform(
        -2.7,
        curY,
        curZ,
        3.6,
        0.7,
        5.5,
        0x0ea5e9,
        leftCorrect2 ? 'quiz_correct' : 'quiz_wrong',
        { questionText: q2.question, answerLabel: leftCorrect2 ? q2.correctAnswer : q2.wrongAnswer }
      );
      const sLeft2 = createLabelSprite(
        leftCorrect2 ? q2.correctAnswer : q2.wrongAnswer,
        '#0f172a',
        '#38bdf8',
        '#ffffff',
        3.5,
        1.0
      );
      sLeft2.position.set(0, 1.8, 0);
      pLeft2.mesh.add(sLeft2);

      const pRight2 = addPlatform(
        2.7,
        curY,
        curZ,
        3.6,
        0.7,
        5.5,
        0xf59e0b,
        !leftCorrect2 ? 'quiz_correct' : 'quiz_wrong',
        { questionText: q2.question, answerLabel: !leftCorrect2 ? q2.correctAnswer : q2.wrongAnswer }
      );
      const sRight2 = createLabelSprite(
        !leftCorrect2 ? q2.correctAnswer : q2.wrongAnswer,
        '#0f172a',
        '#fbbf24',
        '#ffffff',
        3.5,
        1.0
      );
      sRight2.position.set(0, 1.8, 0);
      pRight2.mesh.add(sRight2);

      // Final Golden Winner Island
      curZ -= 7.5;
      curY += 0.6;
      addPlatform(0, curY, curZ, 10, 1.2, 10, 0xfacc15, 'goal');
      const winSign = createLabelSprite('🏆 WINNER CROWN ISLAND! +10 ⭐', '#713f12', '#fde047', '#fef08a', 5.8, 1.3);
      winSign.position.set(0, curY + 4.2, curZ);
      scene.add(winSign);

      // Giant spinning Golden Crown on Winner Island
      const crownMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.4, 0),
        new THREE.MeshStandardMaterial({
          color: 0xfde047,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.5,
          metalness: 0.7,
          roughness: 0.15,
        })
      );
      crownMesh.position.set(0, curY + 2.2, curZ);
      scene.add(crownMesh);
    }

    // =========================================================================
    // WORLD 2: BLOX SPEED KART RACING 3D (Turbo Knowledge Track)
    // =========================================================================
    if (gameMode === 'kart') {
      setStatusMessage('🏎️ Steer Left & Right through the CORRECT Answer Gates for NITRO BOOST!');
      setActiveQuestion(quizList[0]?.question || 'Drive through the correct gates!');

      // Long Asphalt Highway Track with Red/White Racing Curbs
      const trackLength = 220;
      addPlatform(0, -0.5, -trackLength / 2 + 10, 14, 1, trackLength, 0x334155, 'normal');

      // Green Grass Surroundings
      const grassL = new THREE.Mesh(
        new THREE.BoxGeometry(40, 0.8, trackLength),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 })
      );
      grassL.position.set(-27, -0.6, -trackLength / 2 + 10);
      const grassR = new THREE.Mesh(
        new THREE.BoxGeometry(40, 0.8, trackLength),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 })
      );
      grassR.position.set(27, -0.6, -trackLength / 2 + 10);
      scene.add(grassL, grassR);

      // Center white highway stripes & roadside blocky trees
      for (let z = 0; z > -trackLength + 15; z -= 10) {
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.05, 4.5),
          new THREE.MeshBasicMaterial({ color: 0xf8fafc })
        );
        stripe.position.set(0, 0.03, z);
        scene.add(stripe);

        // Blocky Roblox Trees along the sides
        [-10, 10].forEach((tx) => {
          const trunk = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 2.6, 0.9),
            new THREE.MeshStandardMaterial({ color: 0x78350f })
          );
          trunk.position.set(tx, 1.3, z);
          const leaves = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 2.8, 2.8),
            new THREE.MeshStandardMaterial({ color: 0x22c55e })
          );
          leaves.position.set(tx, 3.5, z);
          scene.add(trunk, leaves);
        });
      }

      // Spawn 4 Quiz Racing Gates along the highway
      for (let g = 0; g < 4; g++) {
        const gz = -38 - g * 42;
        const q = quizList[g % quizList.length];

        // Overhead Question Banner
        const qBanner = createLabelSprite(`🏎️ ${q.question}`, '#0f172a', '#38bdf8', '#fde047', 8.5, 1.5);
        qBanner.position.set(0, 5.2, gz);
        scene.add(qBanner);

        const leftIsCorrect = g % 2 === 0;
        // Left Gate Pad
        const gateL = addPlatform(
          -3.4,
          0.1,
          gz,
          5.2,
          0.3,
          4.0,
          0x2563eb,
          leftIsCorrect ? 'quiz_correct' : 'quiz_wrong',
          { questionText: q.question, answerLabel: leftIsCorrect ? q.correctAnswer : q.wrongAnswer }
        );
        const labelL = createLabelSprite(
          leftIsCorrect ? `✅ ${q.correctAnswer}` : `⚡ ${q.wrongAnswer}`,
          '#1e3a8a',
          '#60a5fa',
          '#ffffff',
          4.4,
          1.2
        );
        labelL.position.set(0, 2.3, 0);
        gateL.mesh.add(labelL);

        // Right Gate Pad
        const gateR = addPlatform(
          3.4,
          0.1,
          gz,
          5.2,
          0.3,
          4.0,
          0x9333ea,
          !leftIsCorrect ? 'quiz_correct' : 'quiz_wrong',
          { questionText: q.question, answerLabel: !leftIsCorrect ? q.correctAnswer : q.wrongAnswer }
        );
        const labelR = createLabelSprite(
          !leftIsCorrect ? `✅ ${q.correctAnswer}` : `⚡ ${q.wrongAnswer}`,
          '#581c87',
          '#c084fc',
          '#ffffff',
          4.4,
          1.2
        );
        labelR.position.set(0, 2.3, 0);
        gateR.mesh.add(labelR);

        // Coins between gates
        spawnCoin(-2.5, 1.0, gz + 14);
        spawnCoin(0, 1.0, gz + 18);
        spawnCoin(2.5, 1.0, gz + 22);
      }

      // Finish Line Checkered Pad
      addPlatform(0, 0.05, -195, 14, 0.4, 8, 0xfacc15, 'goal');
      const finishSign = createLabelSprite('🏁 GRAND PRIX FINISH LINE! 🏆', '#713f12', '#fde047', '#ffffff', 7.5, 1.5);
      finishSign.position.set(0, 4.5, -195);
      scene.add(finishSign);
    }

    // =========================================================================
    // WORLD 3: BLOX KNOWLEDGE TYCOON & BASE BUILDER 3D
    // =========================================================================
    if (gameMode === 'tycoon') {
      setStatusMessage(
        '🏰 Collect Golden Knowledge Crystals & step on glowing Build Pads to build your 3D Mega Base!'
      );
      setActiveQuestion(`Chapter Builder: ${chapter?.title || 'Knowledge Empire'}`);

      // Large Green Baseplate Island
      addPlatform(0, -0.5, -6, 36, 1, 36, 0x22c55e, 'normal');

      // Central Marble Plaza
      addPlatform(0, 0.05, -6, 14, 0.2, 14, 0xe2e8f0, 'normal');

      // Spawn regenerating Knowledge Coins around the island with syllabus key terms
      const terms =
        chapter?.keyTerms && chapter.keyTerms.length > 0
          ? chapter.keyTerms
          : ['Science', 'Math', 'Logic', 'Discovery', 'Genius', 'Planet'];

      const coinCoords = [
        [-8, -2],
        [8, -2],
        [-8, -12],
        [8, -12],
        [0, 4],
        [-11, -7],
        [11, -7],
        [0, -16],
      ];
      coinCoords.forEach(([cx, cz], idx) => {
        spawnCoin(cx, 1.1, cz, terms[idx % terms.length]);
      });

      // 4 Constructible 3D Tycoon Structures
      const padDefs = [
        { id: 1, x: -5.5, z: -4, cost: 20, title: '🔬 Science Lab Dome', color: 0x3b82f6 },
        { id: 2, x: 5.5, z: -4, cost: 30, title: '🏰 Golden Castle Tower', color: 0xf59e0b },
        { id: 3, x: -5.5, z: -11, cost: 40, title: '🚀 Space Rocket Pad', color: 0xef4444 },
        { id: 4, x: 5.5, z: -11, cost: 50, title: '🐾 Giant Chikoo Statue', color: 0xa855f7 },
      ];

      padDefs.forEach((pd) => {
        const padMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(2.1, 2.2, 0.35, 24),
          new THREE.MeshStandardMaterial({
            color: pd.color,
            emissive: pd.color,
            emissiveIntensity: 0.25,
          })
        );
        padMesh.position.set(pd.x, 0.25, pd.z);
        scene.add(padMesh);

        const labelSp = createLabelSprite(
          `${pd.title} (${pd.cost} 🪙)`,
          '#0f172a',
          '#facc15',
          '#fde047',
          4.2,
          1.05
        );
        labelSp.position.set(pd.x, 2.3, pd.z);
        scene.add(labelSp);

        // Pre-create the 3D building (hidden until unlocked!)
        const bGroup = new THREE.Group();
        bGroup.position.set(pd.x, 0.4, pd.z);
        bGroup.visible = false;

        if (pd.id === 1) {
          // Science Lab Dome
          const base = new THREE.Mesh(
            new THREE.CylinderGeometry(2.2, 2.2, 2.2, 20),
            new THREE.MeshStandardMaterial({ color: 0xf8fafc })
          );
          base.position.y = 1.1;
          const dome = new THREE.Mesh(
            new THREE.SphereGeometry(2.1, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.3 })
          );
          dome.position.y = 2.2;
          bGroup.add(base, dome);
        } else if (pd.id === 2) {
          // Castle Tower
          const tower = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 5.5, 3.2),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
          );
          tower.position.y = 2.75;
          const roof = new THREE.Mesh(
            new THREE.ConeGeometry(2.6, 2.5, 4),
            new THREE.MeshStandardMaterial({ color: 0xef4444 })
          );
          roof.position.y = 6.7;
          roof.rotation.y = Math.PI / 4;
          bGroup.add(tower, roof);
        } else if (pd.id === 3) {
          // Space Rocket
          const body = new THREE.Mesh(
            new THREE.CylinderGeometry(1.1, 1.4, 5.5, 20),
            new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
          );
          body.position.y = 2.8;
          const nose = new THREE.Mesh(
            new THREE.ConeGeometry(1.15, 2.2, 20),
            new THREE.MeshStandardMaterial({ color: 0xef4444 })
          );
          nose.position.y = 6.6;
          bGroup.add(body, nose);
        } else {
          // Golden Chikoo Monument
          const ped = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 1.8, 2.8),
            new THREE.MeshStandardMaterial({ color: 0x334155 })
          );
          ped.position.y = 0.9;
          const statue = new THREE.Mesh(
            new THREE.OctahedronGeometry(1.8, 1),
            new THREE.MeshStandardMaterial({
              color: 0xfacc15,
              metalness: 0.7,
              roughness: 0.15,
              emissive: 0xf59e0b,
              emissiveIntensity: 0.3,
            })
          );
          statue.position.y = 3.6;
          bGroup.add(ped, statue);
        }

        scene.add(bGroup);
        tycoonPads.push({
          mesh: padMesh,
          id: pd.id,
          cost: pd.cost,
          title: pd.title,
          built: false,
          buildingGroup: bGroup,
          labelSprite: labelSp,
        });
      });
    }

    // =========================================================================
    // WORLD 4: BLOX TREASURE HUNT & MONSTER DODGE 3D
    // =========================================================================
    if (gameMode === 'treasure') {
      setStatusMessage(
        '💎 Collect all 6 Glowing Chapter Crystals while jumping over the Blocky Lava Golems!'
      );
      setActiveQuestion(`Treasure Quest: ${chapter?.title || 'Crystal Island'}`);

      // Adventure Island Baseplate
      addPlatform(0, -0.5, -10, 34, 1, 38, 0x15803d, 'normal');

      // Golden Temple Platform in back
      addPlatform(0, 0.5, -23, 10, 1.2, 7, 0xf59e0b, 'normal');

      // Spawn 6 Chapter Concept Crystals
      const terms =
        chapter?.keyTerms && chapter.keyTerms.length > 0
          ? chapter.keyTerms
          : ['Crystal 1', 'Crystal 2', 'Crystal 3', 'Crystal 4', 'Crystal 5', 'Crystal 6'];

      const crystalSpots = [
        [-9, 1.2, -3],
        [9, 1.2, -3],
        [-10, 1.2, -13],
        [10, 1.2, -13],
        [0, 1.2, -10],
        [0, 2.2, -23],
      ];

      crystalSpots.forEach(([cx, cy, cz], idx) => {
        spawnCoin(cx, cy, cz, `💎 ${terms[idx % terms.length]}`);
      });

      // Spawn 3 Patrolling Blocky Golems
      const botZones = [
        { x: 0, z: -6, range: 9, speed: 2.3, phase: 0 },
        { x: 0, z: -14, range: 10, speed: 2.8, phase: 1.5 },
        { x: 0, z: -19, range: 8, speed: 3.1, phase: 3.0 },
      ];

      botZones.forEach((bz) => {
        const bGroup = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(1.7, 1.7, 1.7),
          new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0x991b1b,
            emissiveIntensity: 0.3,
          })
        );
        body.position.y = 0.9;
        const eyeL = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.25, 0.2),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        eyeL.position.set(-0.4, 1.15, 0.86);
        const eyeR = eyeL.clone();
        eyeR.position.x = 0.4;
        bGroup.add(body, eyeL, eyeR);
        bGroup.position.set(bz.x, 0, bz.z);
        scene.add(bGroup);

        bots.push({
          group: bGroup,
          baseX: bz.x,
          baseZ: bz.z,
          range: bz.range,
          speed: bz.speed,
          phase: bz.phase,
        });
      });
    }

    // --- Physics & Player State ---
    const playerPos = new THREE.Vector3(0, 0.5, 0);
    const playerVel = new THREE.Vector3(0, 0, 0);
    let isGrounded = true;
    let walkCycle = 0;
    let invulnerableTimer = 0;
    let gameWon = false;

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (invulnerableTimer > 0) invulnerableTimer -= dt;

      // 1. Update Moving Platforms
      platforms.forEach((p) => {
        if (p.type === 'moving' && p.baseX !== undefined && p.moveSpeed) {
          p.mesh.position.x = p.baseX + Math.sin(elapsed * p.moveSpeed) * 3.8;
        }
      });

      // 2. Update Rotating Coins
      coins.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 2.8;
          c.mesh.position.y += Math.sin(elapsed * 4) * 0.004;
        }
      });

      // 3. Update Patrol Bots (Treasure Hunt Mode)
      bots.forEach((b) => {
        b.group.position.x = b.baseX + Math.sin(elapsed * b.speed + b.phase) * b.range;
        b.group.rotation.y = Math.cos(elapsed * b.speed + b.phase) > 0 ? Math.PI / 2 : -Math.PI / 2;

        // Check collision with player
        if (invulnerableTimer <= 0 && !gameWon) {
          const dist = b.group.position.distanceTo(playerPos);
          if (dist < 1.65 && playerPos.y < 1.8) {
            soundEffects.playIncorrect();
            invulnerableTimer = 1.5;
            playerVel.y = 9.5;
            playerPos.z += 2.5;
            setLives((prev) => {
              const next = Math.max(1, prev - 1);
              return next;
            });
            setStatusMessage('💥 Watch out for the Lava Golem! Press SPACE / JUMP to leap over them!');
          }
        }
      });

      // 4. Player Movement Logic
      const moveSpeed = gameMode === 'kart' ? 13.5 : 9.2;
      let moveX = 0;
      let moveZ = 0;

      if (keysRef.current.left) moveX -= 1;
      if (keysRef.current.right) moveX += 1;

      if (gameMode === 'kart') {
        // Kart auto-accelerates forward; up/down adjusts speed
        moveZ = keysRef.current.down ? 0.3 : keysRef.current.up ? -1.45 : -1.0;
        kartWheels.forEach((w) => {
          w.rotation.x -= dt * 12;
        });
      } else {
        if (keysRef.current.up) moveZ -= 1;
        if (keysRef.current.down) moveZ += 1;
      }

      if (moveX !== 0 || moveZ !== 0) {
        const len = Math.hypot(moveX, moveZ);
        playerVel.x = (moveX / len) * moveSpeed;
        playerVel.z = (moveZ / len) * moveSpeed;

        // Smoothly face movement direction
        const targetAngle = Math.atan2(-playerVel.x, -playerVel.z);
        avatar.group.rotation.y = THREE.MathUtils.lerp(avatar.group.rotation.y, targetAngle, 0.18);

        // Swing Roblox limbs while walking/running
        if (gameMode !== 'kart') {
          walkCycle += dt * 11;
          const swing = Math.sin(walkCycle) * 0.65;
          avatar.leftLeg.rotation.x = swing;
          avatar.rightLeg.rotation.x = -swing;
          avatar.leftArm.rotation.x = -swing * 0.8;
          avatar.rightArm.rotation.x = swing * 0.8;
        }
      } else {
        playerVel.x *= 0.8;
        playerVel.z *= 0.8;
        avatar.leftLeg.rotation.x = THREE.MathUtils.lerp(avatar.leftLeg.rotation.x, 0, 0.15);
        avatar.rightLeg.rotation.x = THREE.MathUtils.lerp(avatar.rightLeg.rotation.x, 0, 0.15);
        avatar.leftArm.rotation.x = THREE.MathUtils.lerp(avatar.leftArm.rotation.x, 0, 0.15);
        avatar.rightArm.rotation.x = THREE.MathUtils.lerp(avatar.rightArm.rotation.x, 0, 0.15);
      }

      // Jump Physics
      if (keysRef.current.jump && isGrounded) {
        playerVel.y = 13.5;
        isGrounded = false;
        soundEffects.playPop();
      }

      // Apply gravity
      playerVel.y -= 28.0 * dt;

      // Advance position
      playerPos.x += playerVel.x * dt;
      playerPos.y += playerVel.y * dt;
      playerPos.z += playerVel.z * dt;

      // Clamp Kart X inside highway bounds
      if (gameMode === 'kart') {
        playerPos.x = Math.max(-6.0, Math.min(6.0, playerPos.x));
      }

      // 5. Platform Collision Detection
      isGrounded = false;
      for (const p of platforms) {
        const px = p.mesh.position.x;
        const py = p.mesh.position.y;
        const pz = p.mesh.position.z;
        const halfW = p.width / 2 + 0.45;
        const halfD = p.depth / 2 + 0.45;
        const topY = py + p.height / 2;

        const withinXZ =
          playerPos.x >= px - halfW &&
          playerPos.x <= px + halfW &&
          playerPos.z >= pz - halfD &&
          playerPos.z <= pz + halfD;

        if (withinXZ && playerVel.y <= 0 && playerPos.y >= topY - 0.65 && playerPos.y <= topY + 0.9) {
          if (p.type === 'quiz_wrong') {
            // Wrong bridge tile drops away!
            if (!p.passed) {
              p.passed = true;
              soundEffects.playIncorrect();
              p.mesh.position.y -= 4;
              setStatusMessage(`❌ Oops! "${p.answerLabel}" was not right! Try the other side!`);
            }
            continue;
          }

          playerPos.y = topY;
          playerVel.y = 0;
          isGrounded = true;

          // Handle special platform triggers
          if (p.type === 'bounce') {
            playerVel.y = 18.5;
            isGrounded = false;
            soundEffects.playStar();
            setStatusMessage('🚀 SUPER BOUNCE! Flying high!');
          } else if (p.type === 'quiz_correct' && !p.passed) {
            p.passed = true;
            soundEffects.playCorrect();
            setScore((s) => s + 25);
            setBloxCoins((c) => c + 15);
            setLevelStage((st) => st + 1);
            setStatusMessage(`✅ Awesome! "${p.answerLabel}" is CORRECT! +25 PTS & Turbo Boost!`);
            if (p.answerLabel) {
              speak(`Correct! ${p.answerLabel}`);
            }
          } else if (p.type === 'goal' && !gameWon) {
            gameWon = true;
            soundEffects.playStar();
            confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
            addStars(8);
            setScore((s) => s + 100);
            setVictoryModal(true);
            setStatusMessage('🏆 VICTORY! You conquered the 3D Blox World! +8 Golden Stars!');
            speak('Congratulations Champion! You beat the Roblox Learning World!');
          }

          if (p.questionText) {
            setActiveQuestion(p.questionText);
          }
          break;
        }
      }

      // Check Fall into Sky / Void Respawn
      if (playerPos.y < -10) {
        soundEffects.playIncorrect();
        playerPos.set(0, 2.5, 0);
        playerVel.set(0, 0, 0);
        setStatusMessage('🌈 Respawned at Start Island! Keep going, you got this!');
      }

      // 6. Coin / Crystal Collection
      coins.forEach((c) => {
        if (!c.collected && c.mesh.position.distanceTo(playerPos) < 1.9) {
          c.collected = true;
          c.mesh.visible = false;
          soundEffects.playPop();
          setScore((s) => s + 15);
          setBloxCoins((bc) => bc + 10);
          if (c.label) {
            setStatusMessage(`✨ Collected ${c.label}! +10 Blox Coins!`);
            speak(c.label.replace('💎 ', ''));
          }

          // In Tycoon mode, respawn coins after 5 seconds so kids can always build everything!
          if (gameMode === 'tycoon') {
            setTimeout(() => {
              c.collected = false;
              c.mesh.visible = true;
            }, 4500);
          }

          // In Treasure mode, check if all 6 crystals are collected
          if (gameMode === 'treasure' && coins.every((item) => item.collected) && !gameWon) {
            gameWon = true;
            soundEffects.playStar();
            confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
            addStars(8);
            setVictoryModal(true);
            setStatusMessage('💎 ALL CHAPTER CRYSTALS FOUND! You unlocked the Golden Treasure!');
            speak('Amazing! You collected all chapter crystals!');
          }
        }
      });

      // 7. Tycoon Building Pads Check
      if (gameMode === 'tycoon') {
        tycoonPads.forEach((tp) => {
          if (!tp.built && tp.mesh.position.distanceTo(playerPos) < 2.4) {
            setBloxCoins((currentCoins) => {
              if (currentCoins >= tp.cost) {
                tp.built = true;
                tp.buildingGroup.visible = true;
                tp.labelSprite.visible = false;
                soundEffects.playStar();
                confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } });
                setScore((s) => s + 50);
                setTycoonBuildings((b) => {
                  const nextB = b + 1;
                  if (nextB === tycoonPads.length && !gameWon) {
                    gameWon = true;
                    addStars(10);
                    setVictoryModal(true);
                    speak('Incredible! Your 3D Knowledge Tycoon Base is 100 percent complete!');
                  } else {
                    speak(`Built ${tp.title}!`);
                  }
                  return nextB;
                });
                setStatusMessage(`🏗️ BUILT ${tp.title}! Awesome job!`);
                return currentCoins - tp.cost;
              } else {
                setStatusMessage(
                  `🪙 Need ${tp.cost} Blox Coins for ${tp.title}! Collect more glowing crystals!`
                );
                return currentCoins;
              }
            });
          }
        });
      }

      // Sync 3D Avatar Group position
      avatar.group.position.copy(playerPos);

      // Smooth Third-Person Roblox Follow Camera
      const camOffset = gameMode === 'kart' ? new THREE.Vector3(0, 5.2, 9.5) : new THREE.Vector3(0, 5.8, 10.5);
      const desiredCamPos = playerPos.clone().add(camOffset);
      camera.position.lerp(desiredCamPos, 0.12);
      camera.lookAt(playerPos.x, playerPos.y + 1.8, playerPos.z - 3.5);

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 850;
      const h = isFullscreen ? window.innerHeight - 140 : 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameMode, outfitIdx, chapter?.id, isUKG, isFullscreen, restartCounter]);

  const gameModesList: {
    id: RobloxGameMode;
    title: string;
    subtitle: string;
    badge: string;
    gradient: string;
  }[] = [
    {
      id: 'obby',
      title: '🏃‍♂️ Blox Obby Parkour Tower',
      subtitle: 'Sky Jump & Quiz Bridges',
      badge: 'POPULAR',
      gradient: 'from-rose-500 to-orange-500',
    },
    {
      id: 'kart',
      title: '🏎️ Blox Speed Kart Racing',
      subtitle: 'Turbo Nitro Answer Gates',
      badge: '3D RACING',
      gradient: 'from-blue-600 to-cyan-500',
    },
    {
      id: 'tycoon',
      title: '🏰 Blox Knowledge Tycoon',
      subtitle: 'Build 3D Lab, Rocket & Castle',
      badge: 'BUILDER',
      gradient: 'from-amber-500 to-yellow-500',
    },
    {
      id: 'treasure',
      title: '💎 Blox Crystal Island Quest',
      subtitle: 'Dodge Golems & Collect Words',
      badge: 'ADVENTURE',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  const currentOutfit = OUTFITS[outfitIdx % OUTFITS.length];

  return (
    <div
      className={`bg-slate-900 rounded-4xl border-4 border-indigo-500 shadow-2xl overflow-hidden text-white transition-all ${
        isFullscreen ? 'fixed inset-2 z-50 flex flex-col' : 'relative space-y-4 p-4 sm:p-6'
      }`}
    >
      {/* Top Roblox Metaverse Selector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg border-2 border-white/30">
            🎮
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                3D ROBLOX-STYLE METAVERSE
              </span>
              <span className="text-xs font-bold text-amber-300">
                {chapter ? `Ch ${chapter.chapterNumber}: ${chapter.title}` : 'All Syllabus Quests'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Blox World 3D — Realistic Kids Adventure Arena
            </h2>
          </div>
        </div>

        {/* Avatar Outfit Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playPop();
              setOutfitIdx((i) => (i + 1) % OUTFITS.length);
            }}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center space-x-1.5 border border-indigo-400 shadow-md transition"
            title="Customize 3D Roblox Avatar Skin"
          >
            <span>{currentOutfit.badgeEmoji}</span>
            <span>Skin: {currentOutfit.name}</span>
          </button>

          <button
            onClick={handleRestart}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs flex items-center space-x-1.5 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Restart World</span>
          </button>

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs flex items-center space-x-1.5 border border-slate-700 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* 4 Roblox World Mode Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {gameModesList.map((gm) => {
          const active = gameMode === gm.id;
          return (
            <button
              key={gm.id}
              onClick={() => {
                soundEffects.playPop();
                setGameMode(gm.id);
                setVictoryModal(false);
              }}
              className={`p-3 rounded-2xl text-left transition-all border-2 flex flex-col justify-between ${
                active
                  ? `bg-gradient-to-br ${gm.gradient} text-white border-white shadow-lg scale-[1.02]`
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/30 text-amber-300">
                  {gm.badge}
                </span>
                {active && <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" />}
              </div>
              <p className="font-black text-xs sm:text-sm leading-snug">{gm.title}</p>
              <p className="text-[11px] opacity-85 font-semibold mt-0.5">{gm.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* 3D Viewport Container */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-slate-700 shadow-inner bg-sky-950 flex-1">
        <div ref={mountRef} className="w-full h-[520px]" />

        {/* Top HUD Overlay (Score, Coins, Question Prompt) */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center space-x-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 shadow-lg">
            <span className="flex items-center space-x-1 text-amber-400 font-black text-xs sm:text-sm">
              <Trophy className="w-4 h-4" />
              <span>{score} PTS</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center space-x-1 text-yellow-300 font-black text-xs sm:text-sm">
              <Coins className="w-4 h-4" />
              <span>{bloxCoins} Blox Coins</span>
            </span>
            {gameMode === 'tycoon' && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-black text-xs">
                  🏰 Built: {tycoonBuildings}/4
                </span>
              </>
            )}
            {gameMode === 'treasure' && (
              <>
                <span className="text-slate-600">|</span>
                <span className="flex items-center space-x-1 text-rose-400 font-black text-xs">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{lives}</span>
                </span>
              </>
            )}
          </div>

          {activeQuestion && (
            <div className="bg-indigo-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-sky-400 shadow-lg flex items-center space-x-2 pointer-events-auto">
              <span className="text-xs sm:text-sm font-black text-amber-300">
                🎯 {activeQuestion}
              </span>
              <button
                onClick={() => speak(activeQuestion)}
                className="p-1 rounded-lg bg-sky-500/30 hover:bg-sky-500/50 text-white transition"
                title="Listen to Question"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Live Status Toast */}
        <div className="absolute bottom-24 sm:bottom-5 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/50 text-center shadow-lg pointer-events-none max-w-md w-[90%]">
          <p className="text-xs sm:text-sm font-black text-amber-200">{statusMessage}</p>
        </div>

        {/* On-Screen Touch / Mouse Gamepad Controls (Left D-Pad + Right Jump Button) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
          {/* Left Directional Pad */}
          <div className="grid grid-cols-3 gap-1.5 pointer-events-auto bg-slate-900/75 p-2 rounded-3xl border border-slate-700 backdrop-blur-md">
            <div />
            <button
              onMouseDown={() => (keysRef.current.up = true)}
              onMouseUp={() => (keysRef.current.up = false)}
              onMouseLeave={() => (keysRef.current.up = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.up = true;
              }}
              onTouchEnd={() => (keysRef.current.up = false)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-indigo-600 active:bg-indigo-500 flex items-center justify-center text-white border border-slate-600 shadow"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onMouseLeave={() => (keysRef.current.left = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.left = true;
              }}
              onTouchEnd={() => (keysRef.current.left = false)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-indigo-600 active:bg-indigo-500 flex items-center justify-center text-white border border-slate-600 shadow"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onMouseDown={() => (keysRef.current.down = true)}
              onMouseUp={() => (keysRef.current.down = false)}
              onMouseLeave={() => (keysRef.current.down = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.down = true;
              }}
              onTouchEnd={() => (keysRef.current.down = false)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-indigo-600 active:bg-indigo-500 flex items-center justify-center text-white border border-slate-600 shadow"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onMouseLeave={() => (keysRef.current.right = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.right = true;
              }}
              onTouchEnd={() => (keysRef.current.right = false)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-indigo-600 active:bg-indigo-500 flex items-center justify-center text-white border border-slate-600 shadow"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Action / Jump Button */}
          <div className="pointer-events-auto">
            <button
              onMouseDown={() => (keysRef.current.jump = true)}
              onMouseUp={() => (keysRef.current.jump = false)}
              onMouseLeave={() => (keysRef.current.jump = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.jump = true;
              }}
              onTouchEnd={() => (keysRef.current.jump = false)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 hover:from-emerald-300 hover:to-green-500 active:scale-95 text-slate-950 font-black text-xs flex flex-col items-center justify-center border-4 border-white shadow-xl"
            >
              <Zap className="w-6 h-6 fill-slate-950" />
              <span>JUMP</span>
            </button>
          </div>
        </div>

        {/* Victory Celebration Modal Overlay */}
        {victoryModal && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-20 animate-fade-in">
            <div className="bg-gradient-to-b from-indigo-900 to-slate-900 border-4 border-amber-400 rounded-4xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                <Crown className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                🏆 BLOX WORLD CHAMPION!
              </h3>
              <p className="text-sm font-bold text-amber-200">
                Amazing job, {activeChild?.name || 'Superstar'}! You conquered this 3D World and earned +8 Golden Learning Stars!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={() => {
                    const modes: RobloxGameMode[] = ['obby', 'kart', 'tycoon', 'treasure'];
                    const next = modes[(modes.indexOf(gameMode) + 1) % modes.length];
                    setGameMode(next);
                    setVictoryModal(false);
                  }}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg transition"
                >
                  Next 3D World 🚀
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

