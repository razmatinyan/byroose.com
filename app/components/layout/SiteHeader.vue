<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import type { CSSProperties } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { NuxtLink } from "#components";
import SiteMenu from "@/components/layout/SiteMenu.vue";
import SiteNavLink from "@/components/layout/SiteNavLink.vue";
import SiteNavServices from "@/components/layout/SiteNavServices.vue";
import { Button, ButtonIcon } from "@/components/ui/button";

defineOptions({ inheritAttrs: false });

interface NavItem {
   href: string;
   label: string;
}

const servicesHref = "/services";

const defaultNavItems: NavItem[] = [
   { href: "/", label: "Home" },
   { href: "/work", label: "Work" },
   { href: servicesHref, label: "Services" },
   { href: "/about", label: "About" },
   // { href: '/courses', label: 'Courses' },
   { href: "/blog", label: "Blog" },
   { href: "/contact", label: "Contact" },
];

const {
   ctaHref = "/contact",
   ctaLabel = "Start a project",
   navItems,
} = defineProps<{
   ctaHref?: string;
   ctaLabel?: string;
   navItems?: NavItem[];
}>();

const resolvedNavItems = computed(() => navItems ?? defaultNavItems);
const menuOpen = shallowRef(false);
const headerCtaVariant = computed(() => (menuOpen.value ? "default" : "dark"));
const isDesktop = useMediaQuery("(min-width: 64rem)");
const { headerRoot, logoLayer, navRevealed } = useSiteHeaderMotion();
const headerActions = useTemplateRef<HTMLElement>("headerActions");
const { onDarkSurface } = useHeaderSurface(headerRoot, headerActions);
const { onDarkSurface: logoOnDarkSurface } = useHeaderSurface(logoLayer, logoLayer);
const footerRevealProgress = useFooterRevealProgress();
const footerFadeStyle = computed<CSSProperties | undefined>(() => {
   const progress = footerRevealProgress.value;
   if (!progress || menuOpen.value) return undefined;

   return {
      opacity: 1 - progress,
      visibility: progress >= 1 ? "hidden" : undefined,
   };
});

function setMenuOpen(open: boolean) {
   menuOpen.value = open;
}

function closeMenu() {
   setMenuOpen(false);
}

function handleLogoClick() {
   closeMenu();
}

watch(isDesktop, (desktop) => {
   if (desktop) closeMenu();
});
</script>

<template>
   <div
      ref="navLayer"
      class="site-nav-layer"
      v-bind="$attrs"
      :style="footerFadeStyle"
   >
      <nav
         id="primary-navigation"
         class="site-nav"
         aria-label="Main navigation"
         :data-nav-revealed="navRevealed || undefined"
      >
         <span
            v-for="item in resolvedNavItems"
            :key="item.href"
            class="site-nav-item"
         >
            <SiteNavServices
               v-if="item.href === servicesHref"
               :href="item.href"
               :label="item.label"
               data-home-intro-nav-item
            />
            <SiteNavLink
               v-else
               :href="item.href"
               :label="item.label"
               data-home-intro-nav-item
            />
         </span>
      </nav>
   </div>

   <header
      ref="headerRoot"
      class="site-header"
      v-bind="$attrs"
      :data-header-revealed="navRevealed || undefined"
   >
      <div class="site-header-inner">
         <div
            ref="headerActions"
            class="site-header-actions"
            :style="footerFadeStyle"
         >
            <span class="site-header-cta-wrap">
               <span class="site-header-rise-mask" data-header-rise-mask>
                  <span class="site-header-rise" data-header-rise>
                     <Button
                        class="site-header-cta"
                        :as="NuxtLink"
                        :to="ctaHref"
                        size="cta-sm"
                        :variant="headerCtaVariant"
                        :data-bordered="onDarkSurface || undefined"
                     >
                        {{ ctaLabel }}
                        <template #icon>
                           <ButtonIcon size="sm" />
                        </template>
                     </Button>
                  </span>
               </span>
            </span>

            <span class="site-menu-button-wrap">
               <span class="site-header-rise-mask" data-header-rise-mask>
                  <span class="site-header-rise" data-header-rise>
                     <SiteMenu
                        :nav-items="resolvedNavItems"
                        :open="menuOpen"
                        :bordered="onDarkSurface"
                        @update:open="setMenuOpen"
                     />
                  </span>
               </span>
            </span>
         </div>
      </div>
   </header>

   <div
      ref="logoLayer"
      class="site-logo-layer"
      v-bind="$attrs"
      :style="footerFadeStyle"
      :data-header-revealed="navRevealed || undefined"
      :data-on-dark="logoOnDarkSurface || undefined"
   >
      <span class="site-header-rise-mask" data-header-rise-mask>
         <NuxtLink
            class="site-logo-link"
            to="/"
            aria-label="forrrow home"
            data-header-rise
            @click="handleLogoClick"
         >
            <span class="site-logo" aria-hidden="true" />
         </NuxtLink>
      </span>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-header {
   @apply pointer-events-none sticky top-0 z-60 isolate;
}

