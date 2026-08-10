'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ShoppingCart, Check, RefreshCw, ChevronRight, X, Utensils } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PantryItem {
  id: string;
  name: string;
  category: 'Beverage' | 'Snacks' | 'Meal' | 'Dessert';
  price: number;
  rating: number;
  icon: string;
  desc: string;
}

const PANTRY_ITEMS: PantryItem[] = [
  { id: '1', name: 'Premium Masala Chai', category: 'Beverage', price: 20, rating: 4.8, icon: '☕', desc: 'Brewed ginger & cardamom milk tea served hot.' },
  { id: '2', name: 'Railway Veg Cutlet (2 Pcs)', category: 'Snacks', price: 50, rating: 4.5, icon: '🥔', desc: 'Classic spiced potato and vegetable patties with breadcrumbs.' },
  { id: '3', name: 'Tomato Soup with Croutons', category: 'Beverage', price: 40, rating: 4.2, icon: '🍲', desc: 'Warm tangy tomato soup served with crispy buttered croutons.' },
  { id: '4', name: 'Pantry Veg Biryani', category: 'Meal', price: 120, rating: 4.6, icon: '🍚', desc: 'Fragrant basmati rice cooked with garden veggies, served with raita.' },
  { id: '5', name: 'Deluxe North Indian Thali', category: 'Meal', price: 180, rating: 4.7, icon: '🍱', desc: 'Paneer butter masala, dal fry, mix veg, 2 rotis, rice, and sweet.' },
  { id: '6', name: 'Warm Gulab Jamun (2 Pcs)', category: 'Dessert', price: 50, rating: 4.9, icon: '🍩', desc: 'Soft cottage cheese dumplings soaked in sugar syrup.' },
];

export function PantryMenu() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [coachNumber, setCoachNumber] = useState('B2');
  const [seatNumber, setSeatNumber] = useState('32');
  const [orderStep, setOrderStep] = useState<'idle' | 'received' | 'cooking' | 'transit' | 'delivered'>('idle');

  // Add to cart
  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // Remove / Decrement
  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });
  };

  // Calculate cart stats
  const cartStats = React.useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;
    const items = Object.entries(cart).map(([id, qty]) => {
      const pItem = PANTRY_ITEMS.find((it) => it.id === id)!;
      totalItems += qty;
      totalPrice += pItem.price * qty;
      return { item: pItem, qty };
    });
    return { items, totalItems, totalPrice };
  }, [cart]);

  // Place order loop simulation
  const handlePlaceOrder = () => {
    if (cartStats.totalItems === 0) return;
    setOrderStep('received');

    // Simulate cooking after 2.5 seconds
    setTimeout(() => {
      setOrderStep('cooking');
      // Simulate transit after 5 seconds
      setTimeout(() => {
        setOrderStep('transit');
        // Simulate delivery after 8 seconds
        setTimeout(() => {
          setOrderStep('delivered');
        }, 3000);
      }, 3000);
    }, 2500);
  };

  const resetOrder = () => {
    setCart({});
    setOrderStep('idle');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="h-5 w-5 text-rail-blue animate-pulse" />
            Pantry Car Seat Service
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Order fresh meals and beverages delivered directly to your seat.
          </p>
        </div>

        {/* Cart size badge */}
        {cartStats.totalItems > 0 && orderStep === 'idle' && (
          <span className="rounded-full bg-rail-blue/10 px-2.5 py-1 text-xs font-bold text-rail-blue flex items-center gap-1.5 animate-pulse">
            <ShoppingCart className="h-3.5 w-3.5" />
            {cartStats.totalItems} items
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {orderStep === 'idle' ? (
          <motion.div
            key="menu-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Menu Items Catalog (Left) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Menu Catalog</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PANTRY_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel rounded-2xl p-4 flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-rail-blue/30 transition-all group"
                  >
                    <div className="flex gap-3">
                      <span className="text-3xl flex-shrink-0 select-none group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.name}</h5>
                          <span className={cn(
                            "rounded px-1 py-0.5 text-[8px] font-bold",
                            item.category === 'Meal' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          )}>
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{item.desc}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{item.price}
                      </span>

                      {cart[item.id] ? (
                        <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 font-bold flex items-center justify-center rounded-lg hover:bg-slate-350 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-350"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs px-1">{cart[item.id]}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="h-6 w-6 font-bold flex items-center justify-center rounded-lg hover:bg-slate-350 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-350"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="rounded-xl bg-rail-blue px-3 py-1.5 text-xs font-bold text-white shadow-glow hover:bg-sky-600 transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Panel & Seat Delivery Options (Right) */}
            <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/20 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Checkout Cart</h4>

              {cartStats.totalItems === 0 ? (
                <div className="py-12 text-center text-xs text-slate-450 dark:text-slate-500 space-y-2">
                  <Coffee className="h-8 w-8 mx-auto text-slate-350" />
                  <p>Your cart is empty. Choose beverages or warm meals from the menu.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items list */}
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {cartStats.items.map(({ item, qty }) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white truncate block">{item.name}</span>
                          <span className="text-[10px] text-slate-500">₹{item.price} × {qty}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-950 dark:text-slate-200">
                          ₹{item.price * qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Seat Form inputs */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-450 uppercase">Coach Number</label>
                      <input
                        type="text"
                        value={coachNumber}
                        onChange={(e) => setCoachNumber(e.target.value)}
                        placeholder="e.g. B2"
                        className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-2 text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-450 uppercase">Seat / Berth</label>
                      <input
                        type="text"
                        value={seatNumber}
                        onChange={(e) => setSeatNumber(e.target.value)}
                        placeholder="e.g. 32"
                        className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-2 text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline text-sm font-bold">
                    <span className="text-slate-650 dark:text-slate-400">Total Price:</span>
                    <span className="font-mono text-base text-rail-blue">₹{cartStats.totalPrice}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rail-blue py-3 text-xs font-bold text-white shadow-glow hover:bg-sky-600"
                  >
                    <span>Place Order to Seat {coachNumber}-{seatNumber}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Order Status Delivery Tracker (Simulation) */
          <motion.div
            key="order-tracker"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel border border-slate-200 dark:border-slate-800 bg-slate-50/20 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6"
          >
            <div>
              <span className="rounded-full bg-rail-blue/10 border border-rail-blue/30 px-3 py-1 font-mono text-[10px] font-bold text-rail-blue">
                ORDER DELIVERY SIMULATOR
              </span>
              <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Tracking Seat Delivery: {coachNumber} Seat #{seatNumber}
              </h4>
            </div>

            {/* Delivery Progress Bar */}
            <div className="relative flex items-center justify-between max-w-md mx-auto py-8">
              {/* Connector lines */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10">
                <motion.div
                  className="h-full bg-rail-blue"
                  initial={{ width: '0%' }}
                  animate={{
                    width:
                      orderStep === 'received'
                        ? '0%'
                        : orderStep === 'cooking'
                        ? '33%'
                        : orderStep === 'transit'
                        ? '66%'
                        : '100%',
                  }}
                  transition={{ duration: 1.5 }}
                />
              </div>

              {/* Steps indicators */}
              {[
                { key: 'received', label: 'Received', emoji: '📝' },
                { key: 'cooking', label: 'Cooking', emoji: '🍳' },
                { key: 'transit', label: 'In Transit', emoji: '🚶‍♂️' },
                { key: 'delivered', label: 'Delivered', emoji: '🍱' },
              ].map((step, idx) => {
                const stepsOrder = ['received', 'cooking', 'transit', 'delivered'];
                const stepIdx = stepsOrder.indexOf(step.key);
                const currentIdx = stepsOrder.indexOf(orderStep);
                const isPassed = stepIdx < currentIdx;
                const isActive = step.key === orderStep;

                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 relative">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={cn(
                        "h-12 w-12 rounded-full border-2 flex items-center justify-center text-lg bg-background",
                        isPassed
                          ? "border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/10"
                          : isActive
                          ? "border-rail-blue text-rail-blue ring-4 ring-rail-blue/15"
                          : "border-slate-200 dark:border-slate-800 text-slate-400"
                      )}
                    >
                      {isPassed ? <Check className="h-5 w-5 stroke-[3px]" /> : step.emoji}
                    </motion.div>
                    <span className={cn(
                      "text-[10px] font-bold",
                      isActive ? 'text-rail-blue' : isPassed ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Feedback */}
            <div className="space-y-4">
              {orderStep === 'received' && (
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  Order sent to kitchen... Attendants are acknowledging seat {coachNumber}-{seatNumber}.
                </p>
              )}
              {orderStep === 'cooking' && (
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  Chef in the Pantry Car is cooking your meals fresh. Almost ready...
                </p>
              )}
              {orderStep === 'transit' && (
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  Delivery executive is bringing the order from the pantry car to Coach {coachNumber}.
                </p>
              )}
              {orderStep === 'delivered' && (
                <div className="space-y-3">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    🎉 Delivered! Enjoy your warm meal at seat {coachNumber}-{seatNumber}.
                  </p>
                  <button
                    onClick={resetOrder}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Order Again</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
