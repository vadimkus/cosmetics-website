'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * Face Mesh Hook - MediaPipe Face Landmarks Integration
 * 
 * NOTE: TensorFlow.js face-landmarks-detection is temporarily disabled due to
 * ESM compatibility issues with Next.js 16 Turbopack. The exports and types
 * are still available for when the package is updated.
 * 
 * The pixel-based fallback analysis in ARSkinAnalysisCamera provides
 * accurate results for skin analysis.
 * 
 * When TensorFlow packages are updated for better ESM support:
 * - Uncomment the loadModel implementation
 * - Re-enable the detectFaces implementation
 * - Update ARSkinAnalysisCamera to use the real hook
 */

// MediaPipe Face Mesh keypoint indices for skin analysis zones
// Based on MediaPipe's 468 facial landmark model
export const FACE_LANDMARKS = {
  // Forehead region (upper face)
  FOREHEAD: {
    center: [10, 151, 9, 8, 107, 336, 285, 417],
    left: [67, 109, 10, 338, 297],
    right: [296, 334, 293, 300, 383],
  },
  // T-Zone (forehead + nose)
  TZONE: {
    top: [10, 151, 9, 8],
    noseBridge: [6, 197, 195, 5],
    noseBottom: [4, 1, 19, 94, 2],
  },
  // Left cheek
  LEFT_CHEEK: {
    outer: [234, 93, 132, 58, 172, 136, 150, 149, 176, 148],
    inner: [123, 117, 118, 119, 100, 126, 142, 36, 205, 206],
  },
  // Right cheek  
  RIGHT_CHEEK: {
    outer: [454, 323, 361, 288, 397, 365, 379, 378, 400, 377],
    inner: [352, 346, 347, 348, 329, 355, 371, 266, 425, 426],
  },
  // Nose
  NOSE: {
    bridge: [6, 197, 195, 5, 4],
    tip: [1, 2, 98, 327],
    left: [49, 131, 134, 51, 5],
    right: [279, 360, 363, 281, 5],
  },
  // Chin
  CHIN: {
    center: [199, 175, 152, 377, 400, 378, 379, 365],
    left: [170, 169, 135, 214, 212],
    right: [395, 394, 364, 434, 432],
  },
  // Eye area (for dark circles, puffiness)
  LEFT_EYE_AREA: {
    under: [111, 117, 118, 119, 120, 121, 128, 245],
    outer: [130, 247, 30, 29, 27, 28, 56, 190],
  },
  RIGHT_EYE_AREA: {
    under: [340, 346, 347, 348, 349, 350, 357, 465],
    outer: [359, 467, 260, 259, 257, 258, 286, 414],
  },
  // Lips (for hydration analysis)
  LIPS: {
    upper: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
    lower: [146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
  },
  // Jawline
  JAWLINE: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 
            397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 
            172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  // Face oval
  FACE_OVAL: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
              397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
              172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
} as const

// Skin analysis zone definition
export interface SkinZone {
  name: string
  label: {
    en: string
    ar: string
    ru: string
  }
  landmarks: readonly number[]
  // Computed from landmarks
  bounds?: {
    x: number
    y: number
    width: number
    height: number
    centerX: number
    centerY: number
  }
  // Analysis results for this zone
  metrics?: {
    oiliness: number
    hydration: number
    redness: number
    texture: number
    brightness: number
  }
}

// Face detection result
export interface FaceDetectionResult {
  detected: boolean
  confidence: number
  landmarks: Array<{ x: number; y: number; z?: number }> | null
  zones: SkinZone[]
  faceOval: { x: number; y: number; width: number; height: number } | null
  rotation: { pitch: number; yaw: number; roll: number } | null
}

// Hook options
interface UseFaceMeshOptions {
  maxFaces?: number
  refineLandmarks?: boolean
  onError?: (error: Error) => void
}

// Hook state
interface FaceMeshState {
  isLoading: boolean
  isReady: boolean
  error: string | null
  isSupported: boolean
}

export function useFaceMesh(options: UseFaceMeshOptions = {}) {
  const { maxFaces = 1, refineLandmarks = true, onError } = options
  
  // Silence unused variable warnings (used in commented implementation)
  void maxFaces
  void refineLandmarks

  // Refs
  const detectorRef = useRef<unknown>(null)
  const modelLoadingRef = useRef(false)
  void modelLoadingRef // Used in commented implementation

  // State
  const [state, setState] = useState<FaceMeshState>({
    isLoading: false,
    isReady: false,
    error: null,
    isSupported: typeof window !== 'undefined',
  })

  // NOTE: WebGL support check commented out - will be used when TensorFlow is re-enabled
  // const checkWebGLSupport = useCallback((): boolean => {
  //   if (typeof window === 'undefined') return false
  //   try {
  //     const canvas = document.createElement('canvas')
  //     return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  //   } catch { return false }
  // }, [])

  // Load the face detection model
  // NOTE: Temporarily disabled due to ESM compatibility issues with TensorFlow/MediaPipe
  const loadModel = useCallback(async (): Promise<boolean> => {
    // Face mesh is temporarily disabled due to package compatibility issues
    // The pixel-based fallback in ARSkinAnalysisCamera provides accurate results
    console.log('Face mesh disabled - using pixel-based analysis fallback')
    
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      isReady: false, 
      error: 'Face mesh disabled (using fallback)', 
      isSupported: true 
    }))
    
    return false
    
    /* 
    // ORIGINAL IMPLEMENTATION - Re-enable when TensorFlow packages support ESM properly
    // Prevent multiple simultaneous loads
    if (modelLoadingRef.current || detectorRef.current) {
      return !!detectorRef.current
    }

    if (!checkWebGLSupport()) {
      setState(prev => ({ 
        ...prev, 
        error: 'WebGL not supported', 
        isSupported: false 
      }))
      return false
    }

    modelLoadingRef.current = true
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const [tf, faceLandmarksDetection] = await Promise.all([
        import('@tensorflow/tfjs'),
        import('@tensorflow-models/face-landmarks-detection'),
      ])

      await tf.ready()

      if (tf.getBackend() !== 'webgl') {
        try {
          await tf.setBackend('webgl')
        } catch {
          await tf.setBackend('cpu')
        }
      }

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      const detector = await faceLandmarksDetection.createDetector(model, {
        runtime: 'tfjs',
        refineLandmarks,
        maxFaces,
      })

      detectorRef.current = detector
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isReady: true, 
        error: null 
      }))

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load face mesh model'
      console.error('Face mesh model loading error:', error)
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isReady: false, 
        error: errorMessage 
      }))
      
      onError?.(error instanceof Error ? error : new Error(errorMessage))
      return false
    } finally {
      modelLoadingRef.current = false
    }
    */
  }, [onError])

  // Detect faces in an image/video frame
  const detectFaces = useCallback(async (
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
  ): Promise<FaceDetectionResult> => {
    const emptyResult: FaceDetectionResult = {
      detected: false,
      confidence: 0,
      landmarks: null,
      zones: [],
      faceOval: null,
      rotation: null,
    }

    if (!detectorRef.current) {
      return emptyResult
    }

    try {
      const detector = detectorRef.current as {
        estimateFaces: (input: unknown, config?: { flipHorizontal?: boolean }) => Promise<Array<{
          keypoints: Array<{ x: number; y: number; z?: number; name?: string }>
          box?: { xMin: number; yMin: number; width: number; height: number }
        }>>
      }

      const faces = await detector.estimateFaces(input, {
        flipHorizontal: false,
      })

      if (!faces || faces.length === 0) {
        return emptyResult
      }

      const face = faces[0]
      if (!face) return emptyResult
      
      const keypoints = face.keypoints

      if (!keypoints || keypoints.length < 468) {
        return emptyResult
      }

      // Calculate confidence based on keypoint quality
      const validKeypoints = keypoints.filter(kp => 
        kp && typeof kp.x === 'number' && typeof kp.y === 'number'
      )
      const confidence = Math.min(100, Math.round((validKeypoints.length / 468) * 100))

      // Convert keypoints to simple array
      const landmarks = keypoints.map(kp => ({
        x: kp.x,
        y: kp.y,
        ...(kp.z !== undefined ? { z: kp.z } : {}),
      }))

      // Calculate face oval bounds
      const faceOvalPoints = FACE_LANDMARKS.FACE_OVAL.map(i => landmarks[i]).filter(Boolean)
      const faceOval = calculateBounds(faceOvalPoints as { x: number; y: number }[])

      // Calculate zones with bounds
      const zones = calculateZones(landmarks)

      // Estimate face rotation
      const rotation = estimateFaceRotation(landmarks)

      return {
        detected: true,
        confidence,
        landmarks,
        zones,
        faceOval,
        rotation,
      }
    } catch (error) {
      console.error('Face detection error:', error)
      return emptyResult
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectorRef.current) {
        try {
          const detector = detectorRef.current as { dispose?: () => void }
          detector.dispose?.()
        } catch {
          // Ignore cleanup errors
        }
        detectorRef.current = null
      }
    }
  }, [])

  return {
    ...state,
    loadModel,
    detectFaces,
    isModelLoaded: !!detectorRef.current,
  }
}

