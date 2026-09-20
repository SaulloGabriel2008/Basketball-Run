import React, { useState } from 'react';
import { TeamEntity } from '../types';
import { generateTeamBadgeSvg } from '../utils/teamBadges';

interface TeamLogoProps {
  team: TeamEntity;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  team,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !team.logoUrl) {
    const svgString = generateTeamBadgeSvg(
      team.abbreviation,
      team.colors.primary,
      team.colors.secondary,
      team.colors.text
    );

    return (
      <div
        className={`inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
        dangerouslySetInnerHTML={{ __html: svgString }}
        title={team.name}
      />
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-full h-full object-contain filter drop-shadow-md transition-transform hover:scale-105"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
};
