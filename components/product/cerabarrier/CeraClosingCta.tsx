'use client'

import Image from 'next/image'
import type { ReactNode, RefObject } from 'react'

import { ceraSerif } from './ceraFont'

/**
 * Closing band for the bespoke product pages.
 *
 * These pages run two to three screens past the last chance to buy: the reader
 * finishes the FAQ, passes the reviews and lands on the site footer with the
 * add-to-bag control thousands of pixels behind them. This band closes the
 * page on the product instead of on site chrome, repeating the promise line
 * from the hero as a deliberate bookend.
 *
 * It also doubles as the sentinel that retracts the sticky bar: while the band
 * is on screen there is a real CTA in the layout, so the floating one steps
 * out of the way.
 */
export default function CeraClosingCta({
  image,
  name,
  headline,
  note,
  priceLabel,
  vatLabel,
  cta,
  sentinelRef,
  imageFit = 'cover',
}: {
  image: string
  name: string
  headline: string
  note: string
  /** Omitted for shoppers who are not allowed to see prices. */
  priceLabel?: string | null
  vatLabel?: string
  cta: ReactNode
  sentinelRef?: RefObject<HTMLDivElement | null>
  /**
   * How the shot meets the band.
   *
   * `cover` gives the whole band the shot's own studio grey, so the photograph
   * has no panel and no edge: its background and the band are one tone. Every
   * packshot in the catalogue is shot on the same flat grey, which is what
   * `--cera-shot` is set to, so the seam disappears rather than being disguised.
   * The shot is contained, not cropped, because these are tall bottles and
   * cropping to fill a landscape panel cuts their bases off against the band's
   * bottom edge.
   *
   * `blend` is for shots where cropping is not allowed - a kit photograph, where
   * every item in frame is part of what is being sold. Instead of fitting the
   * whole 4:5 frame inside a landscape panel, which leaves a hard-edged tile
   * stamped on the band, the panel is dropped and the shot is multiplied into
   * the band, so its white background becomes the band and only the products
   * remain. Only use it on a shot with a genuinely white background; a studio
   * grey would come through as a grey block.
   */
  imageFit?: 'cover' | 'blend'
}) {
  const blend = imageFit === 'blend'
  return (
    <section
      className={`border-t border-[var(--cera-line)] ${blend ? '' : 'bg-[var(--cera-shot)]'}`}
    >
      <div
        ref={sentinelRef}
        className="mx-auto flex max-w-[1000px] flex-col items-center text-center lg:min-h-[260px] lg:flex-row lg:items-stretch lg:text-start"
      >
        {/* The catalogue shots already sit on their own studio grey, so framing
            one in a tile only draws a second box around a photograph. Here the
            band carries that same grey and the shot has no panel at all: no
            edge, no radius, no card, nothing for the eye to catch.

            The shot is contained rather than cropped. These are tall bottles
            photographed square, and filling a landscape panel with them slices
            their bases off exactly where the band meets the footer, which reads
            as the product colliding with the page furniture.

            A blended shot is the kit case, where cropping is not allowed
            because every item in frame is part of what is being sold. It keeps
            the page background and multiplies into it, so the shot's white
            surround becomes the band and only the products remain. */}
        <div
          className={`relative w-full flex-none overflow-hidden ${
            blend
              ? 'aspect-[4/5] p-5 lg:h-auto lg:w-[290px] lg:self-center lg:p-6'
              : 'aspect-square lg:aspect-auto lg:h-auto lg:w-[300px]'
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 300px, 100vw"
            className={`object-contain ${blend ? 'mix-blend-multiply' : ''}`}
          />
        </div>

        <div className="min-w-0 flex-1 px-4 pt-10 sm:px-6 lg:px-10 lg:py-16">
          <p className={`${ceraSerif.variable} cera-serif text-[26px] leading-[1.15] sm:text-[32px]`}>
            {headline}
          </p>
          <p className="mt-2 text-[13px] uppercase tracking-[0.14em] text-[var(--cera-muted)]">{name}</p>
          <p className="mt-3 text-[13px] text-[var(--cera-muted)]">{note}</p>
        </div>

        <div className="flex flex-none flex-col items-center gap-4 px-4 pb-14 pt-7 sm:px-6 lg:items-end lg:justify-center lg:px-6 lg:py-16">
          {priceLabel ? (
            <p className="cera-serif cera-numeral text-[30px] text-[var(--cera-ink)]">
              {priceLabel}
              {vatLabel ? (
                <span className="ms-2 align-middle text-[12px] tracking-normal text-[var(--cera-muted)]">
                  {vatLabel}
                </span>
              ) : null}
            </p>
          ) : null}
          {cta}
        </div>
      </div>
    </section>
  )
}