// Helper: Calculate bounding box from points
function calculateBounds(points: Array<{ x: number; y: number }>): { 
  x: number
  y: number
  width: number
  height: number 
} | null {
  if (!points || points.length === 0) return null

  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)

  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

// Helper: Calculate skin analysis zones from landmarks
function calculateZones(
  landmarks: Array<{ x: number; y: number; z?: number }>
): SkinZone[] {
  const zones: SkinZone[] = []

  // Forehead zone
  const foreheadLandmarks = [
    ...FACE_LANDMARKS.FOREHEAD.center,
    ...FACE_LANDMARKS.FOREHEAD.left,
    ...FACE_LANDMARKS.FOREHEAD.right,
  ]
  const foreheadPoints = foreheadLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (foreheadPoints.length > 0) {
    const bounds = calculateBounds(foreheadPoints)
    if (bounds) {
      zones.push({
        name: 'forehead',
        label: { en: 'Forehead', ar: 'الجبهة', ru: 'Лоб' },
        landmarks: foreheadLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  // Nose zone (T-zone part)
  const noseLandmarks = [...FACE_LANDMARKS.NOSE.bridge, ...FACE_LANDMARKS.NOSE.tip]
  const nosePoints = noseLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (nosePoints.length > 0) {
    const bounds = calculateBounds(nosePoints)
    if (bounds) {
      zones.push({
        name: 'nose',
        label: { en: 'Nose', ar: 'الأنف', ru: 'Нос' },
        landmarks: noseLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  // Left cheek zone
  const leftCheekLandmarks = [
    ...FACE_LANDMARKS.LEFT_CHEEK.outer,
    ...FACE_LANDMARKS.LEFT_CHEEK.inner,
  ]
  const leftCheekPoints = leftCheekLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (leftCheekPoints.length > 0) {
    const bounds = calculateBounds(leftCheekPoints)
    if (bounds) {
      zones.push({
        name: 'leftCheek',
        label: { en: 'Left Cheek', ar: 'الخد الأيسر', ru: 'Левая щека' },
        landmarks: leftCheekLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  // Right cheek zone
  const rightCheekLandmarks = [
    ...FACE_LANDMARKS.RIGHT_CHEEK.outer,
    ...FACE_LANDMARKS.RIGHT_CHEEK.inner,
  ]
  const rightCheekPoints = rightCheekLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (rightCheekPoints.length > 0) {
    const bounds = calculateBounds(rightCheekPoints)
    if (bounds) {
      zones.push({
        name: 'rightCheek',
        label: { en: 'Right Cheek', ar: 'الخد الأيمن', ru: 'Правая щека' },
        landmarks: rightCheekLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  // Chin zone
  const chinLandmarks = [
    ...FACE_LANDMARKS.CHIN.center,
    ...FACE_LANDMARKS.CHIN.left,
    ...FACE_LANDMARKS.CHIN.right,
  ]
  const chinPoints = chinLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (chinPoints.length > 0) {
    const bounds = calculateBounds(chinPoints)
    if (bounds) {
      zones.push({
        name: 'chin',
        label: { en: 'Chin', ar: 'الذقن', ru: 'Подбородок' },
        landmarks: chinLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  // Under-eye zones (for dark circles analysis)
  const leftEyeAreaLandmarks = [
    ...FACE_LANDMARKS.LEFT_EYE_AREA.under,
    ...FACE_LANDMARKS.LEFT_EYE_AREA.outer,
  ]
  const leftEyePoints = leftEyeAreaLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (leftEyePoints.length > 0) {
    const bounds = calculateBounds(leftEyePoints)
    if (bounds) {
      zones.push({
        name: 'leftEyeArea',
        label: { en: 'Left Eye Area', ar: 'منطقة العين اليسرى', ru: 'Область левого глаза' },
        landmarks: leftEyeAreaLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  const rightEyeAreaLandmarks = [
    ...FACE_LANDMARKS.RIGHT_EYE_AREA.under,
    ...FACE_LANDMARKS.RIGHT_EYE_AREA.outer,
  ]
  const rightEyePoints = rightEyeAreaLandmarks
    .map(i => landmarks[i])
    .filter((p): p is { x: number; y: number } => !!p)
  
  if (rightEyePoints.length > 0) {
    const bounds = calculateBounds(rightEyePoints)
    if (bounds) {
      zones.push({
        name: 'rightEyeArea',
        label: { en: 'Right Eye Area', ar: 'منطقة العين اليمنى', ru: 'Область правого глаза' },
        landmarks: rightEyeAreaLandmarks,
        bounds: {
          ...bounds,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        },
      })
    }
  }

  return zones
}

// Helper: Estimate face rotation from landmarks
function estimateFaceRotation(
  landmarks: Array<{ x: number; y: number; z?: number }>
): { pitch: number; yaw: number; roll: number } | null {
  // Key points for rotation estimation
  const noseTip = landmarks[1]    // Nose tip
  const noseRoot = landmarks[6]   // Between eyes
  const leftEye = landmarks[33]   // Left eye inner corner
  const rightEye = landmarks[263] // Right eye inner corner
  const chin = landmarks[152]     // Chin

  if (!noseTip || !noseRoot || !leftEye || !rightEye || !chin) {
    return null
  }

  // Calculate yaw (left-right rotation) from eye positions
  const eyeCenter = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
  }
  const yaw = Math.atan2(noseTip.x - eyeCenter.x, 100) * (180 / Math.PI)

  // Calculate pitch (up-down rotation) from nose-chin distance vs nose-eyes
  const noseEyeDist = Math.abs(noseTip.y - noseRoot.y)
  const noseChinDist = Math.abs(chin.y - noseTip.y)
  const pitch = ((noseChinDist - noseEyeDist) / (noseChinDist + noseEyeDist)) * 30

  // Calculate roll (tilt) from eye angle
  const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI)

  return {
    pitch: Math.round(pitch * 10) / 10,
    yaw: Math.round(yaw * 10) / 10,
    roll: Math.round(roll * 10) / 10,
  }
}

export default useFaceMesh
