"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Circle, Square, Video, RefreshCw, Upload, AlertTriangle, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoRecorderProps {
  onSubmit: (blob: Blob) => void;
}

const MAX_DURATION_S = 180; // 3 minutes
const MAX_RETAKES = 2;

export default function VideoRecorder({ onSubmit }: VideoRecorderProps) {
  const [status, setStatus] = useState<'idle' | 'permission' | 'ready' | 'recording' | 'preview' | 'error'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [retakes, setRetakes] = useState(0);
  const [countdown, setCountdown] = useState(MAX_DURATION_S);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [stream]);

  const requestPermissions = async () => {
    setStatus('permission');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setStatus('ready');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Camera/Mic Error",
        description: "Could not access your camera and microphone. Please check permissions in your browser settings."
      })
    }
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(stream);
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
      setStatus('ready');
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

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col items-center justify-center">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {status !== 'recording' && status !== 'ready' && <div className="absolute inset-0 bg-black/50" />}
          
          {status === 'idle' && (
            <div className="absolute text-center text-white z-10">
              <Video className="w-12 h-12 mx-auto mb-4" />
              <Button onClick={requestPermissions}>Enable Camera & Mic</Button>
            </div>
          )}
          {status === 'permission' && <p className="absolute text-white z-10">Requesting permissions...</p>}
          {status === 'error' && (
             <div className="absolute text-center text-destructive-foreground z-10 p-4">
              <VideoOff className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h3 className="font-bold text-lg">Permission Denied</h3>
              <p className="text-sm">Please allow camera and microphone access.</p>
            </div>
          )}
          {status === 'recording' && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
              <Circle className="w-3 h-3 fill-current" />
              <span>REC</span>
              <span>{formatTime(countdown)}</span>
            </div>
          )}
          {videoUrl && status === 'preview' && (
            <video src={videoUrl} controls className="absolute inset-0 w-full h-full object-cover z-10" />
          )}
        </div>
        <div className="w-full mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              {status === 'ready' && <Button onClick={startRecording} size="lg"><Circle className="mr-2 h-4 w-4" /> Start Recording</Button>}
              {status === 'recording' && <Button onClick={stopRecording} variant="destructive" size="lg"><Square className="mr-2 h-4 w-4" /> Stop Recording</Button>}
              {status === 'preview' && (
                  <div className="flex gap-2">
                    <Button onClick={handleRetake} variant="secondary" disabled={retakes >= MAX_RETAKES}><RefreshCw className="mr-2 h-4 w-4" /> Retake ({MAX_RETAKES - retakes} left)</Button>
                    <Button onClick={handleSubmit}><Upload className="mr-2 h-4 w-4" /> Submit Answer</Button>
                  </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
                {status !== 'idle' && status !== 'permission' && status !== 'error' && (
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
