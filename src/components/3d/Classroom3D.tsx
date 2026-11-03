'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export default function Classroom3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, activeChild } = useApp();

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfefce8); // Warm classroom yellow tint

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 11);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfef08a, 2.5, 50);
    pointLight.position.set(0, 6, 4);
    scene.add(pointLight);

    // Blackboard (Chalkboard)
    const boardGeo = new THREE.BoxGeometry(9, 4.5, 0.2);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 }); // Forest green chalkboard
    const blackboard = new THREE.Mesh(boardGeo, boardMat);
    blackboard.position.set(0, 2.5, -3);
    scene.add(blackboard);

    // Wooden frame around chalkboard
    const frameGeo = new THREE.BoxGeometry(9.4, 4.8, 0.15);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 2.5, -3.05);
    scene.add(frame);

    // Teacher Desk
    const deskGeo = new THREE.BoxGeometry(4.5, 1.6, 2.2);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.8, 0);
    scene.add(desk);

    // Mascot Teacher "Hootie" Avatar Body (Soft cute owl shape on desk)
    const owlGroup = new THREE.Group();

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.8;
    owlGroup.add(body);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeLeft = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    eyeLeft.position.set(-0.25, 2.0, 0.6);
    owlGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    eyeRight.position.set(0.25, 2.0, 0.6);
    owlGroup.add(eyeRight);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const pLeft = new THREE.Mesh(pupilGeo, pupilMat);
    pLeft.position.set(-0.25, 2.0, 0.75);
    owlGroup.add(pLeft);

    const pRight = new THREE.Mesh(pupilGeo, pupilMat);
    pRight.position.set(0.25, 2.0, 0.75);
    owlGroup.add(pRight);

    // Cute beak
    const beakGeo = new THREE.ConeGeometry(0.12, 0.25, 8);
    const beakMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 1.85, 0.75);
    owlGroup.add(beak);

    // Graduation Cap
    const capGeo = new THREE.BoxGeometry(0.9, 0.08, 0.9);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 2.55, 0);
    owlGroup.add(cap);

    scene.add(owlGroup);

    // Floating colorful books
    const bookColors = [0xef4444, 0x3b82f6, 0x10b981];
    const floatingBooks: THREE.Mesh[] = [];

    bookColors.forEach((col, idx) => {
      const bGeo = new THREE.BoxGeometry(0.8, 0.2, 1.1);
      const bMat = new THREE.MeshStandardMaterial({ color: col });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set((idx - 1) * 2.8, 2.8, -0.5);
      scene.add(bMesh);
      floatingBooks.push(bMesh);
    });

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      // Gentle owl bobbing & nodding
      owlGroup.position.y = Math.sin(Date.now() * 0.003) * 0.12;
      owlGroup.rotation.y = Math.sin(Date.now() * 0.0015) * 0.2;

      // Floating books
      floatingBooks.forEach((book, idx) => {
        book.rotation.y += 0.01;
        book.position.y = 2.8 + Math.sin(Date.now() * 0.003 + idx * 1.5) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-400 shadow-xl">
      <div ref={mountRef} className="w-full h-[380px]" />

      {/* Classroom blackboard text banner overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-950/90 text-emerald-100 px-6 py-2.5 rounded-2xl border-2 border-emerald-400/50 shadow-xl text-center pointer-events-none">
        <p className="text-xs text-emerald-300 font-semibold tracking-wider uppercase">
          {language === 'ml' ? 'ഹുട്ടി ടീച്ചറുടെ ക്ലാസ്സ്‌റൂം' : "Hootie's Virtual Classroom"}
        </p>
        <h4 className="text-base sm:text-lg font-black text-white flex items-center justify-center space-x-2">
          <span>{activeChild?.name ? `${activeChild.name}'s Desk` : 'Classroom'}</span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </h4>
      </div>

      {/* Bottom badge */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border-2 border-amber-300 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦉</span>
          <div>
            <p className="text-xs font-bold text-amber-800">
              {language === 'ml' ? 'ടീച്ചർ ഹുട്ടി നിങ്ങളെ സഹായിക്കാൻ ഇവിടെയുണ്ട്' : 'Teacher Hootie is ready to teach!'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'ml' ? 'സംശയങ്ങൾ ചോദിക്കൂ, ഒരുമിച്ച് പഠിക്കാം!' : 'Click any subject or chapter to begin your lesson!'}
            </p>
          </div>
        </div>

        <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{activeChild?.classGrade}</span>
        </div>
      </div>
    </div>
  );
}

