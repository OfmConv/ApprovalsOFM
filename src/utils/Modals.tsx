"use client"

import type { ModalProps } from "@/types/interface";
import { useState } from "react";
export function Modal({ title, description, triggerLabel = "Buka", children, onConfirm, open: openProp, onClose }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = openProp !== undefined ? openProp : internalOpen;

  const handleClose = () => {
    setInternalOpen(false)
    onClose?.()
  }

  const handleConfirm = () => {
    onConfirm?.()
    handleClose()
  }

  return (
    <>
      {openProp === undefined && (
        <button
          onClick={() => setInternalOpen(true)}
          className="px-4 py-2 text-sm bg-[#2E6193] hover:bg-[#1477C2] text-white rounded-md transition-colors"
        >
          {triggerLabel}
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" />

          <div
            className="relative z-10 bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className=" mb-7">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h2>

            </div>
            <div className="mb-5 ">
              {description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  {description}
                </p>
              )}
            </div>
            {children && (
              <div className="mb-4">{children}</div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-[#2E6193] hover:bg-[#1477C2] text-white rounded-md transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
