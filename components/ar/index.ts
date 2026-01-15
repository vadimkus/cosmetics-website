/**
 * AR Components Module
 * 
 * This module provides AR (Augmented Reality) enhanced features for the cosmetics website.
 * 
 * Components:
 * - ARSkinAnalysisCamera: Real-time skin analysis with live camera feed and AR overlays
 * - Product3DViewer: 3D product visualization with WebXR AR support (Stage 2)
 * 
 * Technologies used:
 * - TensorFlow.js: ML models for skin analysis
 * - MediaPipe: Face detection and tracking
 * - Three.js: 3D rendering (Stage 2)
 * - WebXR API: Native browser AR (Stage 2)
 */

export { ARSkinAnalysisCamera } from './ARSkinAnalysisCamera'
export { Product3DViewer } from './Product3DViewer'

// Type exports
export type { default as ARSkinAnalysisCameraComponent } from './ARSkinAnalysisCamera'
export type { default as Product3DViewerComponent } from './Product3DViewer'
