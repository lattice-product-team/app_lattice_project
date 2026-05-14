'use client';

import React, { useActionState } from 'react';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-dvh bg-eggshell flex flex-col items-center justify-center px-6 py-12 relative overflow-x-hidden
      pt-[calc(3rem+env(safe-area-inset-top))] pb-[calc(3rem+env(safe-area-inset-bottom))]">
      <div className="w-full max-w-[440px] z-10">
        <div className="mb-12 sm:mb-16 text-center">
          <p className="text-gravel text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Lattice Studio
          </p>
          <h1 className="waldenburg-display text-[40px] sm:text-[56px] text-obsidian leading-[0.95]">
            Operations Center
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-chalk shadow-massive p-8 sm:p-12 relative flex flex-col items-center">
          {/* Internal corner accent */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-obsidian/10" />
          
          <div className="mb-8 sm:mb-10 text-center">
            <h2 className="text-admin-base sm:text-admin-lg font-bold text-obsidian mb-2 uppercase tracking-tight">Secure Access</h2>
            <p className="text-gravel text-admin-xs sm:text-admin-sm font-medium">
              Enter administrative credentials to synchronize.
            </p>
          </div>

          <form action={formAction} className="w-full space-y-6 sm:space-y-8 flex flex-col items-center">
            <div className="space-y-3 w-full flex flex-col items-start">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gravel text-left block w-full"
              >
                Operational Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@lattice.studio"
                className="w-full h-12"
              />
            </div>

            <div className="space-y-3 w-full flex flex-col items-start">
              <label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gravel text-left block w-full"
              >
                Security Key
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full h-12"
              />
            </div>

            {state?.error && (
              <div className="w-full p-4 bg-ember/5 border border-ember/20">
                <p className="text-ember text-[11px] font-black uppercase tracking-widest text-center">{state.error}</p>
              </div>
            )}

            <div className="pt-2 sm:pt-4 w-full">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-14 text-[11px] font-black uppercase tracking-[0.25em] shadow-subtle-2"
                disabled={isPending}
              >
                {isPending ? 'Verifying Signal…' : 'Authenticate'}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-[9px] text-gravel uppercase font-black tracking-[0.3em] opacity-30 leading-relaxed max-w-[280px] mx-auto">
            Architecting real-time event operations with restraint and precision.
          </p>
        </div>
      </div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"
        aria-hidden="true"
      />
    </div>
  );
}
