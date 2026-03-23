"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { industries } from "@/data/industries";

function updateLocalStorage(slugs: Set<string>) {
  try {
    localStorage.setItem("industry_likes", JSON.stringify([...slugs]));
  } catch {
    /* empty */
  }
}

export function IndustryCards() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());
  const [animatingSlug, setAnimatingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/likes")
      .then((res) => res.json())
      .then((data) => setLikes(data.likes || {}))
      .catch(() => {});

    try {
      const stored = JSON.parse(
        localStorage.getItem("industry_likes") || "[]"
      );
      setLikedSlugs(new Set(stored));
    } catch {
      /* empty */
    }
  }, []);

  const handleToggleLike = useCallback(
    async (e: React.MouseEvent, slug: string) => {
      e.preventDefault();
      e.stopPropagation();

      const isCurrentlyLiked = likedSlugs.has(slug);
      const action = isCurrentlyLiked ? "unlike" : "like";

      // Animation
      setAnimatingSlug(slug);
      setTimeout(() => setAnimatingSlug(null), 500);

      // Optimistic update
      setLikes((prev) => ({
        ...prev,
        [slug]: Math.max((prev[slug] || 0) + (isCurrentlyLiked ? -1 : 1), 0),
      }));
      setLikedSlugs((prev) => {
        const next = new Set(prev);
        if (isCurrentlyLiked) {
          next.delete(slug);
        } else {
          next.add(slug);
        }
        updateLocalStorage(next);
        return next;
      });

      // API call
      try {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, action }),
        });
        const data = await res.json();
        if (data.like_count !== undefined) {
          setLikes((prev) => ({ ...prev, [slug]: data.like_count }));
        }
      } catch {
        // Revert on error
        setLikes((prev) => ({
          ...prev,
          [slug]: Math.max(
            (prev[slug] || 0) + (isCurrentlyLiked ? 1 : -1),
            0
          ),
        }));
        setLikedSlugs((prev) => {
          const next = new Set(prev);
          if (isCurrentlyLiked) {
            next.add(slug);
          } else {
            next.delete(slug);
          }
          updateLocalStorage(next);
          return next;
        });
      }
    },
    [likedSlugs]
  );

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {industries.map((industry) => {
        const isLiked = likedSlugs.has(industry.slug);
        const isAnimating = animatingSlug === industry.slug;

        return (
          <Link
            key={industry.slug}
            href={`/industry/${industry.slug}`}
            className="ind-card"
          >
            {/* Corner rectangles */}
            <div className="ind-rect lt" />
            <div className="ind-rect rt" />
            <div className="ind-rect lb" />
            <div className="ind-rect rb" />

            {/* Image */}
            <div className="ind-image">
              <Image
                src={`/images/industries/${industry.slug}.png`}
                alt={`${industry.name}営業イメージ`}
                fill
                className="object-cover rounded-[0.25rem]"
                sizes="(max-width: 640px) 50vw, 14rem"
              />
            </div>

            {/* Title + Like */}
            <div className="ind-title-row">
              <div className="ind-title">{industry.name}</div>
              <button
                type="button"
                onClick={(e) => handleToggleLike(e, industry.slug)}
                className={`ind-like-btn${isLiked ? " liked" : ""}${isAnimating ? " pop" : ""}`}
                aria-label={
                  isLiked
                    ? `いいね取り消し ${likes[industry.slug] || 0}`
                    : `いいね ${likes[industry.slug] || 0}`
                }
              >
                <svg
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ind-like-svg"
                >
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
                <span className="ind-like-count">
                  {(likes[industry.slug] || 0) > 0 ? likes[industry.slug] : ""}
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="ind-desc">{industry.description}</div>

            {/* Category / keywords */}
            <div className="ind-category">
              {industry.keywords.slice(0, 3).map((keyword) => (
                <span key={keyword} className="ind-btn">
                  {keyword}
                </span>
              ))}
            </div>

            {/* Action */}
            <div className="ind-action">練習を始める</div>
          </Link>
        );
      })}
    </div>
  );
}
