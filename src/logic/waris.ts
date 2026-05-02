/**
 * Islamic Inheritance (Faraidh) Logic Engine
 * Based on Syafi'i Mazhab.
 * Includes full heirs and Hijab Hirman logic.
 */

export interface Heirs {
    // Leluhur & Pasangan
    husband: boolean;
    wives: number; // max 4
    father: boolean;
    mother: boolean;
    grandfather: boolean; // Paternal grandfather
    grandmotherMaternal: boolean; // Maternal grandmother
    grandmotherPaternal: boolean; // Paternal grandmother

    // Keturunan
    sons: number;
    daughters: number;
    grandsons: number; // Son of son
    granddaughters: number; // Daughter of son

    // Kerabat Samping (Samping)
    fullBrothers: number;
    fullSisters: number;
    consanguineBrothers: number; // Saudara sebapak
    consanguineSisters: number; // Saudari sebapak
    uterineBrothers: number; // Saudara seibu
    uterineSisters: number; // Saudari seibu

    fullNephews: number; // Son of full brother
    consanguineNephews: number; // Son of consanguine brother
    
    fullUncles: number; // Full brother of father
    consanguineUncles: number; // Consanguine brother of father
    fullCousins: number; // Son of full uncle
    consanguineCousins: number; // Son of consanguine uncle
}

export interface HeirDetail {
    key: string;
    label: string;
    count: number;
    fraction: string; // e.g. "1/2", "Asabah", "-"
    percentage: number; // 0 to 1
    nominal: number;
    status: 'Mendapat Bagian' | 'Mahjub';
    blockedBy?: string;
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
    const initialNet = total - debts;
    const maxBequest = initialNet / 3;
    const finalBequests = Math.min(bequests, maxBequest);
    const netInheritance = initialNet - finalBequests;

    const details: HeirDetail[] = [];
    const shares: { [key: string]: number } = {};
    const labels: { [key: string]: string } = {};

    const hasChildren = heirs.sons > 0 || heirs.daughters > 0;
    const hasGrandChildren = heirs.grandsons > 0 || heirs.granddaughters > 0;
    const hasDescendants = hasChildren || hasGrandChildren;
    const hasMaleDescendants = heirs.sons > 0 || heirs.grandsons > 0;
    const hasFemaleDescendants = heirs.daughters > 0 || heirs.granddaughters > 0;

    const countSiblings = heirs.fullBrothers + heirs.fullSisters + heirs.consanguineBrothers + heirs.consanguineSisters + heirs.uterineBrothers + heirs.uterineSisters;
    const hasTwoOrMoreSiblings = countSiblings >= 2;

    // --- HIJAB HIRMAN LOGIC ---
    const mahjub: { [key: string]: string } = {};

    // 1. Keturunan
    if (heirs.sons > 0) {
        mahjub['grandsons'] = 'Anak Laki-laki';
        mahjub['granddaughters'] = 'Anak Laki-laki';
    } else if (heirs.daughters >= 2 && heirs.grandsons === 0) {
        mahjub['granddaughters'] = '2+ Anak Perempuan';
    }

    // 2. Leluhur
    if (heirs.father) {
        mahjub['grandfather'] = 'Ayah';
        mahjub['grandmotherPaternal'] = 'Ayah';
    }
    if (heirs.mother) {
        mahjub['grandmotherMaternal'] = 'Ibu';
        mahjub['grandmotherPaternal'] = 'Ibu';
    }

    // 3. Saudara Kandung
    if (hasMaleDescendants || heirs.father) {
        mahjub['fullBrothers'] = hasMaleDescendants ? 'Keturunan Laki-laki' : 'Ayah';
        mahjub['fullSisters'] = hasMaleDescendants ? 'Keturunan Laki-laki' : 'Ayah';
    }

    // 4. Saudara Sebapak
    const isFullSisterAsabahMaalGhair = heirs.fullSisters > 0 && hasFemaleDescendants && !hasMaleDescendants && heirs.fullBrothers === 0;
    
