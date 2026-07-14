import { Folder, ArrowRight, ArrowLeft, GitFork, Star, Eye, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Topic } from '../types';
import { TOPICS, RESOURCES } from '../data/archiveData';

interface TopicExplorerProps {
  initialTopicId?: string;
  onNavigate: (route: string) => void;
  isDarkMode: boolean;
}

export default function TopicExplorer({
  initialTopicId,
  onNavigate,
  isDarkMode
}: TopicExplorerProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (initialTopicId) {
      const found = TOPICS.find((t) => t.id === initialTopicId);
      if (found) {
        setSelectedTopic(found);
      } else {
        setSelectedTopic(null);
      }
    } else {
      setSelectedTopic(null);
    }
  }, [initialTopicId]);

  // Group topics by category
  const categories: { [key: string]: Topic[] } = {
    'System Design': TOPICS.filter((t) => t.category === 'System Design'),
    'Language': TOPICS.filter((t) => t.category === 'Language'),
    'Infrastructure': TOPICS.filter((t) => t.category === 'Infrastructure'),
    'AI & Data': TOPICS.filter((t) => t.category === 'AI & Data'),
    'Security & Core': TOPICS.filter((t) => t.category === 'Security & Core')
  };

  const handleSelectTopic = (topic: Topic) => {
    onNavigate(`#/topics/${topic.id}`);
  };

  const handleBack = () => {
    onNavigate('#/topics');
  };

  return (
    <div id="topic-explorer-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          /* GRID VIEW */
          <motion.div
            id="topic-grid-view"
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Header */}
            <div className="border-b pb-4 mb-8">
              <div className="text-[10px] opacity-40 mb-1">SYSTEM_DIRECTORY::INDEX_TREE</div>
              <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                [TOPICS_EXPLORER]
              </h1>
              <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
                Select an engineering segment to explore highly specialized resources, interactive syllabi, and curated technical archives.
              </p>
            </div>

            {/* Category Groups */}
            <div className="space-y-10">
              {Object.entries(categories).map(([categoryName, topicList]) => {
                if (topicList.length === 0) return null;
                return (
                  <div id={`category-group-${categoryName.toLowerCase().replace(/\s+/g, '-')}`} key={categoryName} className="space-y-3">
                    <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
                      <span>SEGMENT::{categoryName.toUpperCase()}</span>
                      <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topicList.map((topic) => (
                        <button
                          id={`topic-card-${topic.id}`}
                          key={topic.id}
                          onClick={() => handleSelectTopic(topic)}
                          className={`text-left p-4 border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                            isDarkMode
                              ? 'border-neutral-800 hover:border-neutral-500 bg-neutral-950/20'
                              : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center space-x-2 text-neutral-400 mb-2">
                              <Folder size={14} className="opacity-60" />
                              <span className="text-[9px]">ID: {topic.id.toUpperCase()}</span>
                            </div>
                            <h3 className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                              {topic.name}
                            </h3>
                            <p className="text-[10px] opacity-50 mt-1.5 line-clamp-2 leading-relaxed">
                              {topic.overview}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-6 border-t pt-2 opacity-60 text-[9px]">
                            <span>{topic.resourceIds.length} RESOURCE NODES</span>
                            <ArrowRight size={10} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* DETAIL SCREEN VIEW */
          <motion.div
            id={`topic-detail-view-${selectedTopic.id}`}
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Back Bar / Quick details (cols-4) */}
            <div className="lg:col-span-4 space-y-6">
              <button
                id="back-to-topics-btn"
                onClick={handleBack}
                className={`flex items-center space-x-1.5 text-xs tracking-wider opacity-60 hover:opacity-100 transition-opacity`}
              >
                <ArrowLeft size={14} />
                <span>BACK_TO_INDEX</span>
              </button>

              <div className={`border p-5 space-y-4 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div className="text-[10px] opacity-40 font-bold uppercase">SEGMENT::{selectedTopic.category}</div>
                <h2 className={`text-sm font-bold tracking-wider uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {selectedTopic.name}
                </h2>
                <p className="text-xs font-sans opacity-70 leading-relaxed tracking-wide">
                  {selectedTopic.overview}
                </p>
              </div>

              {/* Related Resources Nodes */}
              <div className="space-y-2">
                <div className="text-[10px] opacity-40 font-bold">TOPIC_RESOURCE_NODES</div>
                {selectedTopic.resourceIds.map((resId) => {
                  const res = RESOURCES.find((r) => r.id === resId);
                  if (!res) return null;
                  return (
                    <button
                      id={`topic-res-${res.id}`}
                      key={res.id}
                      onClick={() => onNavigate(`#/resources/${res.id}`)}
                      className={`w-full text-left p-3 border text-xs hover:border-current transition-colors flex flex-col justify-between ${
                        isDarkMode ? 'border-neutral-800 bg-neutral-950/40 text-neutral-300' : 'border-neutral-200 bg-neutral-50/50 text-neutral-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] opacity-50 font-mono">NODE::{res.type.toUpperCase()}</span>
                        <span className="text-[9px] opacity-50 font-mono">{res.readingTime}</span>
                      </div>
                      <span className="font-semibold tracking-tight mt-1 line-clamp-1">{res.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Educational Details & Syllabi (cols-8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Learning Syllabus Path */}
              <div className={`border p-6 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div className="text-[10px] opacity-40 font-bold tracking-wider border-b pb-2 mb-4">RECOMMENDED_LEARNING_SYLLABUS</div>
                
                <div className="space-y-4 font-sans">
                  {selectedTopic.learningPath.map((step, idx) => (
                    <div id={`syllabus-step-${idx}`} key={idx} className="flex items-start space-x-4">
                      <span className="font-mono text-xs opacity-40 mt-1 select-none">0{idx + 1}</span>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-medium tracking-wide leading-relaxed ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Repositories */}
              {selectedTopic.recommendedRepos.length > 0 && (
                <div>
                  <div className="text-[10px] opacity-40 font-bold tracking-wider mb-2">CURATED_GITHUB_REPOSITORIES</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTopic.recommendedRepos.map((repo) => (
                      <a
                        id={`topic-repo-${repo.name.replace(/\//g, '-')}`}
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className={`p-4 border transition-colors block ${
                          isDarkMode
                            ? 'border-neutral-800 hover:border-neutral-600 bg-neutral-950/20 text-neutral-300'
                            : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20 text-neutral-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                            <GitFork size={10} />
                            <span>GITHUB_REPOSITORY</span>
                          </span>
                          <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                            <Star size={10} />
                            <span>{repo.stars}</span>
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold tracking-tight mt-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {repo.name}
                        </h4>
                        <p className="text-[10px] opacity-50 mt-1 line-clamp-2 leading-relaxed font-sans">
                          {repo.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