.site-header-inner {
   @apply relative z-10 grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-page py-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6;
}

.site-logo-layer {
   @apply fixed top-0 left-0 z-60 flex h-11 box-content items-center px-page py-4 mix-blend-difference;
}

.site-logo-link {
   @apply flex shrink-0 items-center;
}

.site-logo {
   @apply block aspect-[767/146] h-[1.3rem] sm:h-[1.55rem];
   --site-logo-mark-ink: var(--color-primary-difference);
   background: linear-gradient(
      to right,
      var(--site-logo-mark-ink) calc(146.5 / 767 * 100%),
      var(--color-background) calc(146.5 / 767 * 100%)
   );
   mask: url("/logo.svg") center / contain no-repeat;
}

.site-logo-layer[data-on-dark] .site-logo {
   --site-logo-mark-ink: var(--color-primary);
}

.site-nav-layer {
   @apply pointer-events-none fixed inset-x-0 top-0 z-60 hidden h-11 box-content items-center justify-center px-page py-4 mix-blend-difference lg:flex;
}

.site-nav {
   @apply pointer-events-auto flex items-center gap-6 xl:gap-8;
}

.site-nav :deep(.site-nav-link) {
   @apply text-background;
}

.site-nav :deep(.site-nav-link-label-copy) {
   @apply text-primary-difference;
}

.site-nav-item {
   @apply inline-flex overflow-hidden;
   margin: -0.25em;
   padding: 0.25em;
}

.site-nav:not([data-nav-revealed]) :deep([data-home-intro-nav-item]) {
   visibility: hidden;
}

.site-header-rise-mask,
.site-header-rise {
   @apply inline-flex;
}

.site-header:not([data-header-revealed]) [data-header-rise],
.site-logo-layer:not([data-header-revealed]) [data-header-rise] {
   visibility: hidden;
}

.site-header-actions {
   @apply pointer-events-auto relative col-start-2 row-start-1 flex items-center justify-self-end gap-2 lg:col-start-3;
}

.site-header-cta-wrap,
.site-menu-button-wrap {
   @apply inline-flex shrink-0;
   will-change: transform, opacity;
}

.site-header-cta-wrap {
   @apply relative z-30;
}

.site-header-cta {
   transition-duration: 440ms;
   transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.site-header-cta::after {
   @apply pointer-events-none absolute inset-0 border border-background/20 opacity-0 transition-opacity duration-300;
   content: "";
   border-radius: inherit;
}

.site-header-cta[data-bordered]::after {
   @apply opacity-100;
}

.site-menu-button-wrap {
   @apply relative z-20 lg:hidden;
}

@media (prefers-reduced-motion: reduce) {
   .site-header-cta,
   .site-header-cta::after {
      transition-duration: 0ms;
   }

   .site-nav:not([data-nav-revealed]) :deep([data-home-intro-nav-item]),
   .site-header:not([data-header-revealed]) [data-header-rise],
   .site-logo-layer:not([data-header-revealed]) [data-header-rise] {
      visibility: inherit;
   }
}
</style>
