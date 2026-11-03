'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, RotateCcw, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface PlanetData {
  name: string;
  malayalamName: string;
  size: number;
  distance: number;
  speed: number;
  color: number;
  fact: string;
  factMalayalam: string;
  hasRings?: boolean;
}

const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    malayalamName: 'ബുധൻ',
    size: 0.5,
    distance: 4,
    speed: 0.04,
    color: 0xa8a29e,
    fact: 'Closest planet to the Sun! It has super hot days and freezing cold nights.',
    factMalayalam: 'സൂര്യനോട് ഏറ്റവും അടുത്തുള്ള ഗ്രഹം! പകൽ അതികഠിനമായ ചൂടും രാത്രി അതിശൈത്യവുമാണ്.',
  },
  {
    name: 'Venus',
    malayalamName: 'ശുക്രൻ',
    size: 0.8,
    distance: 6,
    speed: 0.03,
    color: 0xfbbf24,
    fact: 'The hottest and brightest planet! Thick yellow clouds trap heat like a giant oven.',
    factMalayalam: 'ഏറ്റവും ചൂടുള്ളതും തിളക്കമുള്ളതുമായ ഗ്രഹം! ഇതിന്റെ അന്തരീക്ഷത്തിലെ മേഘങ്ങൾ ചൂട് തടഞ്ഞുനിർത്തുന്നു.',
  },
  {
    name: 'Earth',
    malayalamName: 'ഭൂമി',
    size: 0.9,
    distance: 8.5,
    speed: 0.02,
    color: 0x38bdf8,
    fact: 'Our beautiful home! The only known planet with blue oceans, fresh air, and life.',
    factMalayalam: 'നമ്മുടെ മനോഹരമായ വീട്! നീല സമുദ്രങ്ങളും വായുവും ജീവനുമുള്ള ഏക ഗ്രഹം.',
  },
  {
    name: 'Mars',
    malayalamName: 'ചൊവ്വ',
    size: 0.6,
    distance: 11,
    speed: 0.016,
    color: 0xef4444,
    fact: 'The Red Planet! Its soil is rich in reddish iron rust and has giant canyons.',
    factMalayalam: 'ചുവന്ന ഗ്രഹം! മണ്ണിൽ ഇരുമ്പിന്റെ അംശം കൂടുതലുള്ളതിനാലാണ് ഇത് ചുവന്ന് കാണപ്പെടുന്നത്.',
  },
  {
    name: 'Jupiter',
    malayalamName: 'വ്യാഴം',
    size: 1.8,
    distance: 14.5,
    speed: 0.01,
    color: 0xd97706,
    fact: 'The King of Planets! Largest gas giant with a Great Red Spot storm larger than Earth.',
    factMalayalam: 'ഗ്രഹങ്ങളുടെ രാജാവ്! ഭൂമിയേക്കാൾ വലിയ കൊടുങ്കാറ്റുള്ള സൗരയൂഥത്തിലെ ഏറ്റവും വലിയ ഗ്രഹം.',
  },
  {
    name: 'Saturn',
    malayalamName: 'ശനി',
    size: 1.4,
    distance: 18.5,
    speed: 0.007,
    color: 0xfef08a,
    fact: 'The Ringed Jewel! Surrounded by dazzling wide rings made of sparkling ice and dust.',
    factMalayalam: 'വളയങ്ങളുള്ള അത്ഭുത ഗ്രഹം! മഞ്ഞുകട്ടകളും പൊടിയും കൊണ്ടുള്ള മനോഹരമായ വളയങ്ങളുണ്ട്.',
    hasRings: true,
  },
  {
    name: 'Uranus',
    malayalamName: 'യുറാനസ്',
    size: 1.0,
    distance: 22,
    speed: 0.005,
    color: 0x67e8f9,
    fact: 'The Tilted Ice Giant! It spins on its side and has freezing temperatures.',
    factMalayalam: 'ചരിഞ്ഞു കറങ്ങുന്ന തണുത്തുറഞ്ഞ ഗ്രഹം! നീലനിറത്തിലുള്ള ഒരു ഐസ് ഭീമനാണിത്.',
  },
  {
    name: 'Neptune',
    malayalamName: 'നെപ്റ്റ്യൂൺ',
    size: 0.95,
    distance: 25.5,
    speed: 0.0035,
    color: 0x3b82f6,
    fact: 'The Windy Deep Blue Planet! Furthest from the Sun with supersonic wild storms.',
    factMalayalam: 'സൂര്യനിൽ നിന്ന് ഏറ്റവും അകലെയുള്ള, ശക്തമായ കാറ്റടിക്കുന്ന ആഴമേറിയ നീല ഗ്രഹം.',
  },
];

export default function SolarSystem3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, speak } = useApp();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(PLANETS[2]); // Default Earth
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(28);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050816);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, zoomLevel);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Stars background particles
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 120;
      starPositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfffbeb, 4, 150);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Sun (Emissive sphere)
    const sunGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Planet meshes array for raycasting and orbiting
    const planetMeshes: { mesh: THREE.Mesh; data: PlanetData; angle: number; orbitLine: THREE.Line }[] = [];

    PLANETS.forEach((p, idx) => {
      // Orbit circle line
      const orbitCurve = new THREE.EllipseCurve(0, 0, p.distance, p.distance, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(64);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((pt) => new THREE.Vector3(pt.x, 0, pt.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Planet sphere
      const pGeo = new THREE.SphereGeometry(p.size, 24, 24);
      const pMat = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 0.7,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.userData = { planetData: p };

      // Optional rings for Saturn
      if (p.hasRings) {
        const ringGeo = new THREE.RingGeometry(p.size * 1.4, p.size * 2.3, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xd8b4fe,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);
      }

      const startAngle = idx * 0.8;
      mesh.position.set(Math.cos(startAngle) * p.distance, 0, Math.sin(startAngle) * p.distance);
      scene.add(mesh);

      planetMeshes.push({ mesh, data: p, angle: startAngle, orbitLine });
    });

    // Raycaster for clicking planets
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes.map((p) => p.mesh));

      if (intersects.length > 0) {
        const clicked = intersects[0].object.userData.planetData as PlanetData;
        if (clicked) {
          setSelectedPlanet(clicked);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Mouse drag rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      scene.rotation.y += deltaX * 0.005;
      scene.rotation.x = Math.max(-0.4, Math.min(0.6, scene.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Sun slowly
      sunMesh.rotation.y += 0.003;

      // Orbit planets
      planetMeshes.forEach((item) => {
        if (!isPaused) {
          item.angle += item.data.speed * 0.6;
          item.mesh.position.x = Math.cos(item.angle) * item.data.distance;
          item.mesh.position.z = Math.sin(item.angle) * item.data.distance;
        }
        item.mesh.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPaused, zoomLevel]);

  const readPlanetFact = () => {
    if (!selectedPlanet) return;
    const text = language === 'ml'
      ? `${selectedPlanet.malayalamName}. ${selectedPlanet.factMalayalam}`
      : `${selectedPlanet.name}. ${selectedPlanet.fact}`;
    speak(text);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border-4 border-sky-400 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-[450px] cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-sky-500/40 text-white flex items-center space-x-2">
        <span className="text-xl">🚀</span>
        <div>
          <p className="text-xs font-semibold text-sky-400">3D Science World</p>
          <p className="text-sm font-bold">Interactive Solar System</p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-slate-900/80 hover:bg-slate-800 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isPaused ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span>{isPaused ? 'Resume Orbit' : 'Pause'}</span>
        </button>
      </div>

      {/* Selected Planet Card / Explanations */}
      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-sky-400 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex-shrink-0"
              style={{ backgroundColor: `#${selectedPlanet.color.toString(16).padStart(6, '0')}` }}
            />
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-bold text-sky-300">
                  {language === 'ml' ? selectedPlanet.malayalamName : selectedPlanet.name}
                </h4>
                <span className="text-xs text-slate-400">
                  ({language === 'ml' ? selectedPlanet.name : selectedPlanet.malayalamName})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 max-w-xl">
                {language === 'ml' ? selectedPlanet.factMalayalam : selectedPlanet.fact}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={readPlanetFact}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition text-xs shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ml' ? 'ശബ്ദം കേൾക്കാം' : 'Listen'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

