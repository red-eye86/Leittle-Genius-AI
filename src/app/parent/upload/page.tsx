'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { Subject, Textbook, ClassGrade } from '@/lib/db/types';

export default function TextbookUploadPage() {
  const router = useRouter();
  const { allChildren, language, t } = useApp();

  const [selectedChildId, setSelectedChildId] = useState('child-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [classGrade, setClassGrade] = useState<ClassGrade>('Class 4');
  const [file, setFile] = useState<File | null>(null);
  const [ocrEnabled, setOcrEnabled] = useState(true);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`/api/data/subjects?childId=${selectedChildId}`)
      .then((res) => res.json())
      .then((data) => {
        const subs = data.subjects || [];
        setSubjects(subs);
        if (subs.length > 0) setSelectedSubjectId(subs[0].id);
      });

    const currentChild = allChildren.find((c) => c.id === selectedChildId);
    if (currentChild) setClassGrade(currentChild.classGrade);
  }, [selectedChildId, allChildren]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a PDF textbook or learning material file');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('childId', selectedChildId);
    formData.append('subjectId', selectedSubjectId);
    formData.append('title', title || file.name);
    formData.append('academicYear', academicYear);
    formData.append('classGrade', classGrade);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        soundEffects.playStar();
        setUploadResult(data);
      } else {
        soundEffects.playIncorrect();
        setErrorMsg(data.error || 'Failed to upload textbook');
      }
    } catch (err: any) {
      soundEffects.playIncorrect();
      setErrorMsg(err.message || 'Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/parent/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Parent Dashboard</span>
        </button>

        <button
          onClick={() => router.push('/parent/library')}
          className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <BookOpen className="w-4 h-4" />
          <span>View Uploaded Library</span>
        </button>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center space-x-2">
          <Upload className="w-8 h-8 text-indigo-600" />
          <span>Textbook & Syllabus Uploader</span>
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          Upload PDF textbooks, ebooks, notes or worksheets. AI automatically extracts chapters, builds quizzes, and grounds all lessons.
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-4xl p-6 sm:p-10 border-4 border-indigo-200 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Child Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Select Child</label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
            >
              {allChildren.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.avatar} {c.name} ({c.classGrade})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Assign to Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name} ({s.malayalamName})
                </option>
              ))}
            </select>
          </div>

          {/* Textbook Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Textbook Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ICSE Living Science Grade 3"
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Academic Year</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Drag & Drop File Input */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500">Upload File (PDF / DOCX / Scanned Pages)</label>
          <div className="border-3 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-3xl p-8 text-center cursor-pointer transition">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
              <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">
                  {file ? file.name : 'Click or drag textbook PDF here'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Supported: PDF textbooks, worksheets, scanned docs'}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* OCR Toggle */}
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
          <input
            type="checkbox"
            id="ocr"
            checked={ocrEnabled}
            onChange={(e) => setOcrEnabled(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
          <label htmlFor="ocr">Enable OCR text extraction for scanned pages</label>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-lg transition btn-kid-3d flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
              <span>Extracting Textbook & Generating Chapters...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Process & Save Textbook</span>
            </>
          )}
        </button>
      </form>

      {/* Success Review Box (Section 5 item 7: review extracted textbook content) */}
      {uploadResult && (
        <div className="bg-emerald-50 border-3 border-emerald-400 rounded-4xl p-6 sm:p-8 space-y-4 animate-fade-in">
          <div className="flex items-center space-x-3 text-emerald-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            <div>
              <h3 className="text-xl font-black">
                Textbook Processed Successfully!
              </h3>
              <p className="text-xs font-bold text-emerald-700">
                Extracted {uploadResult.chaptersCount} chapters and indexed for AI retrieval.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-emerald-200 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500">
              Extracted Chapters Preview:
            </h4>
            <div className="space-y-2">
              {uploadResult.textbook?.chapters?.map((chap: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Chapter {chap.chapterNumber}: {chap.title}</span>
                  <span className="text-[10px] text-slate-400">{chap.topics?.length || 0} topics</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => router.push('/parent/library')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm"
            >
              Go to Textbook Library 👉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

