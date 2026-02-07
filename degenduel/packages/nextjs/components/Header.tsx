"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { Logo } from "~~/components/degenduel/Logo";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Duels",
    href: "/",
  },
  {
    label: "Create",
    href: "/create",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
  },
  {
    label: "Debug",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? "text-[#8B5CF6] bg-[rgba(139,92,246,0.1)]"
                  : "text-slate-400 hover:text-slate-200"
              } hover:bg-[rgba(139,92,246,0.08)] py-2 px-3 text-sm rounded-lg gap-2 grid grid-flow-col font-medium transition-all`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header - DegenDuel cyberpunk arena style
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 shrink-0 justify-between z-20 px-0 sm:px-2 bg-[rgba(8,11,22,0.8)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.06)] shadow-[0_4px_30px_rgba(139,92,246,0.08)]">
      <div className="navbar-start w-auto lg:w-1/2">
        {/* Mobile menu */}
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent">
            <Bars3Icon className="h-6 w-6 text-slate-400" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 card-glass-dense rounded-xl w-52"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>

        {/* Logo + Brand */}
        <Link href="/" passHref className="hidden lg:flex items-center gap-3 ml-4 mr-6 shrink-0 group">
          <Logo size={36} />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight text-gradient">DegenDuel</span>
            <span className="text-[10px] text-slate-500 tracking-wider uppercase">PvP Predictions on Flare</span>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-1">
          <HeaderMenuLinks />
        </ul>
      </div>

      <div className="navbar-end grow mr-4 gap-2">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
