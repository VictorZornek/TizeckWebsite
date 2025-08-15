'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Viewport, Track, Slide, Image, ArrowButton, BottomBar, Dot, SrOnly } from "./styles";

type SlideItem = string | {
    src: string;
    alt?: string;
}

export interface ImageSliderProps {
    items: SlideItem[];
    initialIndex?: number;
    autoPlay?: boolean;
    interval?: number;
    loop?: boolean;
    height?: number;
    className?: string;
    ariaLabel?: string;
}

export function ImageSlider({
    items,
    initialIndex = 0,
    autoPlay = false,
    interval = 5000,
    loop = true,
    height = 380,
    className,
    ariaLabel = 'Galeria de imagens',
}: ImageSliderProps) {

    const normalized = useMemo(
        () =>
        (items ?? []).map((it) =>
            typeof it === 'string' ? { src: it, alt: '' } : it
        ),
        [items]
    );

    const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(normalized.length - 1, 0)));
    const [isHover, setIsHover] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const idTrack = useRef(`slider-track-${Math.random().toString(36).slice(2)}`);

    const hasItems = normalized.length > 0;

    const goTo = (i: number) => {
        if (!hasItems) return;

        if (loop) {
            const next = (i + normalized.length) % normalized.length;
            setIndex(next);

        } else {
            setIndex(Math.min(Math.max(i, 0), normalized.length - 1));
        }
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    // autoplay
    useEffect(() => {
        if (!autoPlay || !hasItems || isHover) return;

        const id = window.setInterval(next, interval);
        return () => window.clearInterval(id);
    }, [autoPlay, interval, isHover, hasItems, index, loop]);

    // keyboard navigation
    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            next();

        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prev();

        }
    };

    // touch swipe
    const onTouchStart = (event: React.TouchEvent) => {
        touchStartX.current = event.touches[0].clientX;
    };

    const onTouchEnd = (event: React.TouchEvent) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start == null) return;

        const delta = event.changedTouches[0].clientX - start;
        const threshold = 40; // px

        if (delta > threshold) prev();
        if (delta < -threshold) next();
    };

    // disable arrows if !loop
    const disablePrev = !loop && index === 0;
    const disableNext = !loop && index === normalized.length - 1;


    return (
        <Container
            className={className}
            style={{ height }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Viewport
                role="region"
                aria-roledescription="carousel"
                aria-label={ariaLabel}
                tabIndex={0}
                onKeyDown={onKeyDown}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <ArrowButton
                    type="button"
                    aria-label="Slide anterior"
                    onClick={prev}
                    disabled={disablePrev || !hasItems}
                    side="left"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </ArrowButton>

                <Track
                    id={idTrack.current}
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    aria-live="polite"
                >
                    {normalized.map((image, i) => (
                        <Slide
                            key={`${image.src}-${i}`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} de ${normalized.length}`}
                        >
                            <Image src={image.src} alt={image.alt ?? ''} />
                        </Slide>
                    ))}

                    {!hasItems && (
                        <Slide>
                            <div style={{ opacity: 0.6 }}>
                                <SrOnly>Nenhuma imagem</SrOnly>
                            </div>
                        </Slide>
                    )}
                </Track>

                <ArrowButton
                    type="button"
                    aria-label="Próximo slide"
                    onClick={next}
                    disabled={disableNext || !hasItems}
                    side="right"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </ArrowButton>
            </Viewport>

            <BottomBar>
                {normalized.map((_, i) => (
                    <Dot
                        key={i}
                        aria-label={`Ir para o slide ${i + 1}`}
                        aria-current={i === index ? 'true' : undefined}
                        $active={i === index}
                        onClick={() => goTo(i)}
                    />
                ))}
            </BottomBar>
        </Container>
    )
}