// ============================================
// WAR ROOM WING TYPES
// Litigation Tech (Features 41-50)
// ============================================

/**
 * Visual evidence timeline entry
 */
export interface EvidenceTimelineEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'document' | 'communication' | 'transaction' | 'event' | 'testimony';
  source: string;
  relevance: 'low' | 'medium' | 'high' | 'critical';
  attachments: TimelineAttachment[];
  linkedEntries: string[];
  tags: string[];
}

/**
 * Timeline attachment
 */
export interface TimelineAttachment {
  id: string;
  filename: string;
  type: string;
  thumbnailUrl?: string;
  fullUrl: string;
  size: number;
}

/**
 * Financial heatmap cell
 */
export interface FinancialHeatmapCell {
  row: string;
  column: string;
  value: number;
  normalizedValue: number;
  color: string;
  tooltip: string;
}

/**
 * Financial heatmap config
 */
export interface FinancialHeatmapConfig {
  title: string;
  rowLabels: string[];
  columnLabels: string[];
  data: FinancialHeatmapCell[][];
  colorScale: string[];
  minValue: number;
  maxValue: number;
}

/**
 * Speech to text deposition
 */
export interface DepositionTranscript {
  depositionId: string;
  witness: string;
  date: string;
  duration: number;
  segments: TranscriptSegment[];
  summary: string;
  keyStatements: KeyStatement[];
}

/**
 * Transcript segment
 */
export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  speaker: string;
  text: string;
  confidence: number;
  isHighlighted: boolean;
  notes?: string;
}

/**
 * Key statement
 */
export interface KeyStatement {
  segmentId: string;
  text: string;
  importance: 'notable' | 'significant' | 'critical';
  category: string;
  timestamp: number;
}

/**
 * Jury comprehension graph data
 */
export interface JuryComprehensionData {
  conceptId: string;
  concept: string;
  comprehensionScore: number;
  visualAidEffectiveness: number;
  recommendations: string[];
  alternativeExplanations: string[];
}

/**
 * Interactive trial exhibit
 */
export interface TrialExhibit {
  exhibitId: string;
  exhibitNumber: string;
  title: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'interactive' | '3d_model';
  description: string;
  url: string;
  thumbnailUrl: string;
  annotations: ExhibitAnnotation[];
  presented: boolean;
  presentedAt?: string;
}

/**
 * Exhibit annotation
 */
export interface ExhibitAnnotation {
  id: string;
  type: 'highlight' | 'circle' | 'arrow' | 'text';
  coordinates: { x: number; y: number };
  content?: string;
  color: string;
}

/**
 * On the record indicator state
 */
export interface OnTheRecordState {
  isRecording: boolean;
  startedAt?: string;
  duration: number;
  recordingType: 'deposition' | 'hearing' | 'trial' | 'meeting';
  participants: string[];
  transcriptionEnabled: boolean;
}

/**
 * Post-proceeding asset
 */
export interface PostProceedingAsset {
  assetId: string;
  caseId: string;
  type: 'transcript' | 'exhibit' | 'brief' | 'order' | 'verdict' | 'settlement';
  title: string;
  dateCreated: string;
  dateModified: string;
  size: number;
  downloadUrl: string;
  metadata: Record<string, unknown>;
}

/**
 * Evidence culling result
 */
export interface EvidenceCullingResult {
  totalDocuments: number;
  relevantDocuments: number;
  culledDocuments: number;
  categories: CullingCategory[];
  savings: {
    reviewHours: number;
    costSaved: number;
  };
}

/**
 * Culling category
 */
export interface CullingCategory {
  name: string;
  count: number;
  action: 'keep' | 'review' | 'cull';
  confidence: number;
}

/**
 * 3D accident reconstruction
 */
export interface AccidentReconstruction {
  reconstructionId: string;
  title: string;
  sceneUrl: string;  // 3D model URL
  viewpoints: Viewpoint[];
  annotations: SceneAnnotation[];
  timeline: ReconstructionEvent[];
  physicsSimulation?: PhysicsSimulation;
}

/**
 * Viewpoint
 */
export interface Viewpoint {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  fov: number;
}

/**
 * Scene annotation
 */
export interface SceneAnnotation {
  id: string;
  position: { x: number; y: number; z: number };
  label: string;
  description: string;
  type: 'marker' | 'measurement' | 'highlight';
}

/**
 * Reconstruction event
 */
export interface ReconstructionEvent {
  time: number;  // seconds
  description: string;
  vehiclePositions?: Record<string, { x: number; y: number; z: number }>;
}

/**
 * Physics simulation
 */
export interface PhysicsSimulation {
  type: 'impact' | 'trajectory' | 'dynamics';
  duration: number;
  fps: number;
  frames: SimulationFrame[];
}

/**
 * Simulation frame
 */
export interface SimulationFrame {
  time: number;
  objects: Record<string, {
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  }>;
}

/**
 * Legal insight AI chat message
 */
export interface LegalInsightMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  citations: LegalCitation[];
  suggestions: string[];
}

/**
 * Legal citation
 */
export interface LegalCitation {
  id: string;
  caseName: string;
  citation: string;
  year: number;
  relevance: number;
  excerpt: string;
  url?: string;
}
