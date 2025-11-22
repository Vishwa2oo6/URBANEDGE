
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { XIcon, SparklesIcon, ShoppingCartIcon, PlusIcon } from './icons';
import { generateTryOnImage } from '../services/geminiService';
// @ts-ignore
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

// --- Helper Functions ---
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read blob as base64 string"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const PoseGuide: React.FC = () => (
    <svg viewBox="0 0 200 300" className="absolute inset-0 w-full h-full text-white/20 pointer-events-none" preserveAspectRatio="xMidYMid meet">
        <circle cx="100" cy="45" r="25" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <path d="M100 70 L100 160 M50 95 L150 95 M100 160 L70 260 M100 160 L130 260" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
    </svg>
);

// --- Component Interfaces & Types ---
interface AIStylistProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    allProducts: Product[];
}
type Step = 'capture' | 'result';

const loadingMessages = [
    "Warming up the virtual studio...",
    "Analyzing your style...",
    "Stitching the perfect look...",
    "Final touches in progress...",
];

// --- Main Component ---
const AIStylist: React.FC<AIStylistProps> = ({ isOpen, onClose, product, allProducts }) => {
    const [step, setStep] = useState<Step>('capture');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(product);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    
    // Refs for persistent access inside the animation loop
    const [poseLandmarker, setPoseLandmarker] = useState<any>(null);
    const poseLandmarkerRef = useRef<any>(null); 
    const stepRef = useRef<Step>('capture');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Keep stepRef in sync with state
    useEffect(() => {
        stepRef.current = step;
    }, [step]);

    const tryOnProducts = useMemo(() => {
        let featuredIds = [2, 11, 3, 4]; // Jacket, Denim Jacket, Oxford Shirt, Graphic T-Shirt
        let productsToShow: Product[] = [];
        const wearableCategories = ['Jackets', 'Shirts', 'T-Shirts'];

        if (product && wearableCategories.includes(product.category)) {
            productsToShow.push(product);
            featuredIds = featuredIds.filter(id => id !== product.id);
        }
        
        for (const id of featuredIds) {
            if (productsToShow.length >= 4) break;
            const featuredProduct = allProducts.find(p => p.id === id);
            if (featuredProduct && !productsToShow.some(p => p.id === featuredProduct.id)) {
                productsToShow.push(featuredProduct);
            }
        }
        return productsToShow.slice(0, 4);
    }, [product, allProducts]);

    // Initialize MediaPipe PoseLandmarker
    useEffect(() => {
        let isMounted = true;
        const initMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );
                const landmarker = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1 
                });
                if (isMounted) {
                    setPoseLandmarker(landmarker);
                    poseLandmarkerRef.current = landmarker; 
                }
            } catch (e) {
                console.warn("Failed to load pose landmarker, continuing without skeleton.", e);
            }
        };
        initMediaPipe();
        return () => { isMounted = false; };
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
        setIsCameraReady(false);
    }, []);
    
    const resetTryOnState = useCallback((preserveSelection = false) => {
        stopCamera();
        setStep('capture');
        if (!preserveSelection && product) {
            setSelectedProduct(product);
        } else if (!preserveSelection && tryOnProducts.length > 0) {
             setSelectedProduct(tryOnProducts[0]);
        }
        setUserImage(null);
        setGeneratedImage(null);
        setIsLoading(false);
        setError(null);
    }, [stopCamera, product, tryOnProducts]);

    // Define predictWebcam via useCallback to be stable across renders
    const predictWebcam = useCallback(() => {
        const video = videoRef.current;
        const canvas = overlayCanvasRef.current;
        const landmarker = poseLandmarkerRef.current;
        
        // Stop loop if step changed or component unmounted
        if (stepRef.current !== 'capture') {
            return; 
        }

        // Continue looping even if model isn't ready yet
        if (video && canvas && video.readyState >= 2) {
            let startTimeMs = performance.now();
            
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }
                
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Only try detection if landmarker is ready
                    if (landmarker) {
                        try {
                            const result = landmarker.detectForVideo(video, startTimeMs);
                            if (result.landmarks && result.landmarks.length > 0) {
                                const drawingUtils = new DrawingUtils(ctx);
                                for (const landmark of result.landmarks) {
                                    drawingUtils.drawLandmarks(landmark, {
                                        radius: (data: any) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
                                        color: '#FFFFFF',
                                        lineWidth: 2
                                    });
                                    drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
                                        color: '#00FF00',
                                        lineWidth: 4
                                    });
                                }
                            }
                        } catch (e) {
                             // Ignore intermittent errors during stream startup
                        }
                    }
                    ctx.restore();
                }
            }
        }
         
        requestRef.current = requestAnimationFrame(predictWebcam);
    }, []);
    
    useEffect(() => {
        let isActive = true;

        const startCamera = async () => {
            // Ensure any previous stream is stopped before starting a new one
            stopCamera();

            if (!navigator.mediaDevices?.getUserMedia) {
                 if(isActive) setError("Your browser does not support camera access.");
                 return;
            }
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'user', 
                        width: { ideal: 1280 }, 
                        height: { ideal: 720 } 
                    } 
                });
                
                if (!isActive || stepRef.current !== 'capture') {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Explicitly play to ensure it starts on all browsers
                    videoRef.current.play().catch(e => console.error("Video play failed", e));
                }
                setError(null); 
                
                // Start prediction loop
                requestRef.current = requestAnimationFrame(predictWebcam);

            } catch (err) {
                if (isActive) {
                    console.error("Camera start error:", err);
                    let message = "Could not access the camera. Please ensure it's not used by another app.";
                    if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
                        message = "Camera access denied. Please allow camera permissions in your browser settings.";
                    }
                    setError(message);
                }
            }
        };

        if (isOpen && step === 'capture') {
            startCamera();
        } else {
            stopCamera();
        }
        
        return () => {
            isActive = false;
            stopCamera();
        };
    }, [isOpen, step, predictWebcam, stopCamera]);

    useEffect(() => {
        if (!isOpen) {
            resetTryOnState(false);
        } else if (!selectedProduct) {
             if (product) setSelectedProduct(product);
             else if (tryOnProducts.length > 0) setSelectedProduct(tryOnProducts[0]);
        }
    }, [isOpen, product, tryOnProducts, resetTryOnState, selectedProduct]);
    
    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let messageIndex = 0;
            setCurrentLoadingMessage(loadingMessages[0]);
            interval = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setCurrentLoadingMessage(loadingMessages[messageIndex]);
            }, 2500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLoading]);
    
    const handleTryOn = async () => {
        if (!videoRef.current || !canvasRef.current || !selectedProduct) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Capture the frame mirrored
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        // Stop camera immediately
        setStep('result'); 
        stopCamera();

        canvas.toBlob(async (blob) => {
            if (blob) {
                const base64Image = await blobToBase64(blob);
                setUserImage(base64Image);
                setIsLoading(true);
                setError(null);
                
                try {
                    const newImage = await generateTryOnImage(base64Image, `a ${selectedProduct.name}`);
                    setGeneratedImage(newImage);
                } catch (err) {
                    console.error("GenAI Error:", err);
                    setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
                } finally {
                    setIsLoading(false);
                }
            }
        }, 'image/jpeg');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && selectedProduct) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                if (typeof reader.result === 'string') {
                    const base64Data = reader.result.split(',')[1];
                    setUserImage(base64Data);
                    setStep('result');
                    setIsLoading(true);
                    setError(null);
                    stopCamera();

                    try {
                        const newImage = await generateTryOnImage(base64Data, `a ${selectedProduct.name}`);
                        setGeneratedImage(newImage);
                    } catch (err) {
                        console.error("GenAI Error:", err);
                        setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
                    } finally {
                        setIsLoading(false);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        if (!selectedProduct) {
            setError("Please select an item first.");
            return;
        }
        fileInputRef.current?.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[101] flex items-center justify-center animate-fade-in p-4">
            <div className="relative bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl h-full max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-gray-700 flex-shrink-0 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-pink-500" />
                        AI Stylist {poseLandmarker ? '(Tracking Active)' : ''}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon /></button>
                </header>
                
                <main className="p-4 sm:p-6 flex-grow overflow-y-auto min-h-0">
                   {step === 'capture' && (
                        <div className="flex flex-col h-full space-y-4">
                            <p className="text-center text-gray-300 text-sm">Center yourself in the frame or upload a photo, then choose an item.</p>
                            <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
                                <div className="flex-1 relative bg-black rounded-md overflow-hidden flex items-center justify-center aspect-[3/4] md:aspect-auto min-h-[300px]">
                                    {error ? (
                                        <div className="text-center text-red-400 p-4 flex flex-col items-center justify-center h-full">
                                            <p className="font-bold">Camera Error</p>
                                            <p className="text-sm mt-2">{error}</p>
                                            <button 
                                                onClick={() => { setError(null); setStep('capture'); }} 
                                                className="mt-4 py-2 px-4 border border-red-400 text-red-400 hover:bg-red-400/20 rounded-md text-sm transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            {!isCameraReady && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                                </div>
                                            )}
                                            <video 
                                                ref={videoRef} 
                                                autoPlay 
                                                playsInline 
                                                muted 
                                                onLoadedMetadata={() => {
                                                    setIsCameraReady(true);
                                                    videoRef.current?.play().catch(e => console.warn("Auto-play prevented", e));
                                                }}
                                                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                                            />
                                            {/* Overlay Canvas for Landmarks */}
                                            <canvas 
                                                ref={overlayCanvasRef} 
                                                className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100" 
                                            />
                                            {!poseLandmarker && isCameraReady && <PoseGuide />}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 flex flex-col">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Select an item:</h3>
                                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[200px] md:max-h-none md:flex-grow">
                                        {tryOnProducts.map(p => (
                                            <button key={p.id} onClick={() => setSelectedProduct(p)} className="text-left group">
                                                <div className={`aspect-[3/4] bg-gray-800 overflow-hidden rounded-md border-2 transition-colors ${selectedProduct?.id === p.id ? 'border-pink-500' : 'border-transparent group-hover:border-gray-500'}`}>
                                                    <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {selectedProduct && <p className="text-center text-xs text-gray-300 mt-2 truncate">Selected: {selectedProduct.name}</p>}
                                </div>
                            </div>
                        </div>
                   )}
                   {step === 'result' && (
                       <div className="flex flex-col h-full text-center">
                           {isLoading ? (
                               <div className="flex-grow flex flex-col items-center justify-center animate-fade-in">
                                   <SparklesIcon className="w-16 h-16 text-pink-500 animate-pulse" />
                                   <p className="mt-4 text-white font-medium">{currentLoadingMessage}</p>
                               </div>
                           ) : error ? (
                                <div className="flex-grow flex flex-col items-center justify-center text-red-400 bg-red-900/50 p-4 rounded-md my-4 animate-fade-in">
                                    <p className="font-bold">An Error Occurred</p>
                                    <p className="text-sm mt-2">{error}</p>
                                    <button onClick={() => resetTryOnState(true)} className="mt-4 py-2 px-4 border border-red-500 text-red-400 hover:bg-red-500/20 rounded-md text-sm">Try Again</button>
                                </div>
                           ) : (
                               <div className="flex-grow overflow-y-auto space-y-4 animate-fade-in">
                                    <h2 className="text-xl font-bold text-white">Here's Your New Look!</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Before</h3>
                                            {userImage && <img src={`data:image/jpeg;base64,${userImage}`} alt="Your photo" className="rounded-md w-full" />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">After</h3>
                                            {generatedImage && <img src={`data:image/jpeg;base64,${generatedImage}`} alt="AI generated try-on" className="rounded-md w-full" />}
                                        </div>
                                    </div>
                               </div>
                           )}
                       </div>
                   )}
                </main>
                
                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                    {step === 'capture' ? (
                        <div className="flex flex-col gap-3">
                             <button onClick={handleTryOn} disabled={!selectedProduct || !!error || !isCameraReady} className="w-full py-3 bg-pink-600 text-white font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md">
                                {selectedProduct ? 'Capture & Try On' : 'Select an Item'}
                            </button>
                            <button onClick={triggerFileUpload} className="w-full py-3 border border-gray-600 text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-md flex items-center justify-center gap-2">
                                <PlusIcon className="w-5 h-5" /> Upload Your Photo
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileUpload} 
                            />
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <button onClick={() => resetTryOnState(false)} className="flex-1 py-3 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-md transition-colors">Try Another Item</button>
                            <button onClick={onClose} className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-200 rounded-md transition-colors">
                                <ShoppingCartIcon className="w-5 h-5"/> Shop This Look
                            </button>
                        </div>
                    )}
                </footer>
                
                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default AIStylist;
