

/**
 * Islamic Inheritance (Faraidh) Logic Engine
 * Based on Syafi'i Mazhab.
 */

export interface Heir {
    id: string;
    name: string;
    gender: 'M' | 'F';
    type: 'fard' | 'asabah' | 'arham';
}

export interface Heirs {
    husband?: boolean;
    wife?: boolean;
    sons: number;
    daughters: number;
    father?: boolean;
    mother?: boolean;
    fullBrothers: number;
    fullSisters: number;
    grandfather?: boolean;
    grandmother?: boolean;
}

export interface HeirDetail {
    label: string;
    fraction: string;
    percentage: number;
    nominal: number;
}

export interface InheritanceResult {
    totalAssets: number;
    debts: number;
    bequests: number;
    netInheritance: number;
    details: HeirDetail[];
}

export const calculateInheritance = (
    total: number,
    debts: number = 0,
    bequests: number = 0,
    heirs: Heirs
): InheritanceResult => {
    // 1. Initial Deductions
    const initialNet = total - debts;
    const maxBequest = initialNet / 3;
    const finalBequests = Math.min(bequests, maxBequest);
    const netInheritance = initialNet - finalBequests;

    const details: HeirDetail[] = [];
    const shares: { [key: string]: number } = {};
    const labels: { [key: string]: string } = {};

    const hasChildren = heirs.sons > 0 || heirs.daughters > 0;
    const hasSons = heirs.sons > 0;

    // 2. Determine Blocking (Hajb)
    // Catatan: Ayah & Ibu tidak pernah terhijab — tetap ditulis eksplisit untuk keterbacaan
    const areSiblingsBlocked = heirs.sons > 0 || heirs.father;

    // 3. Calculate Fixed Portions (Fard)
    
    // Husband / Wife
    if (heirs.husband) {
        shares['husband'] = hasChildren ? 1/4 : 1/2;
        labels['husband'] = hasChildren ? '1/4' : '1/2';
    } else if (heirs.wife) {
        shares['wife'] = hasChildren ? 1/8 : 1/4;
        labels['wife'] = hasChildren ? '1/8' : '1/4';
    }

    // Mother
    const hasTwoOrMoreSiblings = (heirs.fullBrothers + heirs.fullSisters) >= 2;
    if (heirs.mother) {
        // Gharrawain Case (Spouse, Mother, Father)
        const isGharrawain = (heirs.husband || heirs.wife) && heirs.father && !hasChildren && !hasTwoOrMoreSiblings;
        
        if (isGharrawain) {
            const spouseShare = shares['husband'] || shares['wife'] || 0;
            shares['mother'] = (1 - spouseShare) / 3;
            labels['mother'] = '1/3 Sisa';
        } else {
            shares['mother'] = (hasChildren || hasTwoOrMoreSiblings) ? 1/6 : 1/3;
            labels['mother'] = (hasChildren || hasTwoOrMoreSiblings) ? '1/6' : '1/3';
        }
    }

    // Father
    if (heirs.father) {
        if (hasSons) {
            shares['father'] = 1/6;
            labels['father'] = '1/6';
        } else if (heirs.daughters > 0) {
            shares['father'] = 1/6; // He will also take asabah later
            labels['father'] = '1/6 + Sisa';
        } else {
            // Asabah only
            shares['father'] = 0;
            labels['father'] = 'Asabah';
        }
    }

    // Daughters (if no sons)
    if (heirs.daughters > 0 && heirs.sons === 0) {
        const dPortion = heirs.daughters === 1 ? 1/2 : 2/3;
        shares['daughters'] = dPortion;
        labels['daughters'] = heirs.daughters === 1 ? '1/2' : '2/3';
    }

    // 4. Handle Awl (Sum > 1)
    let totalFard = Object.values(shares).reduce((a, b) => a + b, 0);
    if (totalFard > 1) {
        // In Awl, the denominator increases, effectively reducing everyone's share proportionately
        for (const key in shares) {
            shares[key] = shares[key] / totalFard;
        }
        totalFard = 1;
    }

    // 5. Handle Asabah (Residuals)
    let remainder = 1 - totalFard;
    
    // Asabah Priority: Sons/Daughters -> Father -> Siblings
    if (remainder > 0.000001) {
        if (hasChildren) {
            // Daughters become Asabah with Sons (2:1)
            if (heirs.sons > 0) {
                const totalUnits = (heirs.sons * 2) + heirs.daughters;
                const unitValue = remainder / totalUnits;
                
                shares['sons_asabah'] = (unitValue * 2 * heirs.sons);
                labels['sons_asabah'] = 'Asabah (2:1)';
                
                if (heirs.daughters > 0) {
                    shares['daughters_asabah'] = (unitValue * heirs.daughters);
                    labels['daughters_asabah'] = 'Asabah (1:2)';
                }
                remainder = 0;
            } else {
                // Daughters already took Fard, remainder goes to other Asabah or Radd
            }
        }
        
        if (remainder > 0 && heirs.father) {
            shares['father_asabah'] = remainder;
            labels['father'] = (labels['father'] || '') + ' (Asabah)';
            remainder = 0;
        }

        if (remainder > 0 && !areSiblingsBlocked) {
            // Full Brothers/Sisters (2:1)
            const siblingUnits = (heirs.fullBrothers * 2) + heirs.fullSisters;
            if (siblingUnits > 0) {
                const unitValue = remainder / siblingUnits;
                if (heirs.fullBrothers > 0) {
                    shares['fb_asabah'] = unitValue * 2 * heirs.fullBrothers;
                    labels['fb_asabah'] = 'Asabah (2:1)';
                }
                if (heirs.fullSisters > 0) {
                    shares['fs_asabah'] = unitValue * heirs.fullSisters;
                    labels['fs_asabah'] = 'Asabah (1:2)';
                }
                remainder = 0;
            }
        }
    }

    // 6. Handle Radd (Sum < 1 and no Asabah)
    if (remainder > 0.000001) {
        // Radd to Fard heirs except Spouse
        const raddHeirs = Object.keys(shares).filter(k => k !== 'husband' && k !== 'wife');
        const raddBaseTotal = raddHeirs.reduce((sum, key) => sum + shares[key], 0);
        
        if (raddBaseTotal > 0) {
            for (const key of raddHeirs) {
                shares[key] += (shares[key] / raddBaseTotal) * remainder;
                labels[key] += ' + Radd';
            }
        } else {
            // If only spouse, in modern Syafii (Baitul Mal not active/integrated), 
            // some scholars allow Radd to spouse, but strict classic Syafii sends to Baitul Mal.
            // We'll leave it as remainder/Baitul Mal or give to spouse if user prefers.
            // Let's mark it as Baitul Mal / Maslahat Umum.
            shares['baitul_mal'] = remainder;
            labels['baitul_mal'] = 'Baitul Mal / Maslahat Umum';
        }
        remainder = 0;
    }

    // 7. Compile Final Details
    const finalize = (key: string, label: string, share: number, count: number = 1) => {
        if (share <= 0) return;
        details.push({
            label: `${label}${count > 1 ? ` (${count} Orang)` : ''}`,
            fraction: labels[key] || 'N/A',
            percentage: share,
            nominal: netInheritance * share
        });
    };

    if (shares['husband']) finalize('husband', 'Suami', shares['husband']);
    if (shares['wife']) finalize('wife', 'Istri', shares['wife']);
    if (shares['mother']) finalize('mother', 'Ibu', shares['mother']);
    if (shares['father'] || shares['father_asabah']) finalize('father', 'Ayah', (shares['father'] || 0) + (shares['father_asabah'] || 0));
    
    if (heirs.sons > 0) finalize('sons_asabah', 'Anak Laki-laki', shares['sons_asabah'] || 0, heirs.sons);
    
    const totalDaughterShare = (shares['daughters'] || 0) + (shares['daughters_asabah'] || 0);
    if (totalDaughterShare > 0) {
        const dLabelKey = shares['daughters_asabah'] ? 'daughters_asabah' : 'daughters';
        finalize(dLabelKey, 'Anak Perempuan', totalDaughterShare, heirs.daughters);
    }

    if (shares['fb_asabah']) finalize('fb_asabah', 'Saudara Kandung Lk', shares['fb_asabah'], heirs.fullBrothers);
    if (shares['fs_asabah']) finalize('fs_asabah', 'Saudara Kandung Pr', shares['fs_asabah'], heirs.fullSisters);
    if (shares['baitul_mal']) finalize('baitul_mal', 'Baitul Mal', shares['baitul_mal']);

    return {
        totalAssets: total,
        debts,
        bequests: finalBequests,
        netInheritance,
        details
    };
};
