import React from 'react'

interface RadialEffectProps {
    className?: string
}

const RadialEffect: React.FC<RadialEffectProps> = ({ className }) => {
    return (
        <div
            className={`fixed pointer-events-none ${className || ''}`}
            style={{
                width: '294px',
                height: '294px',
                top: '50vh',
                left: '-147px', // Half of 294px (147px) so only half is visible
                transform: 'translateY(-50%)', // Center vertically
                opacity: 0.08,
                background: 'radial-gradient(50% 50% at 50% 50%, var(--color-brand-primary) 0%, rgba(252, 232, 3, 0) 100%)',
                backdropFilter: 'blur(128px)',
                WebkitBackdropFilter: 'blur(128px)', // For Safari support
                zIndex: -1, // Ensure it stays behind other content
            }}
        />
    )
}

export default RadialEffect
