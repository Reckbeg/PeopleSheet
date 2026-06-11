import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'PeopleSheet – Template HR Gratis untuk UMKM Indonesia';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#0F766E',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
          PeopleSheet
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            marginTop: 16,
            opacity: 0.9,
          }}
        >
          Template HR Gratis untuk UMKM Indonesia
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            marginTop: 32,
            padding: '8px 24px',
            border: '2px solid white',
            borderRadius: 8,
            opacity: 0.8,
          }}
        >
          Unduh XLSX dalam 30 detik
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
