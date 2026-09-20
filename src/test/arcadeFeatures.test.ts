import { describe, it, expect } from 'vitest';
import { COUNTRIES } from '../data/countries';
import { ARCHETYPES_CATALOG, combineArchetypes } from '../data/archetypes';
import { CAREER_SHOP_ITEMS } from '../data/careerShop';
import { pickRandomNcaaTeams } from '../components/PlayerCreationScreen';
import { useGameStore } from '../store/gameStore';

describe('Novas Funcionalidades Arcade & Economia', () => {
  it('deve conter catálogo de países com bandeiras, incluindo o Brasil', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(20);
    const brasil = COUNTRIES.find(c => c.code === 'BRA');
    expect(brasil).toBeDefined();
    expect(brasil?.name).toBe('Brasil');
    expect(brasil?.flag).toBe('🇧🇷');

    const usa = COUNTRIES.find(c => c.code === 'USA');
    expect(usa).toBeDefined();
    expect(usa?.flag).toBe('🇺🇸');
  });

  it('deve disponibilizar 10 arquétipos com atributos padrão balanceados', () => {
    expect(ARCHETYPES_CATALOG.length).toBe(10);
    const ids = ARCHETYPES_CATALOG.map(a => a.id);
    expect(ids).toContain('SHARPSHOOTER');
    expect(ids).toContain('PLAYMAKER');
    expect(ids).toContain('LOCKDOWN_DEFENDER');
    expect(ids).toContain('SLASHER');
    expect(ids).toContain('POST_SCORER');
    expect(ids).toContain('PAINT_PROTECTOR');
    expect(ids).toContain('MID_RANGE_MAESTRO');
    expect(ids).toContain('STRETCH_BIG');
    expect(ids).toContain('POINT_FORWARD');
    expect(ids).toContain('TWO_WAY_SPECIALIST');
  });

  it('deve fundir perfeitamente arquétipo primário e secundário sem sliders manuais', () => {
    // PG: Sharpshooter primário (65%) + Playmaker secundário (35%)
    const fused = combineArchetypes('SHARPSHOOTER', 'PLAYMAKER', 'PG');
    expect(fused.attributes.threePoint).toBeGreaterThanOrEqual(80);
    expect(fused.attributes.passing).toBeGreaterThanOrEqual(75);
    expect(fused.attributes.speed).toBeGreaterThanOrEqual(70);
    expect(fused.overall).toBeGreaterThanOrEqual(70);
    expect(fused.hybridTitle).toBeDefined();

    // Center: Paint Protector primário + Post Scorer secundário
    const bigMan = combineArchetypes('PAINT_PROTECTOR', 'POST_SCORER', 'C');
    expect(bigMan.attributes.block).toBeGreaterThanOrEqual(75);
    expect(bigMan.attributes.inside).toBeGreaterThanOrEqual(75);
    expect(bigMan.attributes.strength).toBeGreaterThanOrEqual(75);
    expect(bigMan.overall).toBeGreaterThanOrEqual(70);
  });

  it('deve sortear exatamente 4 equipes distintas da NCAA para o jogador escolher no recrutamento', () => {
    const teams = pickRandomNcaaTeams(4);
    expect(teams.length).toBe(4);

    const ids = new Set(teams.map(t => t.id));
    expect(ids.size).toBe(4);
    teams.forEach(t => {
      expect(t.league).toBe('NCAA');
    });
  });

  it('deve possuir catálogo da loja de carreira com itens de treino, luxo e investimentos', () => {
    expect(CAREER_SHOP_ITEMS.length).toBeGreaterThanOrEqual(10);
    
    const investments = CAREER_SHOP_ITEMS.filter(i => i.category === 'BUSINESS_INVESTMENT');
    expect(investments.length).toBeGreaterThan(0);
    const dividendInvestments = investments.filter(i => i.yearlyPassiveIncome);
    expect(dividendInvestments.length).toBeGreaterThanOrEqual(3);
    dividendInvestments.forEach(inv => {
      expect(inv.yearlyPassiveIncome).toBeGreaterThan(0);
    });

    const training = CAREER_SHOP_ITEMS.filter(i => i.category === 'GEAR_TRAINING');
    expect(training.length).toBeGreaterThan(0);
    training.forEach(t => {
      expect(t.attributeBonuses || t.energyBonus || t.injuryRiskReduction).toBeDefined();
    });
  });

  it('deve permitir compra na loja deduzindo saldo bancário e concedendo bônus', () => {
    const state = useGameStore.getState();
    const brazil = COUNTRIES.find(c => c.code === 'BRA')!;
    const hybrid = combineArchetypes('PLAYMAKER', 'SHARPSHOOTER', 'PG');

    state.createNewPlayer({
      firstName: 'Gabriel',
      lastName: 'Santos',
      country: brazil,
      position: 'PG',
      primaryArchetype: 'PLAYMAKER',
      secondaryArchetype: 'SHARPSHOOTER',
      heightInches: 75,
      weightLbs: 195,
      wingspanInches: 78,
      initialAttributes: hybrid.attributes,
      collegeTeamId: 'duke-blue-devils',
    });

    const p = useGameStore.getState().player!;
    expect(p.fullName).toBe('Gabriel Santos');
    expect(p.country.code).toBe('BRA');
    expect(p.primaryArchetype).toBe('PLAYMAKER');
    expect(p.secondaryArchetype).toBe('SHARPSHOOTER');

    // Concede fundos simulados de contrato para teste da loja
    p.bankBalance = 500000;
    const itemToBuy = CAREER_SHOP_ITEMS.find(i => i.id === 'gear-shoes-signature')!;
    const initial3pt = p.attributes.threePoint;

    state.buyShopItem(itemToBuy.id);

    const updatedP = useGameStore.getState().player!;
    expect(updatedP.bankBalance).toBe(500000 - itemToBuy.price);
    expect(updatedP.purchasedItemIds).toContain(itemToBuy.id);
    expect(updatedP.attributes.threePoint).toBe(initial3pt + (itemToBuy.attributeBonuses?.threePoint || 0));
  });
});
