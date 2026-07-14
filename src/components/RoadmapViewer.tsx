import { GitFork, ArrowRight, CornerDownRight, CheckSquare, Layers, HelpCircle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Roadmap, RoadmapStep } from '../types';
import { ROADMAPS } from '../data/archiveData';

interface RoadmapViewerProps {
  initialRoadmapId?: string;
  onNavigate: (route: string) => void;
  isDarkMode: boolean;
}

export default function RoadmapViewer({
  initialRoadmapId,
  onNavigate,
  isDarkMode
}: RoadmapViewerProps) {
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap>(ROADMAPS[0]);
  const [selectedStep, setSelectedStep] = useState<RoadmapStep>(ROADMAPS[0].steps[0]);

  useEffect(() => {
    if (initialRoadmapId) {
      const found = ROADMAPS.find((r) => r.id === initialRoadmapId);
      if (found) {
        setActiveRoadmap(found);
        setSelectedStep(found.steps[0]);
      }
    }
  }, [initialRoadmapId]);

  return (
    <div id="roadmap-viewer-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
      {/* Header */}
      <div className="border-b pb-4 mb-8">
        <div className="text-[10px] opacity-40 mb-1">SYSTEM_ARCHITECTURE::LEARNING_PATHWAYS</div>
        <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
          [ROADMAPS_VIEWER]
        </h1>
        <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
          Step-by-step curriculum maps mapping out foundational to advanced software competencies. Click on individual nodes to unlock reference articles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Select Roadmap (cols-3) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-[10px] opacity-40 font-bold">SELECT_MAP</div>
          <div className={`border p-2 space-y-1 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            {ROADMAPS.map((r) => (
              <button
                id={`roadmap-playlist-${r.id}`}
                key={r.id}
                onClick={() => {
                  setActiveRoadmap(r);
                  setSelectedStep(r.steps[0]);
                }}
                className={`w-full text-left p-3 text-xs transition-colors flex items-center justify-between ${
                  activeRoadmap.id === r.id
                    ? isDarkMode
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-black font-bold'
                    : isDarkMode
                      ? 'text-neutral-500 hover:text-neutral-300'
                      : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <GitFork size={12} className="opacity-60" />
                  <span className="truncate tracking-tight">{r.title.toUpperCase().replace(' ROADMAP', '')}</span>
                </div>
              </button>
            ))}
          </div>

          <div className={`p-4 border text-[11px] leading-relaxed font-sans ${
            isDarkMode ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400' : 'bg-neutral-50/50 border-neutral-200 text-neutral-600'
          }`}>
            <div className="font-mono text-[9px] opacity-50 border-b pb-1 mb-2">ROADMAP_OVERVIEW.LOG</div>
            {activeRoadmap.description}
          </div>
        </div>

        {/* Middle Column: Interconnected Steps (cols-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[10px] opacity-40 font-bold">SYLLABUS_NODES</div>

          <div className="relative space-y-4">
            {activeRoadmap.steps.map((step, index) => {
              const isSelected = selectedStep.id === step.id;
              const hasNext = index < activeRoadmap.steps.length - 1;

              return (
                <div id={`roadmap-node-container-${step.id}`} key={step.id} className="relative">
                  {/* Connector Line to Next Step */}
                  {hasNext && (
                    <div className={`absolute left-6 top-12 bottom-0 w-[1px] -z-10 ${
                      isDarkMode ? 'bg-neutral-800' : 'bg-neutral-200'
                    }`} />
                  )}

                  {/* Step Button Node */}
                  <button
                    id={`roadmap-node-${step.id}`}
                    onClick={() => setSelectedStep(step)}
                    className={`w-full text-left p-4 border transition-all flex items-start space-x-4 ${
                      isSelected
                        ? isDarkMode
                          ? 'border-white bg-neutral-950 text-white'
                          : 'border-black bg-neutral-50 text-black'
                        : isDarkMode
                          ? 'border-neutral-800 hover:border-neutral-600 text-neutral-400'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                    }`}
                  >
                    {/* Circle Node Counter */}
                    <div className={`w-5 h-5 rounded-none border text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-white border-black'
                        : isDarkMode
                          ? 'border-neutral-800 bg-black text-neutral-500'
                          : 'border-neutral-200 bg-white text-neutral-400'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className={`text-xs font-bold tracking-tight uppercase ${
                        isSelected ? 'opacity-100' : 'opacity-70'
                      }`}>
                        {step.title}
                      </div>
                      <p className="text-[10px] opacity-50 line-clamp-1 leading-relaxed font-sans">
                        {step.desc}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Details & Reference Core Reader (cols-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-[10px] opacity-40 font-bold">NODE_INSPECTOR</div>

          <AnimatePresence mode="wait">
            <motion.div
              id={`roadmap-inspector-${selectedStep.id}`}
              key={selectedStep.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`border p-5 space-y-4 ${
                isDarkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-200 bg-neutral-50/10'
              }`}
            >
              {/* Node Title */}
              <div className="border-b pb-3 mb-2">
                <span className="text-[9px] opacity-50 block mb-1">INSPECTOR::STEP_DETAILS</span>
                <h3 className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {selectedStep.title}
                </h3>
              </div>

              {/* Node Description */}
              <div className="space-y-1">
                <span className="text-[9px] opacity-40 block">DESCRIPTION:</span>
                <p className="text-[11px] font-sans opacity-70 leading-relaxed">
                  {selectedStep.desc}
                </p>
              </div>

              {/* Resource Connector */}
              {selectedStep.resourceId ? (
                <div className={`p-4 border ${isDarkMode ? 'border-neutral-800 bg-black/40' : 'border-neutral-200 bg-white'}`}>
                  <span className="text-[9px] opacity-40 block mb-2">CONNECTED_REFERENCE_ARTICLE:</span>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-[11px] font-bold tracking-tight line-clamp-2 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                        {selectedStep.resourceId.toUpperCase().replace(/-/g, ' ')}
                      </h4>
                    </div>
                  </div>

                  <button
                    id="roadmap-inspector-open-article"
                    onClick={() => onNavigate(`/resources/${selectedStep.resourceId}`)}
                    className={`w-full mt-4 py-2 border text-[10px] tracking-widest font-bold transition-all text-center flex items-center justify-center space-x-1.5 ${
                      isDarkMode
                        ? 'border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 text-white'
                        : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100 text-black'
                    }`}
                  >
                    <span>OPEN_REFERENCE_ARTICLE</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              ) : (
                <div className={`p-4 border text-center text-xs opacity-50 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                  NO REFERENCE_DOCUMENT LINKED TO THIS NODE
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
