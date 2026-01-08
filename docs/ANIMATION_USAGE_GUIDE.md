# 🎨 Animation System Usage Guide

## 🎯 **Animation Toggle Implementation Complete!**

The animation system with header toggle is now live at **http://localhost:3000**

---

## 🔧 **What's Implemented:**

### **1. 📱 Header Toggle (Wave Lines Icon)**
- **Location**: After cart icon in all header sections
- **Visual States**: 
  - 🟢 **Green** when animations are ON
  - ⚫ **Gray** when animations are OFF
- **Wave Animation**: Lines animate when active
- **Persistent**: Saves preference in localStorage
- **Mobile + Desktop**: Responsive sizing

### **2. 🏪 Global Animation Store**
- **File**: `lib/animationStore.ts`
- **Technology**: Zustand + Persist
- **Key**: `animation-preference` in localStorage

### **3. 🎭 Demo Showcase**
- **URL**: `http://localhost:3000/animation`
- **Features**: Interactive examples with toggle integration
- **Real Product Images**: Uses actual GENOSYS product photos

---

## 🚀 **How to Use in Your Components:**

### **Method 1: AnimationWrapper Component**
```tsx
import { AnimationWrapper } from '@/lib/AnimationWrapper'

export function ProductCard({ product }) {
  return (
    <AnimationWrapper 
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="product-card"
    >
      <div>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </AnimationWrapper>
  )
}
```

### **Method 2: useAnimationPreferences Hook**
```tsx
import { motion } from 'framer-motion'
import { useAnimationPreferences } from '@/lib/AnimationWrapper'

export function Button({ children }) {
  const { enabled, getAnimationProps } = useAnimationPreferences()
  
  return (
    <motion.button 
      {...getAnimationProps({
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      })}
      className="btn"
    >
      {children}
    </motion.button>
  )
}
```

### **Method 3: Direct Store Access**
```tsx
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'

export function Card({ children }) {
  const { enabled } = useAnimationStore()
  
  const MotionDiv = enabled ? motion.div : 'div'
  const animationProps = enabled ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -4 }
  } : {}
  
  return (
    <MotionDiv {...animationProps} className="card">
      {children}
    </MotionDiv>
  )
}
```

---

## 🎨 **Animation Examples:**

### **Product Grid with Stagger**
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function ProductGrid({ products }) {
  const { enabled } = useAnimationStore()
  
  return (
    <motion.div
      variants={enabled ? containerVariants : {}}
      initial={enabled ? "hidden" : {}}
      animate={enabled ? "show" : {}}
      className="grid grid-cols-3 gap-4"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={enabled ? itemVariants : {}}
          className="product-card"
        >
          {product.name}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### **Page Transitions**
```tsx
// In your main layout
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useAnimationStore } from '@/lib/animationStore'

export default function Layout({ children }) {
  const pathname = usePathname()
  const { enabled } = useAnimationStore()
  
  if (!enabled) return children
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## 📱 **Mobile Optimization:**

### **Performance-Aware Animations**
```tsx
import { useAnimationStore } from '@/lib/animationStore'

export function OptimizedCard({ children }) {
  const { enabled } = useAnimationStore()
  
  // Detect device capabilities
  const isLowEnd = typeof navigator !== 'undefined' && 
    navigator.hardwareConcurrency < 4
  
  const animationConfig = enabled ? {
    whileHover: isLowEnd ? {} : { y: -8 }, // Skip hover on low-end
    transition: { duration: isLowEnd ? 0.2 : 0.3 }
  } : {}
  
  return (
    <motion.div {...animationConfig} className="card">
      {children}
    </motion.div>
  )
}
```

---

## 🎯 **Current Header Integration:**

The toggle is now active in:
- ✅ **Mobile English** header (after cart)
- ✅ **Mobile Arabic** header (after cart)  
- ✅ **Desktop English** header (after cart)
- ✅ **Desktop Arabic** header (after cart)

---

## 🔧 **Toggle States:**

### **🟢 Animations ON:**
- Wave lines are **green** and **animated**
- All motion components work normally
- Tooltip: "Animations: ON"

### **⚫ Animations OFF:**
- Wave lines are **gray** and **static**
- Motion components render as regular divs
- Tooltip: "Animations: OFF"

---

## ✅ **Testing:**

1. **Visit**: http://localhost:3000
2. **Look for**: Wave lines icon after cart in header
3. **Click**: Toggle between ON/OFF states
4. **Test**: Visit /animation to see interactive examples
5. **Verify**: Preference persists after page refresh

---

## 🚀 **Next Steps:**

1. **Test the toggle** in the header
2. **Try the demo page** at `/animation`  
3. **Choose components** to enhance with animations
4. **Use the wrapper/hook** patterns shown above
5. **Monitor performance** on mobile devices

The animation system is now **ready for production** with user control! 🎉