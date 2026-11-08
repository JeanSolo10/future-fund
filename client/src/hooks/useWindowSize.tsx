import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (Number(window.innerWidth) > 768) {
      setIsMobile(false);
    }

    if (Number(window.innerWidth) < 768) {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
  });

  return {
    isMobile,
  };
};
