
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Circle, Square, Video, RefreshCw, Upload, AlertTriangle, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface VideoRecorderProps {
  onSubmit: (blob: Blob) => void;
}

const MAX_DURATION_S = 180; // 3 minutes
const MAX_RETAKES = 2;

export default function VideoRecorder({ onSubmit }: VideoRecorderProps) {
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

  const { toast } = useToast();

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
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [toast]);


  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
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
    };
    
    recorder.start();
    setStatus('recording');
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRetake = () => {
    if (retakes < MAX_RETAKES) {
      setRetakes(retakes + 1);
      setVideoUrl(null);
      setStatus('idle');
    } else {
        toast({
            variant: "destructive",
            title: "No more retakes",
            description: `You have used all your ${MAX_RETAKES} retakes for this question.`
        })
    }
  };
  
  const handleSubmit = () => {
      if(videoUrl) {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        onSubmit(blob);
      }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  const renderContent = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="absolute text-center text-white z-10">
          <p>Initializing camera...</p>
        </div>
      );
    }
    
    if (status === 'recording') {
      return (
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold z-20">
          <Circle className="w-3 h-3 fill-current" />
          <span>REC</span>
          <span>{formatTime(countdown)}</span>
        </div>
      )
    }

    if (videoUrl && status === 'preview') {
      return (
        <video src={videoUrl} controls autoPlay className="absolute inset-0 w-full h-full object-cover z-10" />
      )
    }

    return null;
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col items-center justify-center">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {renderContent()}
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <VideoOff className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use this feature.
              </AlertDescription>
            </Alert>
        )}

        <div className="w-full mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              {status === 'idle' && <Button onClick={startRecording} size="lg" disabled={!hasCameraPermission}><Circle className="mr-2 h-4 w-4" /> Start Recording</Button>}
              {status === 'recording' && <Button onClick={stopRecording} variant="destructive" size="lg"><Square className="mr-2 h-4 w-4" /> Stop Recording</Button>}
              {status === 'preview' && (
                  <div className="flex gap-2">
                    <Button onClick={handleRetake} variant="secondary" disabled={retakes >= MAX_RETAKES}><RefreshCw className="mr-2 h-4 w-4" /> Retake ({MAX_RETAKES - retakes} left)</Button>
                    <Button onClick={handleSubmit}><Upload className="mr-2 h-4 w-4" /> Submit Answer</Button>
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
