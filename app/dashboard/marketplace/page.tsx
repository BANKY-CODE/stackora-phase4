'use client';

import { useEffect, useRef } from 'react';

export default function Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('stackora_access_token') || '';
    
    const sendToken = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'SET_TOKEN', token },
          'http://localhost:3001'
        );
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', sendToken);
    }
    return () => {
      if (iframe) iframe.removeEventListener('load', sendToken);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', marginTop: '-24px' }}>
      <iframe
        ref={iframeRef}
        src="http://localhost:3001/marketplace.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Stackora Marketplace"
      />
    </div>
  );
}
