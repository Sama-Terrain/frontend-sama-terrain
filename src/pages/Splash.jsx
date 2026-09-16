import { useEffect, useRef } from 'react';
import splashVideo from '../assets/splash-video.mp4';

// Durée maximale d'affichage, au cas où la vidéo serait plus longue ou
// n'arriverait pas à se charger (on ne veut jamais bloquer l'utilisateur).
const DUREE_MAX_MS = 4000;

/**
 * Page Splash
 *
 * Écran affiché brièvement au tout premier chargement de l'application :
 * joue la vidéo de la marque au centre, puis appelle `onTermine()` pour
 * révéler l'accueil (dès la fin de la vidéo, ou après DUREE_MAX_MS).
 */
export default function Splash({ onTermine }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const minuteur = setTimeout(onTermine, DUREE_MAX_MS);
    return () => clearTimeout(minuteur);
  }, [onTermine]);

  return (
    <div className="fixed inset-0 z-[100] bg-vert-principal flex items-center justify-center">
      <video
        ref={videoRef}
        src={splashVideo}
        autoPlay
        muted
        playsInline
        onLoadedMetadata={(e) => { e.target.playbackRate = 2; }}
        onEnded={onTermine}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