    if (hasMaleDescendants || heirs.father || heirs.fullBrothers > 0 || isFullSisterAsabahMaalGhair) {
        mahjub['consanguineBrothers'] = 'Keturunan Lk / Ayah / Sdr Kandung Lk / Sdr Pr (Asabah)';
        mahjub['consanguineSisters'] = 'Keturunan Lk / Ayah / Sdr Kandung Lk / Sdr Pr (Asabah)';
    } else if (heirs.fullSisters >= 2 && heirs.consanguineBrothers === 0) {
        mahjub['consanguineSisters'] = '2+ Sdr Perempuan Kandung';
    }

    // 5. Saudara Seibu
    if (hasDescendants || heirs.father || heirs.grandfather) {
        mahjub['uterineBrothers'] = 'Keturunan / Ayah / Kakek';
        mahjub['uterineSisters'] = 'Keturunan / Ayah / Kakek';
    }

    // 6. Keponakan Kandung Lk
    if (hasMaleDescendants || heirs.father || heirs.grandfather || heirs.fullBrothers > 0 || isFullSisterAsabahMaalGhair || heirs.consanguineBrothers > 0) {
        mahjub['fullNephews'] = 'Keturunan Lk / Ayah / Kakek / Saudara';
    }

    // 7. Keponakan Sebapak Lk
    if (mahjub['fullNephews'] || heirs.fullNephews > 0) {
        mahjub['consanguineNephews'] = 'Ahli waris yang lebih dekat / Keponakan Kandung';
    }

    // 8. Paman Kandung
    if (mahjub['consanguineNephews'] || heirs.consanguineNephews > 0) {
        mahjub['fullUncles'] = 'Ahli waris yang lebih dekat';
    }

    // 9. Paman Sebapak
    if (mahjub['fullUncles'] || heirs.fullUncles > 0) {
        mahjub['consanguineUncles'] = 'Ahli waris yang lebih dekat';
    }

    // 10. Sepupu Kandung
    if (mahjub['consanguineUncles'] || heirs.consanguineUncles > 0) {
        mahjub['fullCousins'] = 'Ahli waris yang lebih dekat';
    }

    // 11. Sepupu Sebapak
    if (mahjub['fullCousins'] || heirs.fullCousins > 0) {
        mahjub['consanguineCousins'] = 'Ahli waris yang lebih dekat';
    }

    // --- FARDH CALCULATION ---
    
    // Suami / Istri
    if (heirs.husband) {
        shares['husband'] = hasDescendants ? 1/4 : 1/2;
        labels['husband'] = hasDescendants ? '1/4' : '1/2';
    } else if (heirs.wives > 0) {
        shares['wives'] = hasDescendants ? 1/8 : 1/4;
        labels['wives'] = hasDescendants ? '1/8' : '1/4';
    }

    // Ibu
    if (heirs.mother) {
        // Gharrawain Case
        const isGharrawain = (heirs.husband || heirs.wives > 0) && heirs.father && !hasDescendants && !hasTwoOrMoreSiblings;
        if (isGharrawain) {
            const spouseShare = shares['husband'] || shares['wives'] || 0;
            shares['mother'] = (1 - spouseShare) / 3;
            labels['mother'] = '1/3 Sisa';
        } else {
            shares['mother'] = (hasDescendants || hasTwoOrMoreSiblings) ? 1/6 : 1/3;
            labels['mother'] = (hasDescendants || hasTwoOrMoreSiblings) ? '1/6' : '1/3';
        }
    }

    // Nenek (Paternal & Maternal share 1/6 equally if not blocked)
    const validGmM = heirs.grandmotherMaternal && !mahjub['grandmotherMaternal'];
    const validGmP = heirs.grandmotherPaternal && !mahjub['grandmotherPaternal'];
    if (validGmM && validGmP) {
        shares['grandmotherMaternal'] = 1/12;
        shares['grandmotherPaternal'] = 1/12;
        labels['grandmotherMaternal'] = '1/6 (Berbagi)';
        labels['grandmotherPaternal'] = '1/6 (Berbagi)';
    } else if (validGmM) {
        shares['grandmotherMaternal'] = 1/6;
        labels['grandmotherMaternal'] = '1/6';
    } else if (validGmP) {
        shares['grandmotherPaternal'] = 1/6;
        labels['grandmotherPaternal'] = '1/6';
    }

