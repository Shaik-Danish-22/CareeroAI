'use client'

import { useEffect, useState, useRef } from 'react'

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  onTranscriptReady?: (transcript: string) => void
}

export default function VideoRecorder({ onRecordingComplete, onTranscriptReady }: VideoRecorderProps) {
  const [mounted, setMounted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => {
      stopRecording()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  if (!mounted) {
    return <div className="bg-slate-100 rounded-xl h-64 animate-pulse" />
  }

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setHasPermission(true)
    } catch (error) {
      console.error('Permission denied:', error)
      setHasPermission(false)
      alert('Camera and microphone access required for video recording')
    }
  }

  const startRecording = async () => {
    if (!streamRef.current) {
      await requestPermissions()
      if (!streamRef.current) return
    }

    chunksRef.current = []
    
    const options = {
      mimeType: 'video/webm;codecs=vp8,opus'
    }
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setRecordedBlob(blob)
        onRecordingComplete(blob)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsPaused(false)
      
      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Failed to start recording. Please try again.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      // Stop video preview
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const resetRecording = () => {
    setRecordedBlob(null)
    setRecordingTime(0)
    chunksRef.current = []
    setHasPermission(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="font-semibold">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        {!hasPermission && !isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
            <div className="text-center text-white p-6">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg mb-4">Camera access required</p>
              <button
                onClick={requestPermissions}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Enable Camera & Microphone
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex gap-3 justify-center">
        {!isRecording && !recordedBlob && (
          <button
            onClick={startRecording}
            disabled={hasPermission === false}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" />
            </svg>
            Start Recording
          </button>
        )}

        {isRecording && !isPaused && (
          <>
            <button
              onClick={pauseRecording}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
              </svg>
              Pause
            </button>
            <button
              onClick={stopRecording}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <rect x="4" y="4" width="12" height="12" />
              </svg>
              Stop
            </button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <button
              onClick={resumeRecording}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Resume
            </button>
            <button
              onClick={stopRecording}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-semibold"
            >
              Stop
            </button>
          </>
        )}

        {recordedBlob && (
          <button
            onClick={resetRecording}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Record Again
          </button>
        )}
      </div>

      {/* Recording Info */}
      {recordedBlob && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-800 font-semibold">
            ✓ Recording complete! Duration: {formatTime(recordingTime)}
          </p>
          <p className="text-sm text-green-700 mt-1">
            Click "Submit Interview" below to upload and get AI evaluation
          </p>
        </div>
      )}
    </div>
  )
}