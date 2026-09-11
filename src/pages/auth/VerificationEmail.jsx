import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import loginBg from '../../assets/terrain-login.png';

export default function VerificationEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'mariegodmer@gmail.com';

  const [code, setCode] = useState(['4', '8', '2', '1', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length >= 4) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError('Veuillez entrer les 4 à 5 chiffres du code');
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 text-center">
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vert-principal tracking-tight">
            VÉRIFIEZ VOTRE E-MAIL
          </h1>

          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            Nous avons envoyé un code de vérification à<br />
            <strong className="text-gray-900 font-bold">{email}</strong>
          </p>

          {error && (
            <Alert type="error" message={error} />
          )}

          {success && (
            <Alert type="success" message="✓ E-mail vérifié avec succès ! Redirection..." />
          )}

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-center items-center space-x-2 sm:space-x-3 pt-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-extrabold text-gray-900 bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-vert-principal focus:ring-1 focus:ring-vert-principal shadow-sm"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              rounded="8px"
              fullWidth
              className="uppercase tracking-wider"
            >
              VÉRIFIER
            </Button>
          </form>

          <div className="space-y-2 pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[11px] text-gray-400">
                Vous n'avez rien reçu ?
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <button
              type="button"
              onClick={() => alert('Un nouveau code vous a été envoyé (4821).')}
              className="text-xs font-extrabold text-gray-900 hover:underline cursor-pointer"
            >
              Renvoyer le code
            </button>
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Retourner à la <span className="font-bold text-gray-900">page de connexion</span>
            </button>
          </div>

        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gray-200 relative overflow-hidden">
        <img
          src={loginBg}
          alt="Sama-Terrain Auth"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
