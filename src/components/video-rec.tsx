
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Circle, Square, RefreshCw, Upload, AlertTriangle, VideoOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface VideoRecProps {
  onSubmit: (blob: Blob, duration: number) => void;
  isProcessing: boolean;
}

const MAX_DURATION_S = 180; // 3 minutes
const MAX_RETAKES = 2;

export default function VideoRec({ onSubmit, isProcessing }: VideoRecProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [retakes, setRetakes] = useState(0);
  const [countdown, setCountdown] = useState(MAX_DURATION_S);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartRef = useRef<number>(0);

  const { toast } = useToast();

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
    }
  }, []);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera/audio:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Device Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings to continue.',
          duration: 5000,
        });
      }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      stopRecording();
    };
  }, [toast, stopRecording]);


  const startRecording = () => {
    if (!streamRef.current) {
         toast({
          variant: 'destructive',
          title: 'Camera not ready',
          description: 'Please ensure camera permissions are enabled and try again.',
        });
        return;
    }
    recordedChunksRef.current = [];
    
    try {
        const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
        mediaRecorderRef.current = recorder;
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          setStatus('preview');
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          if (videoRef.current) {
             videoRef.current.srcObject = null;
          }
        };
        
        recorder.start();
        setStatus('recording');
        recordingStartRef.current = Date.now();
        setCountdown(MAX_DURATION_S);
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } catch (error) {
        console.error("Error starting recorder:", error);
        toast({
            variant: "destructive",
            title: "Recording Error",
            description: "Could not start video recording. Please check your device and browser.",
        });
    }
  };

  const handleRetake = () => {
    if (retakes < MAX_RETAKES) {
      setRetakes(retakes + 1);
      setVideoUrl(null);
      setStatus('idle');
       if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
    } else {
        toast({
            variant: "destructive",
            title: "No more retakes",
            description: `You have used all your ${MAX_RETAKES} retakes for this question.`
        })
    }
  };
  
  const handleSubmit = async () => {
      if(videoUrl) {
        const blob = await fetch(videoUrl).then(r => r.blob())
        const duration = Math.round((Date.now() - recordingStartRef.current) / 1000);
        onSubmit(blob, duration);
      }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col items-center justify-center">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              muted={status !== 'preview'} 
              playsInline 
              className="w-full h-full object-cover" 
              src={status === 'preview' ? videoUrl! : undefined}
              controls={status === 'preview'}
            />
            
            {status === 'recording' && (
                <div className="absolute top-2 right-2 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold z-20">
                    <Circle className="w-3 h-3 fill-current animate-pulse" />
                    <span>REC</span>
                    <span>{formatTime(countdown)}</span>
                </div>
            )}

            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/70">
                    <VideoOff className="h-12 w-12 mb-4" />
                    <p>Camera and Mic access denied.</p>
                </div>
            )}
            {hasCameraPermission === null && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/70">
                    <p>Requesting camera access...</p>
                </div>
            )}
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <VideoOff className="h-4 w-4" />
              <AlertTitle>Device Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera and microphone access in your browser to record your answer. You may need to refresh the page after granting permissions.
              </AlertDescription>
            </Alert>
        )}

        <div className="w-full mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              {status === 'idle' && <Button onClick={startRecording} size="lg" disabled={!hasCameraPermission || isProcessing}><Circle className="mr-2 h-4 w-4" /> Start Recording</Button>}
              {status === 'recording' && <Button onClick={stopRecording} variant="destructive" size="lg" disabled={isProcessing}><Square className="mr-2 h-4 w-4" /> Stop Recording</Button>}
              {status === 'preview' && (
                  <div className="flex gap-2">
                    <Button onClick={handleRetake} variant="secondary" disabled={retakes >= MAX_RETAKES || isProcessing}><RefreshCw className="mr-2 h-4 w-4" /> Retake ({MAX_RETAKES - retakes} left)</Button>
                    <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Submit Answer
                    </Button>
                  </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
                {hasCameraPermission && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Max duration: {formatTime(MAX_DURATION_S)}</span>
                    </div>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
