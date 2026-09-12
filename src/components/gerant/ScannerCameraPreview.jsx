import React, { useEffect, useRef, useState } from 'react';
import { VideoOff } from 'lucide-react';

/**
 * Composant ScannerCameraPreview
 * Active la caméra du terminal (navigator.mediaDevices.getUserMedia) pour
 * la validation des tickets en direct. Le décodage QR à proprement parler
 * n'est pas encore branché (nécessite une librairie dédiée) : pour l'instant
 * le gérant confirme via le code saisi manuellement pendant que la caméra
 * filme en direct.
 */
export default function ScannerCameraPreview() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'active' | 'error'

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

            {/* Ligne de scan */}
            <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-red-500/80" />
          </div>
        </div>
      )}
    </div>
  );
}
