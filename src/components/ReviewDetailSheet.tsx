"use client";

import React, { useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Sheet, Block } from "konsta/react";
import { Star } from "lucide-react";
import { useSwipeToClose } from "@/src/hooks/useSwipeToClose";
import { formatRating } from "@/src/utils/format";
import type { Review } from "@/src/models/Review";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function getInitials(name: string) {
  const parts = name.split(" ");
  return parts.map((p) => p[0] ?? "").join("").toUpperCase().slice(0, 2);
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-6 h-6 ${
            i <= rating
              ? "text-[#FF9500] fill-[#FF9500]"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-lg font-medium ml-2">{formatRating(rating)}</span>
    </div>
  );
}

interface ReviewDetailSheetProps {
  review: Review | null;
  opened: boolean;
  onClose: () => void;
}

export default function ReviewDetailSheet({ review, opened, onClose }: ReviewDetailSheetProps) {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const { sheetRef } = useSwipeToClose({
    onClose: handleClose,
    enabled: opened,
  });

  if (!mounted || !review) return null;

  return createPortal(
    <Sheet opened={opened} onBackdropClick={handleClose} className="pb-safe">
      <div ref={sheetRef} className="flex flex-col" style={{ maxHeight: "70dvh" }}>
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-9 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-6" data-scroll-container>
          {/* Author header */}
          <div className="flex items-center gap-4 py-4">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl shrink-0">
              {getInitials(review.authorName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-medium truncate">{review.authorName}</div>
              <div className="text-sm opacity-55">{review.category}</div>
            </div>
          </div>

          {/* Rating */}
          <Block className="my-0 mb-4" strong inset>
            <div className="text-sm opacity-55 mb-2">Оценка</div>
            <StarRow rating={review.rating} />
          </Block>

          {/* Order details (when backend provides them) */}
          {(review.description || review.contact || review.city) && (
            <Block className="my-0 mb-4" strong inset>
              <div className="text-sm opacity-55 mb-2">Заказ</div>
              {review.description && (
                <p className="text-base leading-relaxed whitespace-pre-wrap mb-3">{review.description}</p>
              )}
              {review.city && (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm opacity-55">Город</span>
                  <span className="text-sm">{review.city}</span>
                </div>
              )}
              {review.contact && (
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-55">Контакт</span>
                  <span className="text-sm">{review.contact}</span>
                </div>
              )}
            </Block>
          )}

          {/* Comment */}
          {review.comment && (
            <Block className="my-0 mb-4" strong inset>
              <div className="text-sm opacity-55 mb-2">Комментарий</div>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{review.comment}</p>
            </Block>
          )}

          {/* Meta */}
          <Block className="my-0" strong inset>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-55">Дата</span>
              <span className="text-sm">{formatDate(review.createdAt)}</span>
            </div>
          </Block>
        </div>
      </div>
    </Sheet>,
    document.body,
  );
}
