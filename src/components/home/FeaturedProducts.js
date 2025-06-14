'use client';

import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
export default function FeaturedProducts({ products = [] }) {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isInteractingRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  const scrollSpeed = 1;
  const allProducts = [...products, ...products];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const singleListWidth = slider.scrollWidth / 2;
    let animationFrameId;

    function autoScroll() {
      if (
        !isPaused &&
        slider &&
        !isInteractingRef.current &&
        !isDragging.current
      ) {
        slider.scrollLeft += scrollSpeed;

        if (slider.scrollLeft >= singleListWidth) {
          const scrollBehavior = slider.style.scrollBehavior;
          slider.style.scrollBehavior = 'auto';

          requestAnimationFrame(() => {
            slider.scrollLeft -= singleListWidth;
            slider.style.scrollBehavior = scrollBehavior || 'smooth';
          });
        }
      }

      animationFrameId = requestAnimationFrame(autoScroll);
    }

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      slider.scrollLeft += e.deltaY;
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });
    return () => slider.removeEventListener("wheel", handleWheel);
  }, []);

  function handleInteractionStart() {
    isInteractingRef.current = true;
    setIsPaused(true);
  }

  function handleInteractionEnd() {
    isInteractingRef.current = false;
    setIsPaused(false);
  }

  function onPointerDown(e) {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftStart.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = "grabbing";
    sliderRef.current.classList.add("select-none");
    handleInteractionStart();
  }

  function onPointerMove(e) {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX.current;
    sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
  }

  function onPointerUp() {
    isDragging.current = false;
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.classList.remove("select-none");
    handleInteractionEnd();
  }

  return (
    <section className="mb-20">
      <h3 className="text-2xl font-bold mb-8 text-center text-[#6B4C3B]">
        Produk Unggulan
      </h3>
      <div
        ref={sliderRef}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        className="overflow-x-auto whitespace-nowrap scroll-smooth cursor-grab"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
          {allProducts.map(({ id, name, price, image }, idx) => (
            <Link
              key={`${id}-${idx}`}
              href={`/catalog/product/${id}`}
              className="inline-block w-1/4 flex-shrink-0 mr-4 cursor-pointer rounded-lg shadow-md border border-[#6B4C3B]/30 overflow-hidden hover:shadow-lg transition"
              draggable={false}
            >
              <div className="w-full aspect-[3/3] object-cover rounded-t-lg">
                <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4 text-center bg-[#F5F1E9]">
                <h4 className="font-semibold text-lg text-[#6B4C3B]">{name}</h4>
                <p className="text-[#C24B4B] font-bold">
                  Rp {price.toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
