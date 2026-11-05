'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Grid,
  Pause,
  Play,
  Box,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TextbookChapter, Subject } from '@/lib/db/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { getTopicDetail, getChapterTopicsList, TopicDetail } from './chapter3dData';
import { buildRealistic3DModel, buildEnvironmentStage } from './chapter3dModels';

interface ChapterConcept3DProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
}

const NODE_COLORS = [
  0x10b981, // Emerald
  0x3b82f6, // Blue
  0xf59e0b, // Amber
  0xec4899, // Pink
  0x8b5cf6, // Purple
  0x06b6d4, // Cyan
];

const ENV_PRESET_LABELS: Record<
  TopicDetail['environmentPreset'],
  { label: string; bgHex: number; fogHex: number; badgeClass: string }
> = {
  nature: {
    label: '🌿 Botanical & Forest Diorama',
    bgHex: 0x061a14,
    fogHex: 0x061a14,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  heritage: {
    label: '🏛️ Heritage Sandstone Temple Stage',
    bgHex: 0x1c1208,
    fogHex: 0x1c1208,
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
  science_lab: {
    label: '🔬 Precision Science Lab Bench',
    bgHex: 0x091326,
    fogHex: 0x091326,
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
  },
  cyber_tech: {
    label: '🤖 Cyber & AI Hologram Deck',
    bgHex: 0x050816,
    fogHex: 0x050816,
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
  },
  ocean: {
    label: '🌊 Marine & Hydrological Basin',
    bgHex: 0x041829,
    fogHex: 0x041829,
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  },
  alpine: {
    label: '🏔️ Himalayan Alpine Glacier Stage',
    bgHex: 0x0f172a,
    fogHex: 0x0f172a,
    badgeClass: 'bg-slate-400/20 text-slate-200 border-slate-300/30',
  },
  playroom: {
    label: '🎨 Interactive Hardwood Studio',
    bgHex: 0x171226,
    fogHex: 0x171226,
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
  },
};

// Create a crisp 3D Sprite text badge using an HTML5 2D Canvas
function createTextSprite(text: string, isSelected: boolean, borderColorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rounded pill background
    ctx.fillStyle = isSelected ? 'rgba(250, 204, 21, 0.96)' : 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = isSelected ? '#ffffff' : borderColorHex;
    ctx.lineWidth = isSelected ? 8 : 5;

    const r = 36;
    const x = 16;
    const y = 20;
    const w = canvas.width - 32;
    const h = canvas.height - 40;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Label text
    ctx.font = '900 28px sans-serif';
    ctx.fillStyle = isSelected ? '#0f172a' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 28), canvas.width / 2, canvas.height / 2 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.3, 0.82, 1);
  return sprite;
}

