import type { ApiV1CategoryListList200 } from "@/lib/api/model"

interface CategorySelectionProps {
    isLoading: boolean
    categoriesData?: ApiV1CategoryListList200
    selectedCategoryId: number | null
    onCategoryToggle: (categoryId: number) => void
}

export function CategorySelection({
    isLoading,
    categoriesData,
    selectedCategoryId,
    onCategoryToggle
}: CategorySelectionProps) {

    return (
        <div className="mb-8">
            {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="relative flex items-center justify-center min-h-[120px] px-6 py-6 rounded-[22px] border border-border-primary bg-background-card shadow-card overflow-hidden animate-pulse"
                            style={{
                                backdropFilter: 'blur(128px)',
                                WebkitBackdropFilter: 'blur(128px)'
                            }}
                        >
                            {/* Decorative background effect */}
                            <div className="absolute inset-0 opacity-100">
                                <div
                                    className="absolute w-[200px] h-[200px] -top-[50px] -left-[50px] opacity-[0.08] pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                                    }}
                                />
                            </div>

                            {/* Skeleton text placeholder */}
                            <div className="relative z-10 h-5 w-24 bg-white/20 rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {categoriesData?.results?.map((category) => {
                        const isSelected = selectedCategoryId === category.id
                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryToggle(category.id || 0)}
                                className={`relative flex items-center justify-center min-h-[120px] px-6 py-6 rounded-[22px] border transition-all duration-200 overflow-hidden active:scale-[0.98] ${isSelected
                                    ? 'bg-brand-primary text-black border-brand-primary shadow-brand-lg'
                                    : 'bg-background-card text-white border-border-primary shadow-card active:bg-background-card-hover active:border-border-secondary'
                                    }`}
                                style={{
                                    backdropFilter: 'blur(128px)',
                                    WebkitBackdropFilter: 'blur(128px)'
                                }}
                            >
                                {/* Decorative background effect - always visible for non-selected */}
                                {!isSelected && (
                                    <div className="absolute inset-0 opacity-100">
                                        <div
                                            className="absolute w-[200px] h-[200px] -top-[50px] -left-[50px] opacity-[0.08] pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Category text */}
                                <span className={`relative z-10 font-bold text-lg text-center leading-tight ${isSelected ? 'text-black' : 'text-white'}`}>
                                    {category.title}
                                </span>


                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

