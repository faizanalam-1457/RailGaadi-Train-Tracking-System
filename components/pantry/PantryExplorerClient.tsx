'use client';

import React, { useState } from 'react';
import { Utensils, ShoppingBag, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';

interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'snacks' | 'beverage';
  price: number;
  rating: number;
  station: string;
  isVeg: boolean;
  imageEmoji: string;
  desc: string;
}

const PANTRY_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Hyderabadi Dum Biryani Thali',
    category: 'lunch',
    price: 180,
    rating: 4.8,
    station: 'Secunderabad (SC) / Kota (KOTA)',
    isVeg: false,
    imageEmoji: '🍲',
    desc: 'Slow-cooked aromatic basmati rice with spiced chicken, mirchi ka salan & raita delivered fresh to berth.',
  },
  {
    id: 'f2',
    name: 'North Indian Deluxe Thali',
    category: 'lunch',
    price: 150,
    rating: 4.6,
    station: 'New Delhi (NDLS) / Agra (AGC)',
    isVeg: true,
    imageEmoji: '🍱',
    desc: 'Paneer butter masala, dal makhani, jeera rice, 3 butter rotis, gulab jamun & salad.',
  },
  {
    id: 'f3',
    name: 'South Indian Masala Dosa Combo',
    category: 'breakfast',
    price: 90,
    rating: 4.7,
    station: 'Chennai Central (MAS) / Vijayawada (BZA)',
    isVeg: true,
    imageEmoji: '🥞',
    desc: 'Crispy rice crepe filled with potato masala, served with coconut chutney & hot sambar.',
  },
  {
    id: 'f4',
    name: 'Surat Special Locho & Khaman',
    category: 'snacks',
    price: 70,
    rating: 4.9,
    station: 'Surat (ST) / Vadodara (BRC)',
    isVeg: true,
    imageEmoji: '🧈',
    desc: 'Famous Gujarati steamed gram flour locho garnished with butter, sev, cilantro & green chutney.',
  },
  {
    id: 'f5',
    name: 'Kulhad Masala Chai & Samosa (2 pcs)',
    category: 'beverage',
    price: 50,
    rating: 4.9,
    station: 'Kanpur Central (CNB) / Varanasi (BSB)',
    isVeg: true,
    imageEmoji: '☕',
    desc: 'Steaming ginger cardamom tea in traditional clay kulhad paired with crispy potato samosas.',
  },
  {
    id: 'f6',
    name: 'Rajdhani Evening Snacks Box',
    category: 'snacks',
    price: 110,
    rating: 4.5,
    station: 'All IRCTC Express Pantry Cars',
    isVeg: true,
    imageEmoji: '🥪',
    desc: 'Vegetable sandwich, roasted cashews, salted sticks, juice box & chocolate.',
  },
];

export function PantryExplorerClient() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filtered = PANTRY_ITEMS.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const addToCart = (item: FoodItem) => {
    setCart((prev) => [...prev, item]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSimulateOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      setCart([]);
    }, 2500);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-glass space-y-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue">
            <Utensils className="h-3.5 w-3.5" />
            <span>IRCTC E-Catering & Berth Delivery Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Pantry & Station Meal Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Order regional delicacies directly delivered to your train seat/berth at upcoming station halts.
          </p>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="relative flex items-center gap-2 rounded-2xl bg-rail-blue px-4 py-3 text-xs font-bold text-white shadow-glow hover:bg-sky-600 transition-all flex-shrink-0"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Berth Cart ({cart.length})</span>
          {totalPrice > 0 && <span className="font-mono bg-white/20 px-2 py-0.5 rounded">₹{totalPrice}</span>}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'lunch', 'breakfast', 'snacks', 'beverage'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-rail-blue text-white shadow-glow'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-rail-blue/30 transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{item.imageEmoji}</div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                    item.isVeg
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  }`}
                >
                  {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <MapPin className="h-3.5 w-3.5 text-rail-blue" />
                <span>Station: {item.station}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="font-mono text-base font-black text-slate-900 dark:text-white">
                ₹{item.price}
                <span className="text-[10px] text-slate-400 font-sans ml-1">★ {item.rating}</span>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-rail-blue hover:text-white dark:hover:bg-rail-blue dark:hover:text-white px-3 py-1.5 text-xs font-bold transition-all"
              >
                + Add to Berth
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Cart Modal Dialog */}
      <Dialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Berth Meal Delivery Checkout"
        description="Simulated IRCTC e-Catering order delivered directly to your train coach seat."
      >
        {orderSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Order Confirmed for Next Halt!</h3>
            <p className="text-xs text-slate-500">Your meal will be delivered directly to your berth when the train halts at station.</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <p>Your berth cart is currently empty.</p>
            <p className="text-[10px] text-slate-400">Add food items from the menu above to simulate e-catering delivery.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs">
                  <span>{item.imageEmoji} {item.name}</span>
                  <span className="font-mono font-bold">₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t font-bold text-sm">
              <span>Total Payable</span>
              <span className="font-mono text-base text-rail-blue">₹{totalPrice}</span>
            </div>

            <button
              onClick={handleSimulateOrder}
              className="w-full rounded-xl bg-rail-blue py-2.5 text-xs font-bold text-white shadow-glow hover:bg-sky-600 transition-colors"
            >
              Confirm Berth Delivery Simulation →
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
