interface ServiceCardShimmerProps {
    count?: number;
}

export function ServiceCardShimmer({ count = 3 }: ServiceCardShimmerProps) {
    return (
        <div className="space-y-9">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="relative flex items-center justify-between px-6 flex-row w-full h-[108px] rounded-[22px] border border-[#FFFFFF0A] bg-[#FFFFFF05] shadow-[0px_1px_0px_0px_#FFFFFF14_inset] overflow-hidden animate-pulse"
                    style={{
                        backdropFilter: 'blur(128px)',
                        WebkitBackdropFilter: 'blur(128px)'
                    }}
                >
                    {/* Shimmer Content */}
                    <div className="space-y-1">
                        <div className="h-4 bg-white/20 rounded w-32"></div>
                        <div className="h-2 bg-white/10 rounded w-24 mt-2"></div>
                    </div>

                    {/* Shimmer Icon */}
                    <div className="absolute right-2 top-0">
                        <svg width="111" height="108" viewBox="0 0 111 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.16" d="M1.73438 -0.265625L109.266 107.266M109.266 -0.265625L1.73438 107.266M38.1549 -2V109M55.4979 -2V109M72.8435 -2V109M111 36.1565L0 36.1565M111 53.4994L0 53.4994M111 70.8449L0 70.8449M90.1875 53.5C90.1875 72.6574 74.6574 88.1875 55.5 88.1875C36.3426 88.1875 20.8125 72.6574 20.8125 53.5C20.8125 34.3426 36.3426 18.8125 55.5 18.8125C74.6574 18.8125 90.1875 34.3426 90.1875 53.5ZM72.8438 53.5C72.8438 63.0787 65.0787 70.8438 55.5 70.8438C45.9213 70.8438 38.1563 63.0787 38.1563 53.5C38.1563 43.9213 45.9213 36.1563 55.5 36.1563C65.0787 36.1563 72.8438 43.9213 72.8438 53.5Z" stroke="url(#paint0_radial_27_18405)" strokeWidth="0.5" />
                            <defs>
                                <radialGradient id="paint0_radial_27_18405" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55.5 53.5) rotate(90) scale(55.5)">
                                    <stop stopColor="white" />
                                    <stop offset="0.5" stopColor="white" stopOpacity="0.25" />
                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            ))}
        </div>
    );
}
