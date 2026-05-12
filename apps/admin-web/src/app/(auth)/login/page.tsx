'use client';

import React, { useActionState } from 'react';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-eggshell flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div
        className="absolute -top-48 -right-48 w-96 h-96 bg-powder rounded-full blur-3xl opacity-50"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-48 -left-48 w-96 h-96 bg-powder rounded-full blur-3xl opacity-50"
        aria-hidden="true"
      />

      <div className="w-full max-w-[440px] z-10">
        <div className="mb-12 text-center">
          <p className="text-gravel text-admin-xs font-bold uppercase tracking-[0.2em] mb-4">
            Lattice Studio
          </p>
          <h1 className="waldenburg-display text-[48px] text-obsidian leading-tight">
            Operations Center
          </h1>
        </div>

        <Card className="p-12 bg-white border border-chalk shadow-subtle-3">
          <div className="mb-8">
            <h2 className="text-admin-lg font-semibold text-obsidian mb-2">Secure Access</h2>
            <p className="text-gravel text-admin-base">
              Enter your administrative credentials to continue.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-admin-xs font-bold uppercase tracking-widest text-gravel"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@gmail.com"
                className="h-12 border-chalk focus:border-obsidian transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-admin-xs font-bold uppercase tracking-widest text-gravel"
              >
                Security Key
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="h-12 border-chalk focus:border-obsidian transition-colors"
              />
            </div>

            {state?.error && (
              <div className="p-4 bg-ember/5 border border-ember/20 rounded-lg">
                <p className="text-ember text-admin-xs font-medium text-center">{state.error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-admin-base font-bold uppercase tracking-widest mt-4"
              disabled={isPending}
            >
              {isPending ? 'Verifying Signal…' : 'Authenticate'}
            </Button>
          </form>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gravel uppercase font-black tracking-[0.25em] opacity-40 leading-relaxed">
            Architecting real-time event operations
            <br />
            with restraint and precision.
          </p>
        </div>
      </div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"
        aria-hidden="true"
      />
    </div>
  );
}
