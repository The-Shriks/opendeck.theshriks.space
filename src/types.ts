export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'cheat-sheet' | 'repo' | 'tool' | 'prompt' | 'blog' | 'docs';
  content: string; // supports markdown
  difficulty: DifficultyLevel;
  readingTime: string;
  tags: string[];
  gitHubUrl?: string;
  externalUrl?: string;
  lastUpdated: string;
  version: string;
  author: string;
  relatedIds: string[]; // interconnected keys
}

export interface ShortVideo {
  id: string; // e.g. how-cpu-cache-works
  title: string;
  description: string;
  notes: string;
  codeSnippet?: string;
  codeLanguage?: string;
  diagram?: string; // ASCII diagram
  downloads?: { label: string; url: string }[];
  relatedTopicIds: string[];
  relatedResourceIds: string[];
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  resourceIds: string[];
  difficulty: DifficultyLevel;
}

export interface RecommendedRepo {
  name: string;
  description: string;
  stars: string;
  url: string;
}

export interface Topic {
  id: string;
  name: string;
  category: 'Language' | 'Infrastructure' | 'System Design' | 'AI & Data' | 'Security & Core';
  overview: string;
  learningPath: string[];
  resourceIds: string[];
  recommendedRepos: RecommendedRepo[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  desc: string;
  resourceId?: string;
  connections: string[]; // array of step IDs it connects to
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
}
