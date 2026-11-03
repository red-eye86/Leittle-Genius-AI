'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface MathBlocks3DProps {
  isUKG?: boolean;
}

export default function MathBlocks3D({ isUKG = false }: MathBlocks3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, speak, addStars } = useApp();

  // Problem state
  const [numA, setNumA] = useState(isUKG ? 3 : 4);
  const [numB, setNumB] = useState(isUKG ? 2 : 3);
  const [collectedCount, setCollectedCount] = useState(0);
  const [solved, setSolved] = useState(false);

  const targetSum = numA + numB;

  const resetProblem = () => {
    if (isUKG) {
      const a = Math.floor(Math.random() * 3) + 1; // 1-3
      const b = Math.floor(Math.random() * 3) + 1; // 1-3
      setNumA(a);
      setNumB(b);
    } else {
      const a = Math.floor(Math.random() * 4) + 2; // 2-5
      const b = Math.floor(Math.random() * 4) + 2; // 2-5
      setNumA(a);
      setNumB(b);
    }
    setCollectedCount(0);
    setSolved(false);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0fdf4); // Mint soft backdrop

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.5);
    dirLight.position.set(5, 12, 8);
    scene.add(dirLight);

    // Ground plane (wooden table look)
    const tableGeo = new THREE.CylinderGeometry(8, 8, 0.4, 32);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.3;
    scene.add(table);

    // Group A objects (Red apples/blocks)
    const blockMeshes: THREE.Mesh[] = [];

    const createKidObject = (x: number, z: number, color: number) => {
      const geo = new THREE.DodecahedronGeometry(0.7, 1);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 0.7, z);
      scene.add(mesh);
      blockMeshes.push(mesh);
      return mesh;
    };

    // Spawn group A on the left
    for (let i = 0; i < numA; i++) {
      const offsetX = -4.5 + (i % 3) * 1.6;
      const offsetZ = Math.floor(i / 3) * 1.6 - 1;
      createKidObject(offsetX, offsetZ, 0xef4444); // Red
    }

    // Spawn group B on the right
    for (let i = 0; i < numB; i++) {
      const offsetX = 1.5 + (i % 3) * 1.6;
      const offsetZ = Math.floor(i / 3) * 1.6 - 1;
      createKidObject(offsetX, offsetZ, 0x10b981); // Emerald Green
    }

    // Raycaster for clicking 3D objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blockMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (!hit.userData.collected) {
          hit.userData.collected = true;
          soundEffects.playPop();

          // Animate jump into center basket
          hit.position.y = 2.5;
          (hit.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);

          setCollectedCount((prev) => {
            const next = prev + 1;
            const countSpeech = language === 'ml' ? `${next}` : `${next}!`;
            speak(countSpeech);

            if (next === targetSum) {
              setSolved(true);
              soundEffects.playCorrect();
              addStars(3);
            }
            return next;
          });
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      blockMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += 0.01;
        if (mesh.userData.collected) {
          mesh.position.y = 1.2 + Math.sin(Date.now() * 0.005 + idx) * 0.2;
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
  }, [numA, numB, targetSum, language]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-100 to-teal-50 border-4 border-emerald-400 shadow-xl">
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-[400px] cursor-pointer" />

      {/* Top Problem Banner */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-emerald-400 shadow-lg pointer-events-auto flex items-center space-x-3">
          <span className="text-2xl">🍎</span>
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              {language === 'ml' ? '3D ഗണിത കളി' : '3D Math Counting World'}
            </p>
            <h3 className="text-lg font-black text-slate-800">
              {numA} {language === 'ml' ? 'ചുവപ്പ്' : 'Red'} + {numB} {language === 'ml' ? 'പച്ച' : 'Green'} = {targetSum}
            </h3>
          </div>
        </div>

        <button
          onClick={resetProblem}
          className="bg-white hover:bg-emerald-50 text-slate-700 px-4 py-2.5 rounded-2xl border-2 border-emerald-300 font-bold text-xs flex items-center space-x-1.5 shadow-md pointer-events-auto transition"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>{language === 'ml' ? 'പുതിയ ചോദ്യം' : 'New Puzzle'}</span>
        </button>
      </div>

      {/* Bottom Interactive Guide */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-emerald-300 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-xl flex items-center justify-center shadow-md">
            {collectedCount} / {targetSum}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {solved
                ? language === 'ml'
                  ? 'അതിശയകരം! നിങ്ങൾ ശരിയായി എണ്ണി! ⭐ +3 നക്ഷത്രങ്ങൾ'
                  : 'Hurray! You solved it! ⭐ +3 Stars'
                : language === 'ml'
                ? 'എണ്ണാൻ ഓരോ ആപ്പിളിലും വിരൽ തൊടൂ!'
                : 'Tap each 3D object to count and add!'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'ml' ? 'ശബ്ദം കേട്ട് പഠിക്കാം' : 'Hear the counts out loud as you tap!'}
            </p>
          </div>
        </div>

        {solved && (
          <div className="flex items-center space-x-2 text-emerald-600 font-black animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <span>{language === 'ml' ? 'വിജയം!' : 'Awesome!'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

