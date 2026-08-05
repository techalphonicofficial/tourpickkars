'use client' // Error components must be Client Components

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="h2">Something went wrong!</div>
          <p>We apologize for the inconvenience.</p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
