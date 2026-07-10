import { Bell, ArrowRight, X } from "lucide-react";

export function ApprovalAlertModal({
    open,
    count,
    onClose,
    onView,
}: {
    open: boolean;
    count: number;
    onClose: () => void;
    onView: () => void;
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* card */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-sm mx-4 animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* header dengan gradient */}
                    <div
                        className="relative px-6 pt-8 pb-10 text-center overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #1B3A5C, #2d5a8e)" }}
                    >
                        {/* decorative circles */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-white/10" />

                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* icon dengan efek pulse */}
                        <div className="relative inline-flex items-center justify-center mx-auto">
                            <span className="absolute inline-flex h-16 w-16 rounded-full bg-white/30 animate-ping" />
                            <span className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-lg">
                                <Bell className="w-7 h-7 text-[#1B3A5C]" strokeWidth={2} />
                            </span>
                        </div>
                    </div>

                    {/* body, overlap dikit ke header */}
                    <div className="relative px-6 pb-6 -mt-5 z-10">
                        <div className="bg-white rounded-xl text-center pt-3">
                            <h2 className="text-lg font-bold text-gray-900">
                                Ada Pengajuan Baru
                            </h2>
                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                                Terdapat{" "}
                                <span className="font-semibold text-[#1B3A5C]">
                                    {count} pengajuan
                                </span>{" "}
                                yang menunggu persetujuan kamu.
                            </p>

                            <div className="flex gap-2.5 mt-6">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Nanti
                                </button>
                                <button
                                    onClick={onView}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl text-white shadow-md hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#1B3A5C" }}
                                >
                                    Lihat Sekarang
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}