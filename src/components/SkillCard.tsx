import React from 'react';
import { Skill, Element } from '../types/skills';
import styles from './SkillCard.module.css';
import { colorizeDescription } from '../utils/colorizeDescription';

interface SkillCardProps {
  skill: Skill;
}

const elementIcons: Record<Element, string> = {
  [Element.Fire]: '/assets/actions/32px-fire.png',
  [Element.Water]: '/assets/actions/32px-water.png',
  [Element.Earth]: '/assets/actions/32px-earth.png',
  [Element.Wind]: '/assets/actions/32px-wind.png',
  [Element.Wild]: '/assets/actions/32px-wild.png', // TODO: Replace with 32px PNG when available
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const iconPath = skill.skillType === 'Action'
    ? `/assets/actions/${skill.iconFilename}`
    : `/assets/traits/${skill.iconFilename}`;

  const colorizedDescription = colorizeDescription(skill.description);

  return (
    <div className={`${styles.themeBox} bg-theme-box text-white w-full max-w-[600px] aspect-[3/1] flex items-center`}>
      <table className="w-full h-full border-spacing-0">
        <tbody>
          <tr>
            {/* Icon cell */}
            <td className="w-[1px] h-12 text-center align-middle pr-3 align-top">
              <img
                src={iconPath}
                alt={skill.name}
                className="w-12 h-12 flex-shrink-0"
                style={{ minWidth: '48px', minHeight: '48px' }}
              />
            </td>

            {/* Title cell */}
            <th className="w-[70%] align-top text-left">
              <span className={`font-alegreya font-bold text-lg ${skill.isMaverick() ? 'text-tier-maverick' : 'text-tier-basic'}`}>
                {skill.name}
              </span>
              <p className="font-figtree text-[11px] text-card-subtitle">
                {skill.skillType}
              </p>
            </th>

            {/* Element/Mana cost cell */}
            <td className="w-16 align-top text-center">
              {skill.manaCost.length > 0 && (
                <p className="leading-4 m-0 flex gap-0.5 justify-center">
                  {skill.manaCost.map((element, idx) => (
                    <img
                      key={idx}
                      src={elementIcons[element]}
                      alt={element}
                      className="w-4 h-4 flex-shrink-0"
                      style={{ minWidth: '16px', minHeight: '16px' }}
                    />
                  ))}
                </p>
              )}
            </td>
          </tr>

          {/* Description row */}
          <tr>
            <td colSpan={3} className="font-figtree leading-[125%] py-2 text-card-text text-left">
              <span dangerouslySetInnerHTML={{ __html: colorizedDescription }} />
            </td>
          </tr>

          {/* Type tags row */}
          <tr>
            <td colSpan={3} className="text-right font-figtree text-[13px] text-card-text font-bold align-top">
              {skill.types.join(' + ')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
