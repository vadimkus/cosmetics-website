# AR Skin Analysis Enhancement

## Overview

This document describes the AR (Augmented Reality) enhancement to the existing AI Skin Analysis feature. The implementation adds real-time live analysis capabilities while preserving all existing functionality.

## New Features

### 1. Live AR Skin Analysis (`ARSkinAnalysisCamera`)

A new analysis mode that provides real-time skin metrics with face zone overlays.

**Features:**
- Real-time video analysis (no photo capture required)
- Live face zone detection and visualization
- Instant metrics for: Oiliness, Hydration, Redness
- Dynamic skin type detection
- Stability detection (holds metrics when user stays still)
- Color-coded zone overlays showing skin condition
- Lighting quality indicator

**Location:** `/components/ar/ARSkinAnalysisCamera.tsx`

### 2. 3D Product Viewer Foundation (Stage 2)

A prepared component for 3D product visualization using Three.js.

**Current Features (Preview):**
- CSS 3D transform for product images
- Drag-to-rotate interaction
- Zoom in/out controls
- WebXR AR support detection
- Share functionality

**Stage 2 Planned Features:**
- GLTF/GLB 3D model loading
- Full Three.js rendering
- WebXR AR placement
- Product variant switching
- Animation support

**Location:** `/components/ar/Product3DViewer.tsx`

## Technical Implementation

### Dependencies Added

```json
{
  "@mediapipe/face_mesh": "latest",
  "@mediapipe/camera_utils": "latest",
  "@tensorflow/tfjs": "latest",
  "@tensorflow-models/face-landmarks-detection": "latest",
  "three": "latest",
  "@types/three": "latest"
}
```

### Integration Points

#### Skin Recommendation Page

The AR mode is integrated into the existing Skin Analysis section with a toggle:

```tsx
// Toggle between Photo and Live AR modes
const [analysisMode, setAnalysisMode] = useState<'photo' | 'live'>('photo')
const [showARCamera, setShowARCamera] = useState(false)

// Render appropriate camera component
{showCamera && <SkinAnalysisCamera ... />}      // Existing
{showARCamera && <ARSkinAnalysisCamera ... />}  // New AR
```

### File Structure

```
components/ar/
├── index.ts                    # Module exports
├── ARSkinAnalysisCamera.tsx    # Live AR analysis component
└── Product3DViewer.tsx         # 3D product viewer (Stage 2)
```

## Usage

### For Users

1. Navigate to Skin Recommendation page
2. In the "AI Skin Analysis" section, toggle between:
   - **Photo**: Capture a selfie for detailed analysis (existing)
   - **Live AR**: Real-time analysis with face overlays (new)
3. Click "Start Live Analysis" to begin AR mode
4. Position face in the frame and hold still
5. When "Results stabilized" appears, click "Capture Results"

### For Developers

```tsx
// Using AR Camera directly
import { ARSkinAnalysisCamera } from '@/components/ar'

<ARSkinAnalysisCamera
  onAnalysisComplete={(result) => {
    // Handle SkinAnalysisResult
  }}
  onClose={() => setShowARCamera(false)}
/>

// Using 3D Product Viewer (Stage 2)
import { Product3DViewer } from '@/components/ar'

<Product3DViewer
  config={{
    productName: "Product Name",
    productId: "123",
    fallbackImage: "/images/product.png",
    // modelUrl: "/models/product.glb" // Stage 2
  }}
  showARButton={true}
/>
```

## AR Analysis Algorithm

The live analysis uses zone-based pixel analysis:

1. **Face Zones Defined:**
   - Forehead (T-zone area)
   - Nose (T-zone area)
   - Left Cheek
   - Right Cheek
   - Chin

2. **Per-Zone Analysis:**
   - Sample pixels at regular intervals
   - Calculate average RGB values
   - Compute brightness variance (texture)
   - Determine oiliness, hydration, redness

3. **Overall Metrics:**
   - Weighted average of zone metrics
   - T-zone vs cheeks comparison for combination skin detection
   - Confidence adjusted by lighting quality

4. **Stability Detection:**
   - Track last 5 readings
   - Check variance < 5% across all metrics
   - Enable capture button when stable

## Stage 2 Roadmap

### 3D Product Visualization
1. Implement Three.js scene initialization
2. Add GLTFLoader for 3D model support
3. Configure OrbitControls for interaction
4. Set up proper lighting (ambient + directional)
5. Add HDR environment maps for realistic reflections

### WebXR AR Placement
1. Request 'immersive-ar' session
2. Implement hit-testing for surface detection
3. Allow product placement in real environment
4. Add scale/rotate gestures for AR objects

### Enhanced Face Analysis (MediaPipe)
1. Full MediaPipe Face Mesh integration
2. 468 face landmark tracking
3. Precise zone mapping using landmarks
4. Better face pose estimation

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Live Camera | ✅ | ✅ | ✅ | ✅ |
| Canvas Analysis | ✅ | ✅ | ✅ | ✅ |
| TensorFlow.js | ✅ | ✅ | ✅ | ✅ |
| WebXR AR | ✅* | ❌ | ❌ | ✅* |

*Requires ARCore/ARKit compatible device

## Testing

### Manual Testing
1. Open Skin Recommendation page
2. Verify "Photo" mode works as before (existing functionality)
3. Toggle to "Live AR" mode
4. Verify camera access request
5. Test face detection (green guide when detected)
6. Test stability indicator
7. Capture results and verify analysis data

### Key Test Cases
- [ ] Photo mode unchanged (regression)
- [ ] AR mode camera access
- [ ] Face detection accuracy
- [ ] Metrics calculation
- [ ] Stability detection
- [ ] Result capture and data passing
- [ ] Close/cancel handling
- [ ] RTL layout support
- [ ] All 3 languages (EN, AR, RU)

## Known Limitations

1. **AR Mode:**
   - Requires camera permission
   - Analysis accuracy depends on lighting
   - May not work on very old browsers

2. **3D Viewer (Stage 2):**
   - Currently shows 2D fallback
   - WebXR AR limited to Chrome/Edge on supported devices
   - Requires 3D models to be created

## Related Files

- `/app/skin-recommendation/SkinRecommendationClient.tsx` - Main integration
- `/components/SkinAnalysisCamera.tsx` - Original photo analysis (preserved)
- `/components/ar/*` - New AR components
