'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, RotateCcw, Sparkles, Layers } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TextbookChapter, Subject } from '@/lib/db/types';
import { soundEffects } from '@/lib/audio/soundEffects';

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

export default function ChapterConcept3D({ chapter, subject }: ChapterConcept3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, speak } = useApp();

  const topics = chapter?.topics && chapter.topics.length > 0 ? chapter.topics : [chapter?.title || 'Interactive 3D Concept'];
  const keyTerms = chapter?.keyTerms || [];
  const chapterId = chapter?.id || 'loading';

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    setSelectedTopicIndex(0);
    selectedIndexRef.current = 0;
  }, [chapterId]);

  useEffect(() => {
    selectedIndexRef.current = selectedTopicIndex;
  }, [selectedTopicIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.5, 30);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // Starfield particles background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 250;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.12 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Central Chapter Core Sculpture
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Glowing Wireframe Halo around Core
    const haloGeo = new THREE.TorusGeometry(2.1, 0.06, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2.5;
    coreGroup.add(haloMesh);

    // Orbiting Topic 3D Nodes
    const topicMeshes: THREE.Mesh[] = [];
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const geometries = [
      new THREE.SphereGeometry(0.65, 24, 24),
      new THREE.BoxGeometry(0.95, 0.95, 0.95),
      new THREE.ConeGeometry(0.7, 1.2, 20),
      new THREE.TorusKnotGeometry(0.45, 0.15, 50, 12),
      new THREE.OctahedronGeometry(0.75),
      new THREE.CylinderGeometry(0.5, 0.5, 1.1, 20),
    ];

    const count = Math.max(1, topics.length);
    const radius = 4.4;

    topics.forEach((_, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const geo = geometries[idx % geometries.length];
      const color = NODE_COLORS[idx % NODE_COLORS.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.25,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(Math.cos(angle) * radius, Math.sin(idx) * 0.6, Math.sin(angle) * radius);
      mesh.userData = { index: idx, baseColor: color };
      orbitGroup.add(mesh);
      topicMeshes.push(mesh);
    });

    // Mouse / Touch Drag Rotation & Raycaster Click
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
      orbitGroup.rotation.y += deltaX * 0.008;
      coreGroup.rotation.y += deltaX * 0.008;
      coreGroup.rotation.x += deltaY * 0.005;
      prevX = clientX;
      prevY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domElem.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      coreMesh.rotation.y += 0.008;
      coreMesh.rotation.x += 0.004;
      haloMesh.rotation.z -= 0.01;

      if (!isDragging) {
        orbitGroup.rotation.y += 0.0035;
      }

      const activeIdx = selectedIndexRef.current;
      coreMat.color.setHex(NODE_COLORS[activeIdx % NODE_COLORS.length]);

      topicMeshes.forEach((m, idx) => {
        m.rotation.y += 0.02;
        m.rotation.x += 0.01;
        const isSelected = idx === activeIdx;
        const targetScale = isSelected ? 1.45 + Math.sin(elapsed * 4) * 0.1 : 0.95;
        m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 700;
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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [chapterId, topics.length]);

  if (!chapter) {
    return (
      <div className="bg-slate-900 rounded-4xl p-12 border-4 border-sky-400 shadow-2xl text-white text-center font-bold">
        Loading 3D Chapter Model...
      </div>
    );
  }

  const currentTopic = topics[selectedTopicIndex] || chapter.title;

  const handleSelectTopic = (idx: number) => {
    soundEffects.playPop();
    setSelectedTopicIndex(idx);
    const topicText = topics[idx];
    speak(
      language === 'ml'
        ? `${topicText}. ${chapter.malayalamSummary}`
        : `${topicText}. From chapter ${chapter.title}: ${chapter.summary}`
    );
  };

  const handleNarrateChapter3D = () => {
    soundEffects.playPop();
    speak(
      language === 'ml'
        ? `${chapter.malayalamTitle}. ${chapter.malayalamSummary}. പ്രധാന വിഷയം: ${currentTopic}`
        : `Welcome to the 3D Interactive Model for ${chapter.title}! ${chapter.summary}. Currently viewing: ${currentTopic}.`
    );
  };

  return (
    <div className="bg-slate-900 rounded-4xl p-5 sm:p-7 border-4 border-sky-400 shadow-2xl text-white space-y-5">
      {/* Top 3D Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {subject?.icon || '🧊'} {language === 'ml' ? subject?.malayalamName : subject?.name} • Chapter{' '}
            {chapter.chapterNumber} in 3D
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            {language === 'ml' ? chapter.malayalamTitle : chapter.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {language === 'ml'
              ? '3D രൂപങ്ങൾ വിരൽ കൊണ്ട് കറക്കി നോക്കൂ, താഴെയുള്ള വിഷയങ്ങളിൽ തൊട്ട് ശബ്ദത്തോടെ പഠിക്കൂ!'
              : 'Drag to rotate the 3D concept nodes or tap any topic below to inspect and listen!'}
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

      {/* Interactive 3D WebGL Viewport */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner">
        <div ref={mountRef} className="w-full h-[380px] cursor-grab active:cursor-grabbing" />

        {/* Overlay Active Node HUD */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-sky-400/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Active 3D Concept Node ({selectedTopicIndex + 1} of {topics.length})
              </span>
            </span>
            <h4 className="text-base sm:text-lg font-black text-white">{currentTopic}</h4>
            <p className="text-xs text-slate-300 line-clamp-2">
              {language === 'ml' ? chapter.malayalamSummary : chapter.summary}
            </p>
          </div>

          <button
            onClick={() => handleSelectTopic((selectedTopicIndex + 1) % topics.length)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs whitespace-nowrap shadow-md"
          >
            {language === 'ml' ? 'അടുത്ത 3D ആശയം 👉' : 'Next 3D Node 👉'}
          </button>
        </div>
      </div>

      {/* Topic Selector Buttons for this Chapter */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase text-sky-300 tracking-wider">
          🎯 {language === 'ml' ? 'ഈ അധ്യായത്തിലെ 3D വിഷയങ്ങൾ (Tap to Explore & Listen):' : 'Chapter 3D Topics (Tap to Explore & Listen):'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTopic(idx)}
              className={`p-3.5 rounded-2xl text-left text-xs sm:text-sm font-black transition flex items-center justify-between border-2 ${
                selectedTopicIndex === idx
                  ? 'bg-sky-500 text-slate-950 border-amber-300 shadow-lg scale-[1.01]'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-sky-400'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <span>{topic}</span>
              </span>
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

