'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export type VoiceSearchStatus = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported'

interface UseVoiceSearchOptions {
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  language?: string
}

interface UseVoiceSearchReturn {
  isListening: boolean
  status: VoiceSearchStatus
  transcript: string
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
}

export function useVoiceSearch(options: UseVoiceSearchOptions = {}): UseVoiceSearchReturn {
  const { onResult, onError, language = 'en-US' } = options
  
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState<VoiceSearchStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check for browser support
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognitionAPI)
    
    if (!SpeechRecognitionAPI) {
      setStatus('unsupported')
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognitionAPI) return

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      setIsListening(true)
      setStatus('listening')
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results
      const latestResult = results[results.length - 1]
      
      if (!latestResult || !latestResult[0]) return
      
      const transcriptText = latestResult[0].transcript

      setTranscript(transcriptText)

      // If the result is final, process it
      if (latestResult.isFinal) {
        setStatus('processing')
        onResult?.(transcriptText.trim())
        
        // Auto-stop after final result
        setTimeout(() => {
          setStatus('idle')
          setIsListening(false)
        }, 500)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Voice recognition error'
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.'
          break
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please connect a microphone.'
          break
        case 'network':
          errorMessage = 'Network error. Please check your connection.'
          break
        case 'aborted':
          // User aborted, not an error
          setStatus('idle')
          setIsListening(false)
          return
        default:
          errorMessage = `Voice recognition error: ${event.error}`
      }

      setError(errorMessage)
      setStatus('error')
      setIsListening(false)
      onError?.(errorMessage)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (status === 'listening') {
        setStatus('idle')
      }
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [language, onResult, onError, status])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError('Voice search is not supported in your browser')
      setStatus('unsupported')
      return
    }

    setError(null)
    
    try {
      recognitionRef.current.start()
      
      // Auto-stop after 10 seconds to prevent infinite listening
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
        }
      }, 10000)
    } catch (err) {
      // Recognition might already be running
      if (err instanceof Error && err.message.includes('already started')) {
        recognitionRef.current.stop()
      }
    }
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    setIsListening(false)
    setStatus('idle')
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    status,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  }
}
