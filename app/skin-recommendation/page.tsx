'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Heart, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useFavorites } from '@/components/FavoritesProvider'

// Sample product database with skin type recommendations
const PRODUCTS_DATABASE = [
  {
    id: 1,
    name: "ALL FOR SENSITIVE SERUM",
    type: "Sensitive",
    description: "Soothing serum for irritated and sensitive skin with calming ingredients",
    price: "AED 250",
    image: "/images/ASE.jpg",
    category: "Serum",
    usage: "Evening"
  },
  {
    id: 2,
    name: "MOISTURE REPLENISHING HYALURON SERUM",
    type: "Dry",
    description: "Intensive hydrating serum with hyaluronic acid for dry skin",
    price: "AED 280",
    image: "/images/HRS.jpg",
    category: "Serum",
    usage: "Morning"
  },
  {
    id: 3,
    name: "MOISTURE REPLENISHING HYALURON CREAM",
    type: "Dry",
    description: "Rich moisturizing cream for deep hydration of dry skin",
    price: "AED 320",
    image: "/images/HER.jpg",
    category: "Cream",
    usage: "Morning & Evening"
  },
  {
    id: 4,
    name: "INTENSIVE PROBLEM CONTROL TONER",
    type: "Oily",
    description: "Mattifying toner for oily skin to control excess oil production",
    price: "AED 180",
    image: "/images/PRS.jpg",
    category: "Toner",
    usage: "Morning"
  },
  {
    id: 5,
    name: "INTENSIVE PROBLEM CONTROL SERUM",
    type: "Oily",
    description: "Lightweight serum to control oil and minimize pores",
    price: "AED 220",
    image: "/images/PRSS.jpg",
    category: "Serum",
    usage: "Evening"
  },
  {
    id: 6,
    name: "MULTI VITA RADIANCE SERUM",
    type: "Normal",
    description: "Skin brightening serum with multi vitamins and patented melanin care complex, MELAZERO®. Helps even skin tone and revive skin's natural brightness.",
    price: "AED 260",
    image: "/images/RADS.jpg",
    category: "Brightening",
    usage: "Morning"
  },
  {
    id: 7,
    name: "MULTI VITA RADIANCE CREAM",
    type: "Normal",
    description: "Skin brightening cream with multi vitamins and patented melanin care complex, MELAZERO®. Helps even skin tone and revive skin's natural brightness.",
    price: "AED 290",
    image: "/images/RAA.jpg",
    category: "Brightening",
    usage: "Morning & Evening"
  },
  {
    id: 8,
    name: "SKIN BARRIER PROTECTING CREAM",
    type: "Sensitive",
    description: "Gentle cream to strengthen and protect sensitive skin barrier",
    price: "AED 310",
    image: "/images/BRR.jpg",
    category: "Cream",
    usage: "Evening"
  },
  {
    id: 9,
    name: "INTENSIVE HYDRO SOOTHING CREAM",
    type: "Combination",
    description: "Balanced cream for combination skin with T-zone control",
    price: "AED 270",
    image: "/images/HSC.jpg",
    category: "Cream",
    usage: "Morning & Evening"
  },
  {
    id: 10,
    name: "MICROBIOME ENERGY INFUSING MIST",
    type: "Sensitive",
    description: "Gentle mist to refresh and calm sensitive skin",
    price: "AED 200",
    image: "/images/mist.jpg",
    category: "Mist",
    usage: "Morning"
  },
  {
    id: 11,
    name: "SNOW O₂ CLEANSER",
    type: "Oily",
    description: "Deep cleansing foam for oily skin to remove excess oil and impurities",
    price: "AED 150",
    image: "/images/SNOW.jpg",
    category: "Cleanser",
    usage: "Morning & Evening"
  },
  {
    id: 12,
    name: "EPI TURNOVER BOOSTING PEELING GEL",
    type: "Oily",
    description: "Gentle exfoliating gel to remove dead skin cells and unclog pores",
    price: "AED 190",
    image: "/images/EPI.jpg",
    category: "Exfoliant",
    usage: "Evening"
  },
  {
    id: 13,
    name: "SKIN DEFENDER LIP & EYE MAKEUP REMOVER",
    type: "Sensitive",
    description: "Gentle makeup remover for sensitive eye and lip areas",
    price: "AED 160",
    image: "/images/DEF.jpg",
    category: "Makeup Remover",
    usage: "Evening"
  },
  {
    id: 14,
    name: "ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]",
    type: "Normal",
    description: "High protection sunscreen for daily use with broad spectrum protection",
    price: "AED 240",
    image: "/images/SPF50.jpg",
    category: "Sunscreen",
    usage: "All Day"
  },
  {
    id: 15,
    name: "MULTI SUN CREAM [SPF 40 PA++]",
    type: "Dry",
    description: "Moisturizing sunscreen with SPF 40 for dry skin protection",
    price: "AED 220",
    image: "/images/SSUN.jpg",
    category: "Sunscreen",
    usage: "All Day"
  },
  {
    id: 16,
    name: "ND Cell ANTI-WRINKLE CREAM",
    type: "Dry",
    description: "Anti-aging cream with ND cell technology for mature dry skin",
    price: "AED 380",
    image: "/images/ND.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 17,
    name: "SOOTHING REPAIR POSTCREAM",
    type: "Sensitive",
    description: "Post-treatment cream to soothe and repair sensitive skin",
    price: "AED 290",
    image: "/images/SRC.jpg",
    category: "Repair Cream",
    usage: "Evening"
  },
  {
    id: 18,
    name: "EGF REPAIR OXYMASK CREAM",
    type: "Combination",
    description: "EGF-infused mask cream for skin repair and rejuvenation",
    price: "AED 350",
    image: "/images/EGF.jpg",
    category: "Mask",
    usage: "Evening"
  },
  {
    id: 19,
    name: "SKIN RESCUE OVERNIGHT CREAM MASK",
    type: "Dry",
    description: "Intensive overnight mask for deep hydration and repair",
    price: "AED 320",
    image: "/images/SKIN.jpg",
    category: "Overnight Mask",
    usage: "Evening"
  },
  {
    id: 20,
    name: "HYDRO COOL MODELING MASK",
    type: "Oily",
    description: "Cooling modeling mask to tighten pores and control oil",
    price: "AED 280",
    image: "/images/HYDR.jpg",
    category: "Modeling Mask",
    usage: "Evening"
  },
  {
    id: 21,
    name: "SOOTHING BOMB SEA ALGAE MASK",
    type: "Sensitive",
    description: "Calming sea algae mask for sensitive and irritated skin",
    price: "AED 260",
    image: "/images/SEA.jpg",
    category: "Sheet Mask",
    usage: "Evening"
  },
  {
    id: 22,
    name: "PEPTIDE GEL MASK",
    type: "Normal",
    description: "Peptide-infused gel mask for skin firming and anti-aging",
    price: "AED 300",
    image: "/images/PEP.jpg",
    category: "Gel Mask",
    usage: "Evening"
  },
  {
    id: 23,
    name: "EyeCell EYE CONTOUR SERUM",
    type: "Sensitive",
    description: "Gentle eye serum for sensitive eye area with anti-aging benefits",
    price: "AED 280",
    image: "/images/EYS.jpg",
    category: "Eye Care",
    usage: "Morning & Evening"
  },
  {
    id: 24,
    name: "EyeCell EYE CONTOUR CREAM",
    type: "Dry",
    description: "Rich eye cream for dry eye area with intensive hydration",
    price: "AED 320",
    image: "/images/EC.jpg",
    category: "Eye Care",
    usage: "Morning & Evening"
  },
  {
    id: 25,
    name: "EyeCell EYE PEPTIDE GEL PATCH",
    type: "Normal",
    description: "Peptide eye patches for instant eye area treatment",
    price: "AED 180",
    image: "/images/Patch.jpg",
    category: "Eye Patches",
    usage: "Evening"
  },
  {
    id: 26,
    name: "MULTI FUNCTIONAL ANTI-WRINKLE CREAM",
    type: "Dry",
    description: "Anti-aging cream with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. Helps visibly smooth the signs of wrinkles and reinforces skin firmness.",
    price: "AED 290",
    image: "/images/ANT.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 27,
    name: "MULTI FUNCTIONAL ANTI-WRINKLE SERUM",
    type: "Normal",
    description: "Anti-aging serum with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. Helps visibly smooth the signs of wrinkles and reinforces skin firmness.",
    price: "AED 330",
    image: "/images/MSSS.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  // Additional Anti-Aging Products
  {
    id: 28,
    name: "POWER SOLUTION AWS",
    type: "Normal",
    description: "Anti-aging ampoule for microneedling treatment that helps reduce wrinkles and improve skin firmness with firming peptide complex and adenosine.",
    price: "AED 580",
    image: "/images/AWS.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 29,
    name: "POWER SOLUTION HES",
    type: "Dry",
    description: "Hydrating and firming ampoule for microneedling treatment that provides long-lasting moisturizing and plumping effects with hyaluronic acid and peptides.",
    price: "AED 580",
    image: "/images/HES.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 30,
    name: "POWER SOLUTION CTS",
    type: "Normal",
    description: "Skin remodeling ampoule that helps skin retain natural elasticity and increases skin strength with collagen, hyaluronic acid and copper tripeptide-1.",
    price: "AED 580",
    image: "/images/CTS.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  // Additional Acne/Blemish Products
  {
    id: 31,
    name: "POWER SOLUTION PCS",
    type: "Oily",
    description: "Anti-blemish ampoule that controls excessive oil and sebum production and helps prevent skin breakouts with witch hazel and houttuynia cordata extract.",
    price: "AED 580",
    image: "/images/PCS.jpg",
    category: "Acne",
    usage: "Evening"
  },
  {
    id: 32,
    name: "INTENSIVE PROBLEM CONTROL CREAM",
    type: "Oily",
    description: "Anti-blemish cream for combination, oily acne-prone skin that helps control blemish-prone skin by regulating excessive oil and sebum.",
    price: "AED 290",
    image: "/images/PRB.jpg",
    category: "Acne",
    usage: "Morning & Evening"
  },
  {
    id: 33,
    name: "INTENSIVE PROBLEM CONTROL TONER",
    type: "Oily",
    description: "Anti-blemish toner for acne-prone skin that helps remove excess oil and sebum while adding quick hydration with patented Anti Sebum P complex.",
    price: "AED 130",
    image: "/images/PRS.jpg",
    category: "Acne",
    usage: "Morning"
  },
  // Additional Hydration Products
  {
    id: 34,
    name: "POWER SOLUTION CVS",
    type: "Sensitive",
    description: "Skin revitalizing ampoule that supplies nutrients to the skin, soothes and hydrates with botanical stem cell extracts and panthenol.",
    price: "AED 580",
    image: "/images/CVS.jpg",
    category: "Hydration",
    usage: "Evening"
  },
  {
    id: 35,
    name: "MICROBIOME ENERGY INFUSING MIST",
    type: "Sensitive",
    description: "Revitalizing mist that enhances skin's natural strength with pre/probiotics that corrects skin microbiome balance and hyaluronic acid complex.",
    price: "AED 160",
    image: "/images/mist.jpg",
    category: "Hydration",
    usage: "Morning"
  },
  {
    id: 36,
    name: "SNOW BOOSTER",
    type: "Normal",
    description: "Daily moisturizing and skin refining toner for all skin types that contains various botanical extracts to moisturize and soothe skin.",
    price: "AED 260",
    image: "/images/BOOS.jpg",
    category: "Hydration",
    usage: "Morning & Evening"
  },
  // Additional Brightening Products
  {
    id: 37,
    name: "POWER SOLUTION SWS",
    type: "Normal",
    description: "Anti-pigment ampoule that helps improve pigmentation, even skin tone and brighten the skin surface with arbutin and kojic acid.",
    price: "AED 580",
    image: "/images/SWS.jpg",
    category: "Brightening",
    usage: "Evening"
  },
  {
    id: 38,
    name: "SKIN RENEWAL PEELING SYSTEM (SRS)",
    type: "Normal",
    description: "Professional peeling system for smoother, brighter and more even skin tone with naturally occurring AHA acids that remove dead cells.",
    price: "AED 810",
    image: "/images/SRS.jpg",
    category: "Brightening",
    usage: "Evening"
  },
  // Additional Sensitivity Products
  {
    id: 39,
    name: "SOOTHING REPAIR POSTCREAM",
    type: "Sensitive",
    description: "Regenerating cream that promotes skin recovery after professional treatment and helps irritated skin rapidly recover from redness and edema.",
    price: "AED 204",
    image: "/images/SRC.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 40,
    name: "EGF REPAIR OXYMASK CREAM",
    type: "Sensitive",
    description: "Oxygen bubbling mask cream with skin regenerating ingredients – EGF and madecassoside that makes dull & stressed skin healthy.",
    price: "AED 290",
    image: "/images/EGF.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 41,
    name: "SOOTHING BOMB SEA ALGAE MASK",
    type: "Sensitive",
    description: "Sheet mask inspired by the healing power of the ocean that provides intensive relief to the skin and moisturizes with sea algae complex.",
    price: "AED 36",
    image: "/images/SEA.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  // Additional Pore Care Products
  {
    id: 42,
    name: "EPI TURNOVER BOOSTING PEELING GEL",
    type: "Oily",
    description: "Mild peeling gel combining enzymatic peeling and cellulose peeling that removes dead skin cells without irritation.",
    price: "AED 250",
    image: "/images/EPI.jpg",
    category: "Pore Care",
    usage: "Evening"
  },
  {
    id: 43,
    name: "HYDRO COOL MODELING MASK",
    type: "Oily",
    description: "Professional modeling mask that provides immediate cooling and soothing effect and makes skin feel refreshed with sufficient moisture.",
    price: "AED 300",
    image: "/images/HYDR.jpg",
    category: "Pore Care",
    usage: "Evening"
  },
  // Additional Sun Protection Products
  {
    id: 44,
    name: "SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]",
    type: "Normal",
    description: "Professional BB cushion for post-treatment use with natural coverage and skin protection.",
    price: "AED 300",
    image: "/images/BBC.jpg",
    category: "Sun Protection",
    usage: "All Day"
  },
  {
    id: 45,
    name: "INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]",
    type: "Oily",
    description: "Natural coverage cream that protects skin from harmful environmental factors and covers redness and blemishes after dermatological treatment.",
    price: "AED 250",
    image: "/images/BLEM.jpg",
    category: "Sun Protection",
    usage: "All Day"
  },
  // Additional Eye Care Products
  {
    id: 46,
    name: "EyeCell EYE ZONE CARE KIT",
    type: "Normal",
    description: "Professional kit to treat various skin problems around eyes from dehydration, dark circle, eye bag to crow's feet with comprehensive eye care.",
    price: "AED 980",
    image: "/images/EYEZ.jpg",
    category: "Eye Care",
    usage: "Morning & Evening"
  },
  {
    id: 47,
    name: "PEPTIDE GEL MASK",
    type: "Normal",
    description: "Patented thermo-sensitive hydrogel mask that instantly cools down skin and moisturizes, specially recommended after dermatological operations.",
    price: "AED 380",
    image: "/images/PEP.jpg",
    category: "Eye Care",
    usage: "Evening"
  },
  // Additional Professional Products
  {
    id: 48,
    name: "EZ CO₂ MASK KIT",
    type: "Normal",
    description: "Professional carboxy mask for oxygen supply to skin that gives skin firming, brightening and anti-blemish effects.",
    price: "AED 460",
    image: "/images/EZE.jpg",
    category: "Professional",
    usage: "Evening"
  },
  {
    id: 49,
    name: "GENOSYS SKIN REBOOT PDRN MASK PACK",
    type: "Normal",
    description: "Professional PDRN mask pack with salmon DNA technology for skin regeneration and repair with ultra-slim fit sheets. Suitable for all skin types.",
    price: "AED 450",
    image: "/images/PDRN.png",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 50,
    name: "GENOSYS SKIN REBOOT PDRN MASK PACK - SENSITIVE",
    type: "Sensitive",
    description: "Professional PDRN mask pack with salmon DNA technology for sensitive skin regeneration and repair with ultra-slim fit sheets.",
    price: "AED 450",
    image: "/images/PDRN.png",
    category: "Sensitivity",
    usage: "Evening"
  },
  // Missing Products from Main Database
  {
    id: 54,
    name: "SNOW O₂ CLEANSER",
    type: "Oily",
    description: "All in one gentle cleanser with oxygen bubbles. Gentle and effective cleanser that cleans make-up and skin impurities without excessive cleansing movement and irritation.",
    price: "AED 330",
    image: "/images/SNOW.jpg",
    category: "Acne",
    usage: "Morning & Evening"
  },
  {
    id: 55,
    name: "SKIN DEFENDER LIP & EYE MAKEUP REMOVER",
    type: "Sensitive",
    description: "Fresh, non-greasy lip & eye makeup remover. Biphasic layer with vitamins, firming peptides and oil layer with strong cleansing power.",
    price: "AED 290",
    image: "/images/DEF.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 56,
    name: "EPI TURNOVER BOOSTING PEELING GEL",
    type: "Oily",
    description: "Mild peeling gel combining enzymatic peeling and cellulose peeling. Removes dead skin cells without irritation with moringa and desert plant complex.",
    price: "AED 250",
    image: "/images/EPI.jpg",
    category: "Pore Care",
    usage: "Evening"
  },
  {
    id: 57,
    name: "SKIN RENEWAL PEELING SYSTEM (SRS)",
    type: "Normal",
    description: "Professional peeling with naturally occurring AHA acids. Professional peeling system for smoother, brighter and more even skin tone.",
    price: "AED 810",
    image: "/images/SRS.jpg",
    category: "Brightening",
    usage: "Evening"
  },
  {
    id: 58,
    name: "MICROBIOME ENERGY INFUSING MIST",
    type: "Sensitive",
    description: "Revitalizing mist that gives skin natural glow and radiance. Enhances skin's natural strength with pre/probiotics that corrects skin microbiome balance.",
    price: "AED 160",
    image: "/images/mist.jpg",
    category: "Hydration",
    usage: "Morning"
  },
  {
    id: 59,
    name: "INTENSIVE PROBLEM CONTROL TONER",
    type: "Oily",
    description: "Anti-blemish toner for acne-prone skin. Helps remove excess oil and sebum while adding quick hydration with patented Anti Sebum P complex.",
    price: "AED 130",
    image: "/images/PRS.jpg",
    category: "Acne",
    usage: "Morning"
  },
  {
    id: 60,
    name: "SNOW BOOSTER",
    type: "Normal",
    description: "Daily moisturizing and skin refining toner for all skin types. Contains various botanical extracts to moisturize and soothe skin.",
    price: "AED 260",
    image: "/images/BOOS.jpg",
    category: "Hydration",
    usage: "Morning & Evening"
  },
  {
    id: 61,
    name: "EyeCell EYE CONTOUR SERUM",
    type: "Sensitive",
    description: "Highly enriched all-in-one eye serum that helps improve wrinkles, dark circles and diminish the appearance of eye puffs with peptide complex.",
    price: "AED 370",
    image: "/images/EYS.jpg",
    category: "Eye Care",
    usage: "Morning & Evening"
  },
  {
    id: 62,
    name: "MOISTURE REPLENISHING HYALURON SERUM",
    type: "Dry",
    description: "Coconut water-based hydrating serum with hyaluronic complex and various mushrooms. Quickly replenishes moisture from deep inside with multi depth hydration.",
    price: "AED 330",
    image: "/images/HRS.jpg",
    category: "Hydration",
    usage: "Morning"
  },
  {
    id: 63,
    name: "ALL FOR SENSITIVE SERUM",
    type: "Sensitive",
    description: "Skin repairing serum for sensitive skin. Provides moisture barrier to skin and relieves sensitized skin with anti-inflammatory and soothing properties.",
    price: "AED 330",
    image: "/images/ASE.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 64,
    name: "PROBLEM CONTROL SERUM",
    type: "Oily",
    description: "Anti-blemish serum for combination, oily acne-prone skin. Helps fight skin breakouts by regulating excessive oil and sebum and refines skin texture.",
    price: "AED 330",
    image: "/images/PRSS.jpg",
    category: "Acne",
    usage: "Evening"
  },
  {
    id: 65,
    name: "MULTI VITA RADIANCE SERUM",
    type: "Normal",
    description: "Skin brightening serum with multi vitamins and patented melanin care complex, MELAZERO®. Helps even skin tone and revive skin's natural brightness.",
    price: "AED 260",
    image: "/images/RADS.jpg",
    category: "Brightening",
    usage: "Morning"
  },
  {
    id: 66,
    name: "MULTI FUNCTIONAL ANTI-WRINKLE SERUM",
    type: "Normal",
    description: "Anti-aging serum with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. Helps visibly smooth signs of wrinkles and reinforces skin firmness.",
    price: "AED 330",
    image: "/images/MSSS.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 67,
    name: "ND Cell ANTI-WRINKLE CREAM",
    type: "Dry",
    description: "Anti-aging cream for neck and decollete area. Lifts and firms skin and refines skin texture with excellent depigmentation effect.",
    price: "AED 370",
    image: "/images/ND.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 68,
    name: "EyeCell EYE CONTOUR CREAM",
    type: "Dry",
    description: "Daily eye cream that brings younger-looking eye contour. Helps reduce wrinkles and dark circles and depuff the under eye with peptide complex.",
    price: "AED 370",
    image: "/images/EC.jpg",
    category: "Eye Care",
    usage: "Morning & Evening"
  },
  {
    id: 69,
    name: "SOOTHING REPAIR POSTCREAM",
    type: "Sensitive",
    description: "Regenerating cream for healthy skin recovery after professional treatment. Helps irritated skin rapidly recover from redness, erythema and edema.",
    price: "AED 204",
    image: "/images/SRC.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 70,
    name: "EGF REPAIR OXYMASK CREAM",
    type: "Sensitive",
    description: "Oxygen bubbling mask cream with skin regenerating ingredients – EGF and madecassoside. Makes dull & stressed skin healthy with regenerating ingredients.",
    price: "AED 290",
    image: "/images/EGF.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 71,
    name: "SKIN BARRIER PROTECTING CREAM",
    type: "Sensitive",
    description: "Skin barrier strengthening cream with enriched ceramide and amino acid complex. Encourages healthy and soft skin by promoting water retention.",
    price: "AED 450",
    image: "/images/BRR.jpg",
    category: "Hydration",
    usage: "Evening"
  },
  {
    id: 72,
    name: "INTENSIVE HYDRO SOOTHING CREAM",
    type: "Combination",
    description: "Soothing and moisturizing gel with aloe vera, snail secretion filtrate. Calms down skin irritation and provides long-lasting hydration.",
    price: "AED 290",
    image: "/images/HSC.jpg",
    category: "Hydration",
    usage: "Morning & Evening"
  },
  {
    id: 73,
    name: "MOISTURE REPLENISHING HYALURON CREAM",
    type: "Dry",
    description: "Long-lasting moisturizer with hyaluronic complex and various mushrooms. Strengthens moisture barrier and provides long-lasting hydration.",
    price: "AED 290",
    image: "/images/HER.jpg",
    category: "Hydration",
    usage: "Morning & Evening"
  },
  {
    id: 74,
    name: "INTENSIVE PROBLEM CONTROL CREAM",
    type: "Oily",
    description: "Anti-blemish cream for combination, oily acne-prone skin. Helps control blemish-prone skin by regulating excessive oil and sebum while keeping skin hydrated.",
    price: "AED 290",
    image: "/images/PRB.jpg",
    category: "Acne",
    usage: "Morning & Evening"
  },
  {
    id: 75,
    name: "MULTI VITA RADIANCE CREAM",
    type: "Normal",
    description: "Skin brightening cream with multi vitamins and patented melanin care complex, MELAZERO®. Helps even skin tone and revive skin's natural brightness.",
    price: "AED 290",
    image: "/images/RAA.jpg",
    category: "Brightening",
    usage: "Morning & Evening"
  },
  {
    id: 76,
    name: "MULTI FUNCTIONAL ANTI-WRINKLE CREAM",
    type: "Dry",
    description: "Anti-aging cream with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex. Helps visibly smooth signs of wrinkles and reinforces skin firmness.",
    price: "AED 290",
    image: "/images/ANT.jpg",
    category: "Anti-Aging",
    usage: "Evening"
  },
  {
    id: 77,
    name: "EyeCell EYE PEPTIDE GEL PATCH",
    type: "Normal",
    description: "Patented thermo-sensitive hydrogel mask for eye contour area for soothing and moisturizing. Improves eye bags and soothes skin after dermatologic procedures.",
    price: "AED 380",
    image: "/images/Patch.jpg",
    category: "Eye Care",
    usage: "Evening"
  },
  {
    id: 78,
    name: "SKIN RESCUE OVERNIGHT CREAM MASK",
    type: "Dry",
    description: "Revitalizing overnight mask that provides intensive care to fatigued skin. Revitalizes skin with oxygen capsules and pink ceramide complex.",
    price: "AED 340",
    image: "/images/SKIN.jpg",
    category: "Hydration",
    usage: "Evening"
  },
  {
    id: 79,
    name: "HYDRO COOL MODELING MASK",
    type: "Oily",
    description: "Professional modeling mask that provides immediate cooling and soothing effect. Helps soothe skin after professional treatment with sufficient moisture.",
    price: "AED 300",
    image: "/images/HYDR.jpg",
    category: "Pore Care",
    usage: "Evening"
  },
  {
    id: 80,
    name: "SOOTHING BOMB SEA ALGAE MASK",
    type: "Sensitive",
    description: "Sheet mask inspired by the healing power of the ocean. Provides intensive relief to the skin and moisturizes with sea algae complex.",
    price: "AED 36",
    image: "/images/SEA.jpg",
    category: "Sensitivity",
    usage: "Evening"
  },
  {
    id: 81,
    name: "PEPTIDE GEL MASK",
    type: "Normal",
    description: "Patented thermo-sensitive hydrogel mask that cools down skin heat and moisturizes skin. Specially recommended after dermatological operations.",
    price: "AED 380",
    image: "/images/PEP.jpg",
    category: "Eye Care",
    usage: "Evening"
  },
  {
    id: 82,
    name: "EZ CO₂ MASK KIT",
    type: "Normal",
    description: "Professional carboxy mask for oxygen supply to skin. Gives skin firming, brightening and anti-blemish effects with carboxy therapy mechanism.",
    price: "AED 460",
    image: "/images/EZE.jpg",
    category: "Professional",
    usage: "Evening"
  },
  {
    id: 83,
    name: "ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]",
    type: "Normal",
    description: "Non-greasy and silky sunscreen with powerful UV protection and sun burn care effect. Strongly defends skin against UV rays and promotes skin recovery.",
    price: "AED 250",
    image: "/images/SPF50.jpg",
    category: "Sun Protection",
    usage: "All Day"
  },
  {
    id: 84,
    name: "MULTI SUN CREAM [SPF 40 PA++]",
    type: "Dry",
    description: "Non-greasy mild sunscreen with skin glowing effect for daily sun protection. Protects skin from UV A&B rays and helps soothe irritated skin.",
    price: "AED 210",
    image: "/images/SSUN.jpg",
    category: "Sun Protection",
    usage: "All Day"
  },
  {
    id: 85,
    name: "SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]",
    type: "Normal",
    description: "Professional BB cushion for post-treatment use with natural coverage and skin protection.",
    price: "AED 300",
    image: "/images/BBC.jpg",
    category: "Sun Protection",
    usage: "All Day"
  },
  {
    id: 86,
    name: "INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]",
    type: "Oily",
    description: "Natural coverage cream that helps cover redness and express natural skin tone. Protects skin from harmful environmental factors.",
    price: "AED 250",
    image: "/images/BLEM.jpg",
    category: "Sun Protection",
    usage: "All Day"
  },
  {
    id: 94,
    name: "EyeCell EYE ZONE CARE KIT",
    type: "Normal",
    description: "Professional kit to treat various skin problems around eyes from dehydration, dark circle, eye bag to crow's feet with comprehensive eye care.",
    price: "AED 980",
    image: "/images/EYEZ.jpg",
    category: "Eye Care",
    usage: "Morning & Evening"
  },
  {
    id: 95,
    name: "GENOSYS SKIN REBOOT PDRN MASK PACK",
    type: "Sensitive",
    description: "Professional PDRN mask pack with salmon DNA technology for skin regeneration and repair. Ultra-slim fit sheets with 30 masks per container.",
    price: "AED 450",
    image: "/images/PDRN.png",
    category: "Anti-Aging",
    usage: "Evening"
  }
]

const SKIN_TYPES = [
  { 
    value: 'dry', 
    label: 'Dry',
    description: 'Dry skin feels tight and may appear flaky or rough. It lacks natural oils and moisture, often feeling uncomfortable after cleansing. Dry skin is prone to fine lines and may feel itchy or irritated.'
  },
  { 
    value: 'oily', 
    label: 'Oily',
    description: 'Oily skin produces excess sebum, giving it a shiny appearance, especially in the T-zone (forehead, nose, chin). It has enlarged pores and is prone to acne, blackheads, and breakouts. The skin may feel greasy to the touch.'
  },
  { 
    value: 'combination', 
    label: 'Combination',
    description: 'Combination skin has both oily and dry areas. Typically, the T-zone is oily while the cheeks and other areas are normal to dry. This skin type requires different care for different areas of the face.'
  },
  { 
    value: 'normal', 
    label: 'Normal',
    description: 'Normal skin has a balanced oil and moisture content. It appears smooth, has small pores, and rarely experiences breakouts or sensitivity. This skin type has good circulation and an even tone.'
  },
  { 
    value: 'sensitive', 
    label: 'Sensitive',
    description: 'Sensitive skin reacts easily to products, weather, or environmental factors. It may become red, itchy, or irritated. This skin type requires gentle, fragrance-free products and careful ingredient selection.'
  }
]

const AGE_GROUPS = [
  {
    value: 'teen',
    label: 'Teen (13-19)',
    description: 'Focus on acne control, oil management, and gentle care',
    icon: '🧑‍🎓'
  },
  {
    value: 'young-adult',
    label: 'Young Adult (20-29)',
    description: 'Prevention-focused care, early anti-aging, and maintenance',
    icon: '👩‍💼'
  },
  {
    value: 'adult',
    label: 'Adult (30-39)',
    description: 'Targeted anti-aging, firmness, and skin renewal',
    icon: '👩‍💻'
  },
  {
    value: 'mature',
    label: 'Mature (40-49)',
    description: 'Intensive anti-aging, wrinkle reduction, and skin repair',
    icon: '👩‍🏫'
  },
  {
    value: 'senior',
    label: 'Senior (50+)',
    description: 'Advanced anti-aging, skin regeneration, and comprehensive care',
    icon: '👩‍🦳'
  }
]

const TARGET_CATEGORIES = [
  {
    value: 'anti-aging',
    label: 'Anti-Aging',
    description: 'Reduce wrinkles, fine lines, and signs of aging',
    icon: '🕰️'
  },
  {
    value: 'acne',
    label: 'Acne & Blemishes',
    description: 'Control breakouts, oil production, and clear skin',
    icon: '🎯'
  },
  {
    value: 'hydration',
    label: 'Hydration',
    description: 'Deep moisture and skin barrier protection',
    icon: '💧'
  },
  {
    value: 'brightening',
    label: 'Brightening',
    description: 'Even skin tone and reduce dark spots',
    icon: '✨'
  },
  {
    value: 'sensitivity',
    label: 'Sensitivity',
    description: 'Calm and soothe irritated skin',
    icon: '🤗'
  },
  {
    value: 'pores',
    label: 'Pore Care',
    description: 'Minimize pores and refine skin texture',
    icon: '🔍'
  },
  {
    value: 'sun-protection',
    label: 'Sun Protection',
    description: 'UV protection and sun damage repair',
    icon: '☀️'
  },
  {
    value: 'eye-care',
    label: 'Eye Care',
    description: 'Target dark circles, puffiness, and eye wrinkles',
    icon: '👁️'
  }
]

export default function SkinRecommendationPage() {
  const [selectedSkinType, setSelectedSkinType] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('')
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCartStore()
  const { favorites, toggleFavorite } = useFavorites()

  const handleTargetToggle = (target: string) => {
    setSelectedTargets(prev => 
      prev.includes(target) 
        ? prev.filter(t => t !== target)
        : [...prev, target]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSkinType) return

    setIsLoading(true)
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    let filteredProducts = PRODUCTS_DATABASE.filter(product =>
      product.type.toLowerCase() === selectedSkinType.toLowerCase()
    )

    // Filter by selected targets if any are selected
    if (selectedTargets.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const productName = product.name.toLowerCase()
        const productDescription = product.description.toLowerCase()
        const productCategory = product.category.toLowerCase()
        
        // Check if product matches ANY of the selected targets
        return selectedTargets.some(target => {
          switch (target) {
            case 'anti-aging':
              return productName.includes('anti-wrinkle') || 
                     productName.includes('anti-aging') ||
                     productName.includes('multi functional') ||
                     productName.includes('nd cell') ||
                     productName.includes('power solution aws') ||
                     productName.includes('power solution hes') ||
                     productName.includes('power solution cts') ||
                     productName.includes('pdrn') ||
                     productDescription.includes('wrinkle') ||
                     productDescription.includes('aging') ||
                     productDescription.includes('firmness') ||
                     productDescription.includes('collagen') ||
                     productDescription.includes('elastin') ||
                     productDescription.includes('bakuchiol') ||
                     productDescription.includes('peptide') ||
                     productDescription.includes('adenosine') ||
                     productDescription.includes('regeneration') ||
                     productDescription.includes('repair') ||
                     productCategory.includes('anti-aging') ||
                     (productCategory.includes('cream') && (productDescription.includes('wrinkle') || productDescription.includes('aging')))
            case 'acne':
              return productName.includes('problem') ||
                     productName.includes('blemish') ||
                     productName.includes('intensive problem') ||
                     productName.includes('power solution pcs') ||
                     productDescription.includes('acne') ||
                     productDescription.includes('blemish') ||
                     productDescription.includes('sebum') ||
                     productDescription.includes('oil') ||
                     productDescription.includes('breakout') ||
                     productDescription.includes('zinc pca') ||
                     productDescription.includes('salicylic') ||
                     productDescription.includes('willow bark') ||
                     productCategory.includes('problem') ||
                     productCategory.includes('acne')
            case 'hydration':
              return productName.includes('moisture') ||
                     productName.includes('hydrat') ||
                     productName.includes('hydro') ||
                     productName.includes('intensive hydro') ||
                     productName.includes('moisture replenishing') ||
                     productName.includes('power solution cvs') ||
                     productName.includes('microbiome') ||
                     productName.includes('snow booster') ||
                     productDescription.includes('hydrat') ||
                     productDescription.includes('moisture') ||
                     productDescription.includes('hydration') ||
                     productDescription.includes('hyaluronic') ||
                     productDescription.includes('moisturizing') ||
                     productDescription.includes('barrier') ||
                     productDescription.includes('water retention') ||
                     productDescription.includes('aquaporin') ||
                     productDescription.includes('panthenol')
            case 'brightening':
              return productName.includes('radiance') ||
                     productName.includes('bright') ||
                     productName.includes('multi vita') ||
                     productName.includes('power solution sws') ||
                     productName.includes('skin renewal') ||
                     productDescription.includes('bright') ||
                     productDescription.includes('radiance') ||
                     productDescription.includes('melanin') ||
                     productDescription.includes('pigment') ||
                     productDescription.includes('vitamin c') ||
                     productDescription.includes('arbutin') ||
                     productDescription.includes('kojic') ||
                     productDescription.includes('glutathione') ||
                     productDescription.includes('even skin tone')
            case 'sensitivity':
              return productName.includes('sensitive') ||
                     productName.includes('soothing') ||
                     productName.includes('all for sensitive') ||
                     productName.includes('soothing repair') ||
                     productName.includes('soothing bomb') ||
                     productName.includes('skin barrier') ||
                     productName.includes('pdrn') ||
                     productDescription.includes('sensitive') ||
                     productDescription.includes('soothing') ||
                     productDescription.includes('calm') ||
                     productDescription.includes('irritation') ||
                     productDescription.includes('redness') ||
                     productDescription.includes('barrier') ||
                     productDescription.includes('centella') ||
                     productDescription.includes('aloe') ||
                     productDescription.includes('beta-glucan') ||
                     productDescription.includes('regeneration') ||
                     productDescription.includes('repair')
            case 'pores':
              return productName.includes('epi turnover') ||
                     productName.includes('hydro cool') ||
                     productName.includes('peeling') ||
                     productDescription.includes('pore') ||
                     productDescription.includes('texture') ||
                     productDescription.includes('exfoliat') ||
                     productDescription.includes('dead skin') ||
                     productDescription.includes('cell turnover') ||
                     productDescription.includes('modeling') ||
                     productDescription.includes('cooling')
            case 'sun-protection':
              return productName.includes('sun') ||
                     productName.includes('spf') ||
                     productName.includes('shield') ||
                     productName.includes('blemish balm') ||
                     productDescription.includes('uv') ||
                     productDescription.includes('sunburn') ||
                     productDescription.includes('protection') ||
                     productCategory.includes('sun')
            case 'eye-care':
              return productName.includes('eye') ||
                     productName.includes('eyecell') ||
                     productName.includes('peptide gel mask') ||
                     productDescription.includes('eye') ||
                     productDescription.includes('dark circle') ||
                     productDescription.includes('puff') ||
                     productDescription.includes('contour') ||
                     productCategory.includes('eye')
            default:
              return false
          }
        })
      })
    }

    // If no products match the target criteria, show all products for the skin type
    if (filteredProducts.length === 0 && selectedTargets.length > 0) {
      filteredProducts = PRODUCTS_DATABASE.filter(product =>
        product.type.toLowerCase() === selectedSkinType.toLowerCase()
      )
    }

    setRecommendations(filteredProducts)
    setIsSubmitted(true)
    setIsLoading(false)
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price.replace('AED ', '')),
      image: product.image,
      images: null,
      description: product.description,
      category: product.category,
      inStock: true
    }, 1)
  }

  const isFavorite = (productId: number) => {
    return favorites.some(fav => fav.id === productId.toString())
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-all duration-300 group bg-white/50 hover:bg-white/80 px-4 py-2 rounded-xl border border-slate-200/50 hover:border-slate-300/50 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Skin Recommendation
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover the perfect GENOSYS products for your unique skin type.
            </p>
          </div>

          {/* Skin Type Selection Form */}
          {!isSubmitted && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="mb-10">
                  <label className="block text-2xl font-bold text-slate-900 mb-8 text-center">
                    What's your skin type?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SKIN_TYPES.map((skinType) => (
                      <label
                        key={skinType.value}
                        className={`relative flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group hover:scale-105 ${
                          selectedSkinType === skinType.value
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-lg shadow-blue-100/50'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-md hover:bg-white/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="skinType"
                          value={skinType.value}
                          checked={selectedSkinType === skinType.value}
                          onChange={(e) => setSelectedSkinType(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-center w-full">
                          <span className="font-semibold text-base group-hover:text-slate-900 transition-colors">{skinType.label}</span>
                        </div>
                        {selectedSkinType === skinType.value && (
                          <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skin Type Description */}
                {selectedSkinType && (
                  <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {SKIN_TYPES.find(st => st.value === selectedSkinType)?.label} Skin
                    </h3>
                    <p className="text-blue-800 leading-relaxed text-base">
                      {SKIN_TYPES.find(st => st.value === selectedSkinType)?.description}
                    </p>
                  </div>
                )}

                {/* Age Group Selection */}
                <div className="mb-10">
                  <label className="block text-2xl font-bold text-slate-900 mb-8 text-center">
                    What's your age group?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AGE_GROUPS.map((ageGroup) => (
                      <label
                        key={ageGroup.value}
                        className={`relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group hover:scale-105 ${
                          selectedAgeGroup === ageGroup.value
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-lg shadow-blue-100/50'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-md hover:bg-white/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ageGroup"
                          value={ageGroup.value}
                          checked={selectedAgeGroup === ageGroup.value}
                          onChange={(e) => setSelectedAgeGroup(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{ageGroup.icon}</span>
                        <span className="text-base font-semibold text-slate-800 text-center mb-1 group-hover:text-slate-900 transition-colors">
                          {ageGroup.label}
                        </span>
                        <span className="text-xs text-slate-600 text-center leading-relaxed">
                          {ageGroup.description}
                        </span>
                        {selectedAgeGroup === ageGroup.value && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Target Selection */}
                <div className="mb-10">
                  <label className="block text-2xl font-bold text-slate-900 mb-8 text-center">
                    What are your main skin concerns?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {TARGET_CATEGORIES.map((target) => (
                      <button
                        key={target.value}
                        type="button"
                        onClick={() => handleTargetToggle(target.value)}
                        className={`relative flex flex-col items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group hover:scale-105 ${
                          selectedTargets.includes(target.value)
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-lg shadow-blue-100/50'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-md hover:bg-white/50'
                        }`}
                      >
                        <span className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{target.icon}</span>
                        <span className="text-base font-semibold text-slate-800 text-center group-hover:text-slate-900 transition-colors">
                          {target.label}
                        </span>
                        {selectedTargets.includes(target.value) && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Selected Targets Display */}
                  {selectedTargets.length > 0 && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl shadow-sm">
                      <h4 className="text-base font-bold text-green-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Selected Concerns:
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedTargets.map(target => {
                          const targetInfo = TARGET_CATEGORIES.find(t => t.value === target)
                          return (
                            <span key={target} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                              <span className="text-base">{targetInfo?.icon}</span>
                              <span>{targetInfo?.label}</span>
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={!selectedSkinType || isLoading}
                    className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-base shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Recommendations</span>
                          <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Recommendations Display */}
          {isSubmitted && (
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-bold mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Personalized Results
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                  Recommended Products for {SKIN_TYPES.find(st => st.value === selectedSkinType)?.label} Skin
                </h2>
                <p className="text-xl text-slate-600 mb-6">
                  We've selected <span className="font-bold text-blue-600">{recommendations.length}</span> products perfect for your skin type
                </p>
                
                {/* Age Group Display */}
                {selectedAgeGroup && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-2xl inline-block shadow-sm">
                    <span className="text-base text-purple-800 font-bold flex items-center gap-2">
                      <span className="text-lg">{AGE_GROUPS.find(ag => ag.value === selectedAgeGroup)?.icon}</span>
                      {AGE_GROUPS.find(ag => ag.value === selectedAgeGroup)?.label}
                    </span>
                  </div>
                )}

                {selectedTargets.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <span className="text-base text-slate-500 font-medium">Targeting:</span>
                    {selectedTargets.map(target => {
                      const targetInfo = TARGET_CATEGORIES.find(t => t.value === target)
                      return (
                        <span key={target} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                          <span className="text-base">{targetInfo?.icon}</span>
                          <span>{targetInfo?.label}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendations.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 block"
                    >
                      <div className="aspect-square bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center p-6 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-500">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-6xl group-hover:text-blue-400 transition-colors duration-300">🧴</div>';
                            }
                          }}
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-900 transition-colors duration-300">
                            {product.name}
                          </h3>
                          <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleFavorite(product)
                            }}
                            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                              isFavorite(product.id)
                                ? 'text-red-500 bg-red-50 shadow-lg shadow-red-100/50'
                                : 'text-slate-400 hover:text-red-500 hover:bg-red-50 hover:shadow-lg hover:shadow-red-100/50'
                            }`}
                          >
                            <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <p className="text-slate-600 text-base mb-6 line-clamp-3 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-6">
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {product.price}
                          </span>
                          <div className="flex flex-col items-end gap-3">
                            <span className="text-sm text-slate-600 bg-gradient-to-r from-slate-100 to-gray-100 px-4 py-2 rounded-full font-medium shadow-sm">
                              {product.category}
                            </span>
                            <span className={`text-sm px-3 py-2 rounded-full font-bold shadow-sm ${
                              product.usage === 'Morning'
                                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                                : product.usage === 'Evening'
                                ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200'
                                : product.usage === 'All Day'
                                ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200'
                                : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                            }`}>
                              {product.usage}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleAddToCart(product)
                          }}
                          className="group w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <span className="text-5xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    No recommendations found
                  </h3>
                  <p className="text-slate-500 text-lg mb-8">
                    We're working on adding more products for your skin type.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setRecommendations([])
                      setSelectedSkinType('')
                      setSelectedAgeGroup('')
                      setSelectedTargets([])
                    }}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-2">
                      Try Again
                      <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    </span>
                  </button>
                </div>
              )}

              {/* Reset Button */}
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setRecommendations([])
                    setSelectedSkinType('')
                    setSelectedAgeGroup('')
                    setSelectedTargets([])
                  }}
                  className="group px-6 py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium text-base bg-white/50 hover:bg-white/80 rounded-xl border border-slate-200/50 hover:border-slate-300/50 shadow-sm hover:shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Start Over
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
