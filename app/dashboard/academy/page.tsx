'use client';

export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', marginTop: '-24px' }}>
      <iframe
        src="http://localhost:3002/academy.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Stackora Cybersecurity Academy"
      />
    </div>
  );
}