'use client';

export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', marginTop: '-24px' }}>
      <iframe
        src="http://localhost:3003/ai.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Stackora AI Assistant"
      />
    </div>
  );
}