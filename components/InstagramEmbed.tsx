'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

type InstagramEmbedProps = {
  /** The Instagram post URL, e.g. https://www.instagram.com/p/DTw2EfZjJWr/ */
  permalink: string;
  /** Show caption under the post (Instagram embed option). Defaults to true. */
  captioned?: boolean;
};

export function InstagramEmbed({ permalink, captioned = true }: InstagramEmbedProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const processEmbeds = () => {
    try {
      window.instgrm?.Embeds?.process?.();
    } catch {
      // no-op: embed processing should never break the page
    }
  };

  useEffect(() => {
    if (scriptLoaded) processEmbeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  return (
    <div className="w-full">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
          processEmbeds();
        }}
      />

      <div className="w-full flex justify-center">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          // Instagram reads this attribute; presence is enough.
          {...(captioned ? { 'data-instgrm-captioned': '' } : {})}
          style={{
            background: '#FFF',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: 1,
            maxWidth: 540,
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}


