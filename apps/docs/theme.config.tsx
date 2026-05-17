import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-2 font-bold text-xl">
      <img
        src="/icon.png"
        height="32"
        width="32"
        style={{ borderRadius: '6px' }}
        alt="Lattice Logo"
      />
      <span>Lattice</span>
    </div>
  ),
  project: {
    link: 'https://github.com/cdc-grup/app_lattice_project',
  },
  docsRepositoryBase:
    'https://github.com/cdc-grup/app_lattice_project/tree/main/apps/docs',
  footer: {
    content: (
      <span>
        {new Date().getFullYear()} ©{' '}
        <a
          href="https://github.com/cdc-grup"
          target="_blank"
          className="hover:underline"
        >
          CDC Grup
        </a>
        .
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="App Lattice Documentation" />
      <meta
        property="og:description"
        content="Documentation for the App Lattice project"
      />
    </>
  ),
};

export default config;
