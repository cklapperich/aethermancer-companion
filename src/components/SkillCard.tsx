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
            <th className="w-[70%] align-top text-left leading-[125%]">
              <span className={`font-alegreya font-bold text-[110%] ${skill.isMaverick() ? 'text-tier-maverick' : 'text-tier-basic'}`} style={{ fontVariant: 'small-caps' }}>
                {skill.name}
              </span>
              <p className="font-figtree text-sm text-card-subtitle">
                {skill.skillType}
              </p>
            </th>

            {/* Element/Mana cost cell */}
            <td className="w-16 align-top text-center">
              {skill.manaCost.length > 0 && (() => {
                const count = skill.manaCost.length;
                let rows: Element[][] = [];

                // Determine layout based on count
                if (count <= 2) {
                  rows = [skill.manaCost];
                } else if (count === 3) {
                  rows = [skill.manaCost.slice(0, 2), skill.manaCost.slice(2, 3)];
                } else if (count === 4) {
                  rows = [skill.manaCost.slice(0, 2), skill.manaCost.slice(2, 4)];
                } else if (count >= 5) {
                  rows = [skill.manaCost.slice(0, 3), skill.manaCost.slice(3, 5)];
                }

                return (
                  <div className="flex flex-col gap-0.5 items-center">
                    {rows.map((row, rowIdx) => (
                      <div
                        key={rowIdx}
                        className="flex gap-1 justify-center"
                        style={count === 4 && rowIdx === 1 ? { transform: 'translateX(calc(0.5rem + 1px))' } : undefined}
                      >
                        {row.map((element, idx) => (
                          <img
                            key={idx}
                            src={elementIcons[element]}
                            alt={element}
                            className="w-4 h-4 flex-shrink-0"
                            style={{ minWidth: '16px', minHeight: '16px' }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })()}
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
