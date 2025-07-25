import { FaUser } from "react-icons/fa";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ src, alt = "User", size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-20 h-20",
    xl: "w-32 h-32"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-8 h-8", 
    xl: "w-12 h-12"
  };

  if (!src) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center`}>
        <FaUser className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-2xl overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to gradient background with icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <svg class="${iconSizes[size]} text-white fill-current" viewBox="0 0 448 512">
                  <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
                </svg>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}
