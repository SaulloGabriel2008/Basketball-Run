import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CAREER_SHOP_ITEMS } from '../data/careerShop';
import { ShopCategory, ShopItem } from '../types';
import { 
  ShoppingBag, 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  Zap, 
  Dumbbell, 
  Car, 
  Building, 
  Plane, 
  Ship, 
  Utensils, 
  Cpu, 
  HeartHandshake, 
  Footprints, 
  Target, 
  Laptop
} from 'lucide-react';

const CATEGORY_NAMES: Record<ShopCategory, { label: string; icon: React.ReactNode }> = {
  GEAR_TRAINING: { label: 'Equipamentos & Treino', icon: <Dumbbell className="w-4 h-4" /> },
  LIFESTYLE_LUXURY: { label: 'Estilo de Vida & Mansões', icon: <Building className="w-4 h-4" /> },
  BUSINESS_INVESTMENT: { label: 'Negócios & Investimentos', icon: <TrendingUp className="w-4 h-4" /> },
};

function renderItemIcon(iconName: string) {
  switch (iconName) {
    case 'Footprints': return <Footprints className="w-6 h-6 text-amber-400" />;
    case 'Zap': return <Zap className="w-6 h-6 text-yellow-400" />;
    case 'Dumbbell': return <Dumbbell className="w-6 h-6 text-blue-400" />;
    case 'Target': return <Target className="w-6 h-6 text-rose-400" />;
    case 'Laptop': return <Laptop className="w-6 h-6 text-purple-400" />;
    case 'Car': return <Car className="w-6 h-6 text-rose-400" />;
    case 'Building': return <Building className="w-6 h-6 text-amber-400" />;
    case 'Ship': return <Ship className="w-6 h-6 text-cyan-400" />;
    case 'Plane': return <Plane className="w-6 h-6 text-emerald-400" />;
    case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-pink-400" />;
    case 'Utensils': return <Utensils className="w-6 h-6 text-amber-500" />;
    case 'Cpu': return <Cpu className="w-6 h-6 text-cyan-400" />;
    case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-emerald-400" />;
    default: return <ShoppingBag className="w-6 h-6 text-white" />;
  }
}

export const CareerShopScreen: React.FC = () => {
  const { player, buyShopItem } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('GEAR_TRAINING');

  if (!player) return null;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredItems = CAREER_SHOP_ITEMS.filter(i => i.category === activeCategory);

  // Calcula renda passiva anual acumulada
  const passiveIncomeTotal = CAREER_SHOP_ITEMS
    .filter(i => player.purchasedItemIds?.includes(i.id) && i.yearlyPassiveIncome)
    .reduce((acc, cur) => acc + (cur.yearlyPassiveIncome || 0), 0);

  const handleBuy = (item: ShopItem) => {
    if (player.bankBalance < item.price) {
      alert(`Saldo insuficiente! Você possui ${formatMoney(player.bankBalance)}, mas o item custa ${formatMoney(item.price)}.`);
      return;
    }
    buyShopItem(item.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Cabeçalho da Loja & Saldo Bancário */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#13171f] border border-[#2b3345] rounded-xl p-6 shadow-2xl">
        <div>
          <div className="text-xs font-mono text-[#8a96a8] uppercase flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-team-primary" />
            Loja Oficial de Luxo & Investimentos
          </div>
          <h1 className="text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide mt-1">
            Finanças & Estilo de Vida
          </h1>
          <p className="text-xs font-mono text-[#8a96a8] mt-1">
            Gaste seus ganhos de contrato em equipamentos de ponta, imóveis e negócios lucrativos.
          </p>
        </div>

        {/* Cartão de Saldo Bancário */}
        <div className="bg-[#0a0c0f] border-2 border-emerald-500/60 p-4 rounded-xl shadow-team-glow min-w-[240px]">
          <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8] flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            Saldo em Conta Corrente
          </div>
          <div className="text-3xl font-mono font-black text-emerald-400 mt-1">
            {formatMoney(player.bankBalance || 0)}
          </div>
          {passiveIncomeTotal > 0 && (
            <div className="text-[10px] font-mono text-emerald-300 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              + {formatMoney(passiveIncomeTotal)}/ano em dividendos
            </div>
          )}
        </div>
      </div>

      {/* Abas de Categorias */}
      <div className="flex items-center gap-2 border-b border-[#2b3345] pb-2 overflow-x-auto">
        {(Object.keys(CATEGORY_NAMES) as ShopCategory[]).map(catKey => {
          const isSelected = activeCategory === catKey;
          const conf = CATEGORY_NAMES[catKey];
          return (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider transition-all shrink-0 ${
                isSelected
                  ? 'bg-team-primary text-white shadow-team-glow'
                  : 'bg-[#13171f] text-[#8a96a8] hover:text-white border border-[#2b3345]'
              }`}
            >
              {conf.icon}
              {conf.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Itens da Loja */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwned = player.purchasedItemIds?.includes(item.id);
          const canAfford = player.bankBalance >= item.price;

          return (
            <div
              key={item.id}
              className={`bg-[#13171f] border rounded-xl p-5 shadow-xl flex flex-col justify-between transition-all ${
                isOwned
                  ? 'border-emerald-500/50 bg-[#13171f]/80'
                  : 'border-[#2b3345] hover:border-team-primary/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-[#0a0c0f] border border-[#2b3345]">
                    {renderItemIcon(item.iconName)}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-black text-emerald-400">
                      {formatMoney(item.price)}
                    </span>
                    <span className="block text-[10px] font-mono text-[#8a96a8]">Pagamento Único</span>
                  </div>
                </div>

                <h3 className="font-condensed font-bold uppercase tracking-wide text-base text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#8a96a8] leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Bônus do Item */}
                <div className="space-y-1 bg-[#0a0c0f] border border-[#1c222e] rounded-lg p-2.5 mb-4 text-xs font-mono">
                  {item.attributeBonuses && Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                    <div key={attr} className="text-emerald-400 font-bold flex items-center gap-1.5">
                      ✓ +{bonus} {attr}
                    </div>
                  ))}
                  {item.energyBonus && (
                    <div className="text-blue-400 font-bold">✓ +{item.energyBonus} Energia Máxima</div>
                  )}
                  {item.moralBonus && (
                    <div className="text-amber-400 font-bold">✓ +{item.moralBonus} Moral do Atleta</div>
                  )}
                  {item.injuryRiskReduction && (
                    <div className="text-emerald-400 font-bold">✓ -{item.injuryRiskReduction}% Risco de Lesão</div>
                  )}
                  {item.yearlyPassiveIncome && (
                    <div className="text-emerald-300 font-bold">✓ Rende {formatMoney(item.yearlyPassiveIncome)} a cada temporada!</div>
                  )}
                </div>
              </div>

              {/* Botão de Compra */}
              {isOwned ? (
                <div className="w-full py-2.5 px-3 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 font-condensed font-bold uppercase text-xs rounded-lg flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Item Adquirido
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 px-3 font-condensed font-black uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-team-primary text-white hover:opacity-90 shadow-team-glow'
                      : 'bg-[#1c222e] text-red-400 border border-red-900/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {canAfford ? 'Comprar Agora' : 'Saldo Insuficiente'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
