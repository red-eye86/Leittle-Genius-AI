'use client';

import React, { useState } from 'react';
import { X, Upload, Check, Camera, Sparkles, User, Palette } from 'lucide-react';
import { ChildProfile, ClassGrade } from '@/lib/db/types';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import KidAvatar from './KidAvatar';

interface EditChildProfileModalProps {
  child: ChildProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: ChildProfile) => void;
}

const AVATAR_OPTIONS = [
  '🦉', '🐰', '🦁', '🐯', '🚀', '🦄',
  '🐼', '🐬', '🦖', '🐱', '🐶', '🐻',
  '🦊', '🐨', '🐧', '🦸', '🧙', '👑',
];

const THEME_COLORS = [
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Rose Pink', hex: '#ec4899' },
  { name: 'Emerald Mint', hex: '#10b981' },
  { name: 'Warm Amber', hex: '#f59e0b' },
  { name: 'Royal Purple', hex: '#8b5cf6' },
  { name: 'Sunset Orange', hex: '#f97316' },
];

export default function EditChildProfileModal({
  child,
  isOpen,
  onClose,
  onSave,
}: EditChildProfileModalProps) {
  const { refreshProfiles } = useApp();

  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age);
  const [classGrade, setClassGrade] = useState<ClassGrade>(child.classGrade);
  const [avatar, setAvatar] = useState(child.avatar);
  const [themeColor, setThemeColor] = useState(child.themeColor || '#38bdf8');
  const [learningPace, setLearningPace] = useState(child.learningPace || 'normal');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle local photo upload and compress to 256x256 data URL
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, WebP).');
        return;
      }

      setError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 256;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Center crop square
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setAvatar(dataUrl);
            soundEffects.playPop();
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name for your child.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/data/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: child.id,
          name: name.trim(),
          age: Number(age),
          classGrade,
          avatar,
          themeColor,
          learningPace,
        }),
      });

      if (res.ok) {
        soundEffects.playStar();
        await refreshProfiles();
        if (onSave) {
          onSave({
            ...child,
            name: name.trim(),
            age: Number(age),
            classGrade,
            avatar,
            themeColor,
            learningPace,
          });
        }
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-5xl p-6 sm:p-8 max-w-lg w-full border-4 border-indigo-400 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Edit Child Profile
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              Update name, grade, avatar or upload your child&apos;s photo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar / Photo Selector Preview */}
          <div className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center space-y-3">
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-3xl p-1.5 shadow-md flex items-center justify-center border-4"
                style={{ borderColor: themeColor }}
              >
                <KidAvatar avatar={avatar} size="2xl" />
              </div>

              <label
                htmlFor="photo-upload"
                className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg cursor-pointer transition active:scale-95"
                title="Upload real photo"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-center">
              <p className="text-xs font-black text-slate-700">Choose Avatar or Upload Photo</p>
              <label
                htmlFor="photo-upload"
                className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer inline-flex items-center space-x-1 mt-0.5"
              >
                <Upload className="w-3 h-3" />
                <span>Upload a custom photo from device</span>
              </label>
            </div>

            {/* Cartoon Emoji Avatars Grid */}
            <div className="grid grid-cols-6 gap-2 w-full pt-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setAvatar(av);
                  }}
                  className={`h-10 text-xl rounded-xl flex items-center justify-center transition ${
                    avatar === av
                      ? 'bg-indigo-100 border-2 border-indigo-500 scale-110 shadow-sm'
                      : 'bg-white hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Child Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Child&apos;s Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav, Diya"
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Age and Class / Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500">Age</label>
              <input
                type="number"
                min={3}
                max={15}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500">Class / Grade</label>
              <select
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value as ClassGrade)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="UKG">UKG (Kindergarten)</option>
                <option value="Class 3">Class 3 (Primary)</option>
              </select>
            </div>
          </div>

          {/* Theme Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Color</span>
            </label>
            <div className="flex items-center space-x-3">
              {THEME_COLORS.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setThemeColor(col.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    themeColor === col.hex ? 'scale-125 border-slate-800 shadow-md' : 'border-white'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Learning Pace */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Learning Pace</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gentle', label: 'Gentle 🎈' },
                { id: 'normal', label: 'Normal ⭐' },
                { id: 'advanced', label: 'Advanced 🚀' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLearningPace(p.id as any)}
                  className={`py-2 text-xs font-black rounded-xl border-2 transition ${
                    learningPace === p.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-500">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition btn-kid-3d"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

