import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { VideoOff, ScanLine } from 'lucide-react';

/**
 * Composant ScannerCameraPreview
 * Active la caméra du terminal (navigator.mediaDevices.getUserMedia) et,
 * quand `scanActif` est vrai, décode les QR codes en direct (via jsQR) sur
 * chaque image filmée. Dès qu'un code est reconnu, `onCodeDetecte(valeur)`
 * est appelé une seule fois (le parent arrête alors le scan).
 */
export default function ScannerCameraPreview({ scanActif, onCodeDetecte }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const frameRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'active' | 'error'

  // Démarre/arrête la caméra une seule fois (indépendamment de scanActif :
  // on garde le flux allumé pour que l'aperçu reste visible entre deux scans).
  useEffect(() => {
    let stream;

    async function activerCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus('active');
      } catch (error) {
        console.error('Caméra indisponible :', error);
        setStatus('error');
      }
    }

    activerCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Boucle de décodage QR, active seulement pendant que `scanActif` est vrai.
  useEffect(() => {
    if (!scanActif || status !== 'active') return;

    const canvas = canvasRef.current;
    const contexte = canvas.getContext('2d', { willReadFrequently: true });

    function analyserImage() {
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        contexte.drawImage(video, 0, 0, canvas.width, canvas.height);

        const image = contexte.getImageData(0, 0, canvas.width, canvas.height);
        const resultat = jsQR(image.data, image.width, image.height);

        if (resultat?.data) {
          onCodeDetecte(resultat.data);
          return; // Le parent va couper `scanActif` : pas besoin de reprogrammer.
        }
      }
      frameRef.current = requestAnimationFrame(analyserImage);
    }

    frameRef.current = requestAnimationFrame(analyserImage);

    return () => cancelAnimationFrame(frameRef.current);
  }, [scanActif, status, onCodeDetecte]);

  return (
    <div className="relative w-full aspect-video rounded-[10px] overflow-hidden bg-gray-900">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${status === 'active' ? 'block' : 'hidden'}`}
      />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs font-semibold text-gray-300">Activation de la caméra...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <VideoOff size={28} className="text-gray-400" />
          <p className="text-xs font-semibold text-gray-300">
            Caméra inaccessible. Vérifiez les autorisations du navigateur, ou saisissez le code manuellement.
          </p>
        </div>
      )}

      {/* CADRE DE VISÉE */}
      {status === 'active' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            {/* Coins jaunes */}
            <span className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-dore rounded-tl-[10px]" />
            <span className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-dore rounded-tr-[10px]" />
            <span className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-dore rounded-bl-[10px]" />
            <span className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-dore rounded-br-[10px]" />

            {/* Ligne de scan, uniquement pendant un scan actif */}
            {scanActif && (
              <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-red-500/80 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {status === 'active' && !scanActif && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
          <ScanLine size={13} />
          <span>Prêt à scanner</span>
        </div>
      )}
    </div>
  );
}