    // Ayah
    if (heirs.father) {
        if (hasMaleDescendants) {
            shares['father'] = 1/6;
            labels['father'] = '1/6';
        } else if (hasFemaleDescendants) {
            shares['father'] = 1/6; // Asabah later
            labels['father'] = '1/6 + Sisa';
        } else {
            shares['father'] = 0; // Asabah pure
            labels['father'] = 'Asabah';
        }
    }

    // Kakek (if not blocked)
    if (heirs.grandfather && !mahjub['grandfather']) {
        // Asumsi sederhana tanpa musytarakah kakek-saudara (kasus rumit Syafi'i)
        // Kita gunakan hukum standar kakek sama dengan ayah jika ayah tidak ada.
        if (hasMaleDescendants) {
            shares['grandfather'] = 1/6;
            labels['grandfather'] = '1/6';
        } else if (hasFemaleDescendants) {
            shares['grandfather'] = 1/6; 
            labels['grandfather'] = '1/6 + Sisa';
        } else {
            shares['grandfather'] = 0;
            labels['grandfather'] = 'Asabah';
        }
    }

    // Anak Perempuan
    if (heirs.daughters > 0 && heirs.sons === 0) {
        shares['daughters'] = heirs.daughters === 1 ? 1/2 : 2/3;
        labels['daughters'] = heirs.daughters === 1 ? '1/2' : '2/3';
    }

    // Cucu Perempuan (if not blocked)
    if (heirs.granddaughters > 0 && !mahjub['granddaughters'] && heirs.grandsons === 0) {
        if (heirs.daughters === 1) {
            shares['granddaughters'] = 1/6; // Takmilah 2/3
            labels['granddaughters'] = '1/6';
        } else if (heirs.daughters === 0) {
            shares['granddaughters'] = heirs.granddaughters === 1 ? 1/2 : 2/3;
            labels['granddaughters'] = heirs.granddaughters === 1 ? '1/2' : '2/3';
        }
    }

    // Saudara Seibu
    const validUterineB = heirs.uterineBrothers > 0 && !mahjub['uterineBrothers'];
    const validUterineS = heirs.uterineSisters > 0 && !mahjub['uterineSisters'];
    if (validUterineB || validUterineS) {
        const totalUterine = (validUterineB ? heirs.uterineBrothers : 0) + (validUterineS ? heirs.uterineSisters : 0);
        const uShare = totalUterine === 1 ? 1/6 : 1/3;
        // Kasus Musytarakah: Jika Sdr Seibu 1/3, dan ada Sdr Kandung (Asabah), Sdr Kandung bisa nol.
        // Di Syafi'i, mereka digabung (Musytarakah).
        const isMusytarakah = heirs.husband && heirs.mother && totalUterine >= 2 && heirs.fullBrothers > 0 && !hasDescendants && !heirs.father && !heirs.grandfather;
        
        if (isMusytarakah) {
            // Berbagi 1/3 rata dengan Sdr Kandung (Lk & Pr)
            const totalPeople = totalUterine + heirs.fullBrothers + heirs.fullSisters;
            const perPerson = (1/3) / totalPeople;
            if (validUterineB) { shares['uterineBrothers'] = perPerson * heirs.uterineBrothers; labels['uterineBrothers'] = 'Musytarakah'; }
            if (validUterineS) { shares['uterineSisters'] = perPerson * heirs.uterineSisters; labels['uterineSisters'] = 'Musytarakah'; }
            if (heirs.fullBrothers > 0) { shares['fullBrothers_musy'] = perPerson * heirs.fullBrothers; labels['fullBrothers'] = 'Musytarakah'; }
            if (heirs.fullSisters > 0) { shares['fullSisters_musy'] = perPerson * heirs.fullSisters; labels['fullSisters'] = 'Musytarakah'; }
            // Tandai agar asabah kandung dilewati
            mahjub['fullBrothers'] = 'Musytarakah';
            mahjub['fullSisters'] = 'Musytarakah';
        } else {
            // Normal
            const perPerson = uShare / totalUterine;
            if (validUterineB) { shares['uterineBrothers'] = perPerson * heirs.uterineBrothers; labels['uterineBrothers'] = totalUterine === 1 ? '1/6' : '1/3'; }
            if (validUterineS) { shares['uterineSisters'] = perPerson * heirs.uterineSisters; labels['uterineSisters'] = totalUterine === 1 ? '1/6' : '1/3'; }
        }
    }

    // Saudara Perempuan Kandung (if not blocked, not musytarakah, not asabah bil ghair, not asabah maal ghair)
    if (heirs.fullSisters > 0 && !mahjub['fullSisters'] && heirs.fullBrothers === 0 && !isFullSisterAsabahMaalGhair) {
        shares['fullSisters'] = heirs.fullSisters === 1 ? 1/2 : 2/3;
        labels['fullSisters'] = heirs.fullSisters === 1 ? '1/2' : '2/3';
    }

    // Saudara Perempuan Sebapak (if not blocked)
    if (heirs.consanguineSisters > 0 && !mahjub['consanguineSisters'] && heirs.consanguineBrothers === 0) {
        // Is she asabah maal ghair?
        const isConsSistersAsabahMaalGhair = hasFemaleDescendants && !hasMaleDescendants && heirs.fullSisters === 0 && heirs.fullBrothers === 0;
        if (!isConsSistersAsabahMaalGhair) {
            if (heirs.fullSisters === 1) {
                shares['consanguineSisters'] = 1/6; // Takmilah 2/3
                labels['consanguineSisters'] = '1/6';
            } else if (heirs.fullSisters === 0) {
                shares['consanguineSisters'] = heirs.consanguineSisters === 1 ? 1/2 : 2/3;
                labels['consanguineSisters'] = heirs.consanguineSisters === 1 ? '1/2' : '2/3';
            }
        }
    }

    // --- AUL (Scale down if total > 1) ---
    let totalFard = Object.values(shares).reduce((a, b) => a + b, 0);
    if (totalFard > 1) {
        for (const key in shares) {
            shares[key] = shares[key] / totalFard;
            labels[key] += ' (Aul)';
        }
        totalFard = 1;
    }

    // --- ASABAH (Remainder) ---
    let remainder = 1 - totalFard;

    const distributeAsabah = (keyM: string, keyF: string, countM: number, countF: number, labelM: string, labelF: string) => {
        if (remainder <= 0.000001) return false;
        if (countM > 0 || countF > 0) {
            const totalUnits = (countM * 2) + countF;
            const unitValue = remainder / totalUnits;
            if (countM > 0) { shares[keyM] = (unitValue * 2 * countM); labels[keyM] = labelM; }
            if (countF > 0) { shares[keyF] = (unitValue * countF); labels[keyF] = labelF; }
            remainder = 0;
            return true;
        }
        return false;
    };

    const distributePureAsabah = (key: string, count: number, label: string) => {
        if (remainder <= 0.000001) return false;
        if (count > 0 || (typeof count === 'boolean' && count)) {
            shares[key] = (shares[key] || 0) + remainder;
            labels[key] = label;
            remainder = 0;
            return true;
        }
        return false;
    };

    if (remainder > 0.000001) {
        // 1. Keturunan (Anak)
        if (!distributeAsabah('sons_asabah', 'daughters_asabah', heirs.sons, heirs.sons > 0 ? heirs.daughters : 0, 'Asabah (2:1)', 'Asabah (1:2)')) {
            // 2. Keturunan (Cucu)
            if (!mahjub['grandsons']) {
                distributeAsabah('grandsons_asabah', 'granddaughters_asabah', heirs.grandsons, heirs.grandsons > 0 ? heirs.granddaughters : 0, 'Asabah (2:1)', 'Asabah (1:2)');
            }
        }

        // 3. Ayah
        if (heirs.father) { distributePureAsabah('father', 1, (labels['father'] || '') + ' (+Asabah)'); }
        // 4. Kakek
        else if (heirs.grandfather && !mahjub['grandfather']) { distributePureAsabah('grandfather', 1, (labels['grandfather'] || '') + ' (+Asabah)'); }

        // 5. Saudara Kandung / Asabah Ma'al Ghair (Sdr Pr Kandung)
        if (remainder > 0) {
            if (!mahjub['fullBrothers']) {
                distributeAsabah('fullBrothers_asabah', 'fullSisters_asabah', heirs.fullBrothers, heirs.fullBrothers > 0 ? heirs.fullSisters : 0, 'Asabah (2:1)', 'Asabah (1:2)');
            }
            if (remainder > 0 && isFullSisterAsabahMaalGhair) {
                distributePureAsabah('fullSisters_asabah', heirs.fullSisters, 'Asabah Ma\'al Ghair');
            }
        }

        // 6. Saudara Sebapak / Asabah Ma'al Ghair (Sdr Pr Sebapak)
        if (remainder > 0) {
            if (!mahjub['consanguineBrothers']) {
                distributeAsabah('consanguineBrothers_asabah', 'consanguineSisters_asabah', heirs.consanguineBrothers, heirs.consanguineBrothers > 0 ? heirs.consanguineSisters : 0, 'Asabah (2:1)', 'Asabah (1:2)');
            }
            const isConsSistersAsabahMaalGhair = hasFemaleDescendants && !hasMaleDescendants && heirs.fullSisters === 0 && heirs.fullBrothers === 0;
            if (remainder > 0 && isConsSistersAsabahMaalGhair && !mahjub['consanguineSisters']) {
                distributePureAsabah('consanguineSisters_asabah', heirs.consanguineSisters, 'Asabah Ma\'al Ghair');
            }
        }

        // 7-12. Keponakan, Paman, Sepupu (Hanya Laki-laki)
        if (!mahjub['fullNephews']) distributePureAsabah('fullNephews_asabah', heirs.fullNephews, 'Asabah');
        if (!mahjub['consanguineNephews']) distributePureAsabah('consanguineNephews_asabah', heirs.consanguineNephews, 'Asabah');
        if (!mahjub['fullUncles']) distributePureAsabah('fullUncles_asabah', heirs.fullUncles, 'Asabah');
        if (!mahjub['consanguineUncles']) distributePureAsabah('consanguineUncles_asabah', heirs.consanguineUncles, 'Asabah');
        if (!mahjub['fullCousins']) distributePureAsabah('fullCousins_asabah', heirs.fullCousins, 'Asabah');
        if (!mahjub['consanguineCousins']) distributePureAsabah('consanguineCousins_asabah', heirs.consanguineCousins, 'Asabah');
    }

    // --- RADD ---
    if (remainder > 0.000001) {
        const raddHeirs = Object.keys(shares).filter(k => k !== 'husband' && k !== 'wives');
        const raddBaseTotal = raddHeirs.reduce((sum, key) => sum + shares[key], 0);
        
        if (raddBaseTotal > 0) {
            for (const key of raddHeirs) {
                shares[key] += (shares[key] / raddBaseTotal) * remainder;
                labels[key] += ' (+Radd)';
            }
        } else {
            shares['baitul_mal'] = remainder;
            labels['baitul_mal'] = 'Baitul Mal / Maslahat Umum';
        }
        remainder = 0;
    }

    // --- COMPILE RESULTS ---
    const addResult = (key: string, label: string, count: number, shareKeyOrVal: string | number) => {
        if (count <= 0 && typeof count !== 'boolean') return;
        if (!count) return; // For booleans

        let share = typeof shareKeyOrVal === 'number' ? shareKeyOrVal : (shares[shareKeyOrVal] || 0);
        let status: 'Mendapat Bagian' | 'Mahjub' = share > 0 ? 'Mendapat Bagian' : 'Mahjub';
        let frac = labels[typeof shareKeyOrVal === 'string' ? shareKeyOrVal : ''] || '-';

        // Additional fallback: Check for combined asabah keys
        if (share === 0 && typeof shareKeyOrVal === 'string') {
           const asabahKey = `${shareKeyOrVal}_asabah`;
           const musyKey = `${shareKeyOrVal}_musy`;
           if (shares[asabahKey] > 0) {
               share = shares[asabahKey];
               frac = labels[asabahKey];
               status = 'Mendapat Bagian';
           } else if (shares[musyKey] > 0) {
               share = shares[musyKey];
               frac = labels[shareKeyOrVal];
               status = 'Mendapat Bagian';
           }
        }

        // Apply Mahjub from hirman list if share is 0
        let blockReason = mahjub[key];
        if (share === 0 && blockReason) {
            status = 'Mahjub';
            frac = 'Terhalang';
        } else if (share === 0 && !blockReason && !['baitul_mal'].includes(key)) {
            status = 'Mahjub';
            frac = 'Habis oleh Asabah'; // Habis oleh ahli waris lain
            blockReason = 'Harta Habis (Asabah)';
        }

        // Only add if they actually exist in the family structure inputted
        const countNum = typeof count === 'boolean' ? 1 : count;
        
        details.push({
            key,
            label,
            count: countNum,
            fraction: status === 'Mahjub' ? '-' : frac,
            percentage: share,
            nominal: netInheritance * share,
            status,
            blockedBy: blockReason
        });
    };

    // Leluhur & Pasangan
    if (heirs.husband) addResult('husband', 'Suami', 1, 'husband');
    if (heirs.wives > 0) addResult('wives', 'Istri', heirs.wives, 'wives');
    if (heirs.father) addResult('father', 'Ayah', 1, 'father');
    if (heirs.mother) addResult('mother', 'Ibu', 1, 'mother');
    if (heirs.grandfather) addResult('grandfather', 'Kakek', 1, 'grandfather');
    if (heirs.grandmotherMaternal) addResult('grandmotherMaternal', 'Nenek (dr Ibu)', 1, 'grandmotherMaternal');
    if (heirs.grandmotherPaternal) addResult('grandmotherPaternal', 'Nenek (dr Ayah)', 1, 'grandmotherPaternal');

    // Keturunan
    if (heirs.sons > 0) addResult('sons', 'Anak Laki-laki', heirs.sons, 'sons');
    if (heirs.daughters > 0) addResult('daughters', 'Anak Perempuan', heirs.daughters, 'daughters');
    if (heirs.grandsons > 0) addResult('grandsons', 'Cucu Lk (dr Anak Lk)', heirs.grandsons, 'grandsons');
    if (heirs.granddaughters > 0) addResult('granddaughters', 'Cucu Pr (dr Anak Lk)', heirs.granddaughters, 'granddaughters');

    // Kerabat Samping
    if (heirs.fullBrothers > 0) addResult('fullBrothers', 'Sdr Lk Kandung', heirs.fullBrothers, 'fullBrothers');
    if (heirs.fullSisters > 0) addResult('fullSisters', 'Sdr Pr Kandung', heirs.fullSisters, 'fullSisters');
    if (heirs.consanguineBrothers > 0) addResult('consanguineBrothers', 'Sdr Lk Sebapak', heirs.consanguineBrothers, 'consanguineBrothers');
    if (heirs.consanguineSisters > 0) addResult('consanguineSisters', 'Sdr Pr Sebapak', heirs.consanguineSisters, 'consanguineSisters');
    if (heirs.uterineBrothers > 0) addResult('uterineBrothers', 'Sdr Lk Seibu', heirs.uterineBrothers, 'uterineBrothers');
    if (heirs.uterineSisters > 0) addResult('uterineSisters', 'Sdr Pr Seibu', heirs.uterineSisters, 'uterineSisters');

    if (heirs.fullNephews > 0) addResult('fullNephews', 'Keponakan Lk Kandung', heirs.fullNephews, 'fullNephews');
    if (heirs.consanguineNephews > 0) addResult('consanguineNephews', 'Keponakan Lk Sebapak', heirs.consanguineNephews, 'consanguineNephews');
    
    if (heirs.fullUncles > 0) addResult('fullUncles', 'Paman Kandung', heirs.fullUncles, 'fullUncles');
    if (heirs.consanguineUncles > 0) addResult('consanguineUncles', 'Paman Sebapak', heirs.consanguineUncles, 'consanguineUncles');
    if (heirs.fullCousins > 0) addResult('fullCousins', 'Sepupu Lk Kandung', heirs.fullCousins, 'fullCousins');
    if (heirs.consanguineCousins > 0) addResult('consanguineCousins', 'Sepupu Lk Sebapak', heirs.consanguineCousins, 'consanguineCousins');

    // Baitul Mal if no heirs at all or leftover not distributed
    if (shares['baitul_mal'] > 0) {
        details.push({
            key: 'baitul_mal',
            label: 'Baitul Mal / Maslahat Umum',
            count: 1,
            fraction: labels['baitul_mal'],
            percentage: shares['baitul_mal'],
            nominal: netInheritance * shares['baitul_mal'],
            status: 'Mendapat Bagian'
        });
    }

    return {
        totalAssets: total,
        debts,
        bequests: finalBequests,
        netInheritance,
        details
    };
};
