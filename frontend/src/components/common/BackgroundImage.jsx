
export const BackgroundImage = () => {
  return (
    <div
      className="fixed inset-0 z-[-1] bg-black overflow-hidden pointer-events-none"
      style={{
        // Используем CSS переменные для гибкости
        backgroundImage: "url('/bg_full.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transform: 'scale(1.05)',
        filter: 'brightness(0.9)' // Немного приглушим, чтобы контент читался лучше
      }}
    />
  );
};