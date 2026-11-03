'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface LetterItem {
  char: string;
  word: string;
  malayalamWord: string;
  emoji: string;
  phonics: string;
  color: number;
}

const LETTERS_EN: LetterItem[] = [
  { char: 'A', word: 'Apple', malayalamWord: 'ആപ്പിൾ', emoji: '🍎', phonics: 'Ah for Apple', color: 0xef4444 },
  { char: 'B', word: 'Ball', malayalamWord: 'പന്ത്', emoji: '⚽', phonics: 'Buh for Ball', color: 0x3b82f6 },
  { char: 'C', word: 'Cat', malayalamWord: 'പൂച്ച', emoji: '🐱', phonics: 'Kuh for Cat', color: 0xf59e0b },
  { char: 'D', word: 'Dog', malayalamWord: 'പട്ടി', emoji: '🐶', phonics: 'Duh for Dog', color: 0x10b981 },
  { char: 'E', word: 'Elephant', malayalamWord: 'ആന', emoji: '🐘', phonics: 'Eh for Elephant', color: 0x8b5cf6 },
  { char: 'F', word: 'Fish', malayalamWord: 'മത്സ്യം', emoji: '🐟', phonics: 'Fuh for Fish', color: 0x06b6d4 },
];

export default function AlphabetWorld3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, speak, addStars } = useApp();
  const [activeLetter, setActiveLetter] = useState<LetterItem>(LETTERS_EN[0]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfdf4ff); // Soft playful purple/pink

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.0);
    dirLight.position.set(4, 10, 6);
    scene.add(dirLight);

    // 3D Letter podiums
    const letterMeshes: { mesh: THREE.Mesh; item: LetterItem; basePosY: number }[] = [];

    LETTERS_EN.forEach((item, idx) => {
      const geo = new THREE.CylinderGeometry(0.85, 0.95, 1.4, 28);
      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.3,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const x = (idx - 2.5) * 2.2;
      mesh.position.set(x, 0, 0);
      mesh.userData = { letterItem: item };
      scene.add(mesh);

      letterMeshes.push({ mesh, item, basePosY: 0 });
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(letterMeshes.map((l) => l.mesh));

      if (intersects.length > 0) {
        const item = intersects[0].object.userData.letterItem as LetterItem;
        if (item) {
          setActiveLetter(item);
          soundEffects.playStar();
          addStars(1);

          // Jump animation
          intersects[0].object.position.y = 1.0;

          const textToSpeak = language === 'ml'
            ? `${item.char}. ${item.word}. ${item.malayalamWord}`
            : `${item.char}. ${item.phonics}`;
          speak(textToSpeak);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      letterMeshes.forEach((item, idx) => {
        item.mesh.rotation.y += 0.015;
        // Float effect
        if (item.mesh.position.y > 0) {
          item.mesh.position.y -= 0.02; // settle down
        } else {
          item.mesh.position.y = Math.sin(Date.now() * 0.003 + idx) * 0.15;
        }
      });
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('click', handleClick);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [language]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-purple-100 to-pink-50 border-4 border-purple-400 shadow-xl">
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-[380px] cursor-pointer" />

      {/* Top Banner */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-purple-300 shadow-md flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
        <div>
          <p className="text-xs font-bold text-purple-600 uppercase">3D Phonics & Alphabet</p>
          <p className="text-sm font-black text-slate-800">Tap Any 3D Letter!</p>
        </div>
      </div>

      {/* Selected Letter Showcase Card */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-purple-400 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 rounded-2xl text-white font-black text-3xl flex items-center justify-center shadow-lg transform -rotate-3"
            style={{ backgroundColor: `#${activeLetter.color.toString(16).padStart(6, '0')}` }}
          >
            {activeLetter.char}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{activeLetter.emoji}</span>
              <h4 className="text-xl font-black text-slate-800">
                {activeLetter.char} for {activeLetter.word}
              </h4>
            </div>
            <p className="text-sm font-bold text-purple-600 mt-0.5">
              {language === 'ml' ? activeLetter.malayalamWord : activeLetter.phonics}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const textToSpeak = language === 'ml'
              ? `${activeLetter.char}. ${activeLetter.word}. ${activeLetter.malayalamWord}`
              : `${activeLetter.char}. ${activeLetter.phonics}`;
            speak(textToSpeak);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-md transition"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-xs">{language === 'ml' ? 'ശബ്ദം' : 'Phonics'}</span>
        </button>
      </div>
    </div>
  );
}