export default function ChapterConcept3D({ chapter, subject }: ChapterConcept3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, speak } = useApp();

  const topics = getChapterTopicsList(chapter);
  const keyTerms = chapter?.keyTerms || [];
  const chapterId = chapter?.id || 'loading';

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [zoomDistance, setZoomDistance] = useState(10.6);

  const zoomRef = useRef(10.6);
  const autoRotateRef = useRef(true);
  const resetTriggerRef = useRef<() => void>(() => {});

  useEffect(() => {
    setSelectedTopicIndex(0);
    setIsExploded(false);
  }, [chapterId]);

  useEffect(() => {
    zoomRef.current = zoomDistance;
  }, [zoomDistance]);

  useEffect(() => {
    autoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  const topicDetails: TopicDetail[] = chapter
    ? topics.map((t, idx) => getTopicDetail(chapter, t, idx))
    : [];

  const activeDetail = topicDetails[selectedTopicIndex] || topicDetails[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !chapter) return;

    const width = container.clientWidth || 720;
    const height = 440;

    const currentDetail = getTopicDetail(chapter, topics[selectedTopicIndex] || topics[0], selectedTopicIndex);
    const envMeta = ENV_PRESET_LABELS[currentDetail.environmentPreset] || ENV_PRESET_LABELS.science_lab;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(envMeta.bgHex);
    scene.fog = new THREE.FogExp2(envMeta.fogHex, 0.025);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 1000);
    camera.position.set(0, 3.6, zoomRef.current);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Realistic Multi-Point PBR Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.95);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.85);
    keyLight.position.set(7, 13, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 35;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.95);
    rimLight.position.set(-8, 6, -7);
    scene.add(rimLight);

    const fillPoint = new THREE.PointLight(0xfbbf24, 1.1, 25);
    fillPoint.position.set(-4, 3, 6);
    scene.add(fillPoint);

    // Subtle Atmospheric Particle Field
    const starGeo = new THREE.BufferGeometry();
    const starCount = 160;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 38;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.1, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(starGeo, starMat));

    // 1. Chapter-Matched 3D Environment Pedestal Stage
    const envStage = buildEnvironmentStage(currentDetail.environmentPreset, isWireframe);
    scene.add(envStage);

    // 2. Center Stage Realistic PBR 3D Model for the Active Topic
    const centerStageGroup = new THREE.Group();
    centerStageGroup.position.set(0, 0.35, 0);
    scene.add(centerStageGroup);

    const centerpieceModel = buildRealistic3DModel(currentDetail.modelType, isWireframe);

    // If Exploded Parts View is active, radially separate sub-meshes so kids can inspect internal parts
    if (isExploded) {
      centerpieceModel.children.forEach((child, idx) => {
        const dir = child.position.clone();
        if (dir.lengthSq() < 0.02) {
          const angle = (idx / Math.max(1, centerpieceModel.children.length)) * Math.PI * 2;
          dir.set(Math.cos(angle) * 0.55, (idx % 2 === 0 ? 0.35 : -0.25), Math.sin(angle) * 0.55);
        } else {
          dir.multiplyScalar(1.48);
        }
        child.position.copy(dir);
      });
    }

    centerStageGroup.add(centerpieceModel);

    // Center Stage Floating Title Sprite above the 3D Model
    const centerLabelSprite = createTextSprite(
      `${currentDetail.emoji} ${currentDetail.shortLabel}`,
      true,
      '#facc15'
    );
    centerLabelSprite.position.set(0, 2.65, 0);
    scene.add(centerLabelSprite);

    // Glowing Stage Ring under Centerpiece
    const stageRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.045, 16, 64),
      new THREE.MeshBasicMaterial({ color: NODE_COLORS[selectedTopicIndex % NODE_COLORS.length] })
    );
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -1.25;
    scene.add(stageRing);

    // 3. Orbiting Topic Pedestal Nodes with Labeled 3D Sprites
    const topicMeshes: THREE.Mesh[] = [];
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const count = Math.max(1, topics.length);
    const radius = 5.0;

    topics.forEach((t, idx) => {
      const detail = getTopicDetail(chapter, t, idx);
      const angle = (idx / count) * Math.PI * 2 + 0.4;
      const color = NODE_COLORS[idx % NODE_COLORS.length];
      const isSelected = idx === selectedTopicIndex;

      const nodeGeo = isSelected
        ? new THREE.OctahedronGeometry(0.62, 0)
        : new THREE.CylinderGeometry(0.46, 0.54, 0.52, 24);
      const nodeMat = new THREE.MeshPhysicalMaterial({
        color: isSelected ? 0xfacc15 : color,
        roughness: 0.2,
        metalness: 0.4,
        clearcoat: 0.8,
        emissive: isSelected ? 0xd97706 : 0x000000,
        emissiveIntensity: isSelected ? 0.45 : 0,
        wireframe: isWireframe,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const nx = Math.cos(angle) * radius;
      const nz = Math.sin(angle) * radius;
      mesh.position.set(nx, -0.55, nz);
      mesh.castShadow = true;
      mesh.userData = { index: idx };
      orbitGroup.add(mesh);
      topicMeshes.push(mesh);

      // Floating 3D Label Sprite directly above each orbiting node
      const badgeText = `${idx + 1}. ${detail.emoji} ${detail.shortLabel}`;
      const labelSprite = createTextSprite(
        badgeText,
        isSelected,
        `#${color.toString(16).padStart(6, '0')}`
      );
      labelSprite.scale.set(2.55, 0.64, 1);
      labelSprite.position.set(nx, 0.35, nz);
      orbitGroup.add(labelSprite);
    });

    resetTriggerRef.current = () => {
      centerStageGroup.rotation.set(0, 0, 0);
      orbitGroup.rotation.set(0, 0, 0);
    };

    // Mouse / Touch Drag Rotation, Wheel Zoom & Raycaster Click
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(topicMeshes);
      if (intersects.length > 0) {
        const hitIndex = intersects[0].object.userData.index;
        if (typeof hitIndex === 'number') {
          soundEffects.playPop();
          setSelectedTopicIndex(hitIndex);
        }
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;
      orbitGroup.rotation.y += deltaX * 0.007;
      centerStageGroup.rotation.y += deltaX * 0.011;
      centerStageGroup.rotation.x = Math.max(-0.5, Math.min(0.5, centerStageGroup.rotation.x + deltaY * 0.006));
      prevX = clientX;
      prevY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const nextZoom = Math.max(5.8, Math.min(15.5, zoomRef.current + e.deltaY * 0.005));
      zoomRef.current = nextZoom;
      setZoomDistance(Number(nextZoom.toFixed(1)));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domElem.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    domElem.addEventListener('wheel', handleWheel, { passive: false });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smoothly interpolate camera zoom distance
      camera.position.z += (zoomRef.current - camera.position.z) * 0.12;
      camera.position.y = 2.2 + (camera.position.z / 10.6) * 1.4;
      camera.lookAt(0, 0.15, 0);

      if (!isDragging && autoRotateRef.current) {
        centerStageGroup.rotation.y += 0.0075;
        orbitGroup.rotation.y += 0.0018;
      }

      centerStageGroup.position.y = 0.35 + Math.sin(elapsed * 2.2) * 0.07;

      topicMeshes.forEach((m, idx) => {
        m.rotation.y += 0.015;
        if (idx === selectedTopicIndex) {
          const pulse = 1.15 + Math.sin(elapsed * 4) * 0.08;
          m.scale.set(pulse, pulse, pulse);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 720;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElem.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      domElem.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [chapterId, selectedTopicIndex, topics.length, isWireframe, isExploded]);

  if (!chapter || !activeDetail) {
    return (
      <div className="bg-slate-900 rounded-4xl p-12 border-4 border-sky-400 shadow-2xl text-white text-center font-bold">
        Loading Realistic 3D Chapter Model...
      </div>
    );
  }

  const activeEnvMeta = ENV_PRESET_LABELS[activeDetail.environmentPreset] || ENV_PRESET_LABELS.science_lab;

  const handleSelectTopic = (idx: number) => {
    soundEffects.playPop();
    setSelectedTopicIndex(idx);
    const detail = topicDetails[idx];
    if (detail) {
      speak(language === 'ml' ? `${detail.title}. ${detail.explanationMl}` : `${detail.title}. ${detail.explanationEn}`);
    }
  };

  const handleNarrateChapter3D = () => {
    soundEffects.playPop();
    speak(
      language === 'ml'
        ? `${chapter.malayalamTitle}. ${activeDetail.explanationMl}`
        : `${chapter.title} — ${activeDetail.title}. ${activeDetail.explanationEn}. 3D Material: ${activeDetail.materialNote}`
    );
  };

  return (
    <div className="bg-slate-900 rounded-4xl p-5 sm:p-7 border-4 border-sky-400 shadow-2xl text-white space-y-5">
      {/* Top 3D Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {subject?.icon || '🧊'} {language === 'ml' ? subject?.malayalamName : subject?.name} • Chapter{' '}
              {chapter.chapterNumber} in 3D
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${activeEnvMeta.badgeClass}`}>
              {activeEnvMeta.label}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {language === 'ml' ? chapter.malayalamTitle : chapter.title}
          </h3>
          <p className="text-xs text-amber-300 font-bold">
            {language === 'ml' ? activeDetail.funFactMl : activeDetail.funFactEn}
          </p>
        </div>

        <button
          onClick={handleNarrateChapter3D}
          className="px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg btn-kid-3d self-start sm:self-auto flex-shrink-0"
        >
          <Volume2 className="w-4 h-4" />
          <span>{language === 'ml' ? 'ശബ്ദ വിവരണം കേൾക്കാം 🔊' : 'Narrate 3D Model 🔊'}</span>
        </button>
      </div>

      {/* Exact Chapter 3D Material Specification Bar */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs">
          <Box className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-black text-slate-400 uppercase tracking-wider text-[10px]">
            Matched 3D PBR Material:
          </span>
          <span className="font-bold text-amber-200">{activeDetail.materialNote}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 self-start sm:self-auto">
          Template: {activeDetail.modelType.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Interactive 3D WebGL Viewport */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner">
        {/* Floating 3D Studio Control Toolbar */}
        <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => {
              soundEffects.playPop();
              setZoomDistance((z) => Math.max(5.8, Number((z - 1.2).toFixed(1))));
            }}
            title="Zoom In"
            className="p-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 transition text-xs font-black flex items-center space-x-1"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setZoomDistance((z) => Math.min(15.5, Number((z + 1.2).toFixed(1))));
            }}
            title="Zoom Out"
            className="p-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 transition text-xs font-black flex items-center space-x-1"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setIsExploded((prev) => !prev);
            }}
            title="Explode 3D Parts to Inspect Inside"
            className={`px-2.5 py-1.5 rounded-xl transition text-[11px] font-black flex items-center space-x-1 ${
              isExploded
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Assemble' : 'Explode Parts'}</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setIsWireframe((prev) => !prev);
            }}
            title="Toggle 3D Mesh Wireframe X-Ray"
            className={`px-2.5 py-1.5 rounded-xl transition text-[11px] font-black flex items-center space-x-1 ${
              isWireframe
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{isWireframe ? 'PBR Solid' : 'X-Ray Mesh'}</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setIsAutoRotate((prev) => !prev);
            }}
            title="Pause / Resume 3D Turntable Rotation"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setZoomDistance(10.6);
              setIsExploded(false);
              setIsWireframe(false);
              resetTriggerRef.current();
            }}
            title="Reset 3D Camera & View"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Helper Hint Pill */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none hidden sm:flex items-center space-x-1.5 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/70 text-[11px] font-bold text-slate-300">
          <span>🖱️ Drag to Rotate 360° • Scroll to Zoom • Tap Orbit Nodes</span>
        </div>

        <div ref={mountRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

        {/* Overlay Active Topic Specific Explanation HUD */}
        <div className="bg-slate-900/95 border-t border-sky-400/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase text-amber-400 flex items-center space-x-1 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {activeDetail.emoji} 3D Template {selectedTopicIndex + 1} of {topics.length}: {activeDetail.shortLabel}
                </span>
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              {activeDetail.title}
            </h4>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              {language === 'ml' ? activeDetail.explanationMl : activeDetail.explanationEn}
            </p>
          </div>

          <button
            onClick={() => handleSelectTopic((selectedTopicIndex + 1) % topics.length)}
            className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs whitespace-nowrap shadow-md shrink-0"
          >
            {language === 'ml' ? 'അടുത്ത 3D മോഡൽ 👉' : 'Next 3D Model 👉'}
          </button>
        </div>
      </div>

      {/* Topic Selector Buttons for this Chapter */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase text-sky-300 tracking-wider">
          🎯 {language === 'ml' ? 'ഈ അധ്യായത്തിലെ 3D മോഡലുകൾ (Tap to Switch 3D Template & Listen):' : 'Chapter-Matched 3D Templates & Materials (Tap Any Concept to Inspect in 3D):'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {topicDetails.map((detail, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTopic(idx)}
              className={`p-3.5 rounded-2xl text-left transition flex items-center justify-between border-2 ${
                selectedTopicIndex === idx
                  ? 'bg-sky-500 text-slate-950 border-amber-300 shadow-lg scale-[1.01]'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-sky-400'
              }`}
            >
              <div className="flex items-start space-x-2.5 pr-2">
                <span className="w-8 h-8 rounded-xl bg-black/25 flex items-center justify-center text-lg shrink-0 mt-0.5">
                  {detail.emoji}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-black">{detail.title}</div>
                  <div
                    className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${
                      selectedTopicIndex === idx ? 'text-slate-900' : 'text-amber-300/85'
                    }`}
                  >
                    🧱 {detail.materialNote}
                  </div>
                </div>
              </div>
              <Volume2 className="w-4 h-4 flex-shrink-0 ml-2 opacity-80" />
            </button>
          ))}
        </div>
      </div>

      {/* Key Terms Pills */}
      {keyTerms.length > 0 && (
        <div className="pt-2 border-t border-slate-800 flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-black uppercase text-slate-400 mr-1">
            🔑 {language === 'ml' ? 'പ്രധാന പദങ്ങൾ:' : '3D Key Terms (Tap to Hear):'}
          </span>
          {keyTerms.map((term, i) => (
            <button
              key={i}
              onClick={() => {
                soundEffects.playPop();
                speak(`${term}. From ${chapter.title}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-sky-200 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center space-x-1"
            >
              <span>{term}</span>
              <Volume2 className="w-3 h-3 opacity-70" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
