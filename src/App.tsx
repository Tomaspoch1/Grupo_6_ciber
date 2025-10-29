import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')

  return (
    <div className="app-container">
      <div className="login-dialog">
        <div className="header-top">
          <svg className="google-logo" viewBox="0 0 24 24" width="24" height="24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>

        <div className="dialog-header">
          <div className="header-left">
            <h1 className="login-title">Inicia sesión</h1>
          </div>
          <div className="header-right">
            <div className="input-container">
              <input
                type="text"
                className="email-input"
                placeholder="Correo electrónico o teléfono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="dialog-content">
          <div className="content-left">
            <p className="description">
              con tu cuenta de Google. Esta cuenta estará disponible para otras aplicaciones de Google en el navegador.
            </p>
          </div>

          <div className="content-right">
            <a href="#" className="forgot-link">¿Has olvidado tu correo electrónico?</a>
            
            <p className="guest-mode-info">
              ¿No es tu ordenador? Usa el modo Invitado para iniciar sesión de forma privada. <a href="#" className="info-link">Más información sobre cómo usar el modo Invitado</a>
            </p>
          </div>
        </div>

        <div className="dialog-footer">
          <a href="#" className="create-account-link">Crear cuenta</a>
          <button className="next-btn">Siguiente</button>
        </div>
      </div>

      <div className="page-footer">
        <div className="language-selector">
          <span>Español (España)</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <path d="M6 8L2 4h8L6 8z"/>
          </svg>
        </div>
        <div className="footer-links">
          <a href="#">Ayuda</a>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
        </div>
      </div>
    </div>
  )
}

export default App
