<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import type { CSSProperties } from "vue";
import { useMediaQuery } from "@vueuse/core";
import SiteMenu from "@/components/layout/SiteMenu.vue";
import SiteNavLink from "@/components/layout/SiteNavLink.vue";
import { Button, ButtonIcon } from "@/components/ui/button";

defineOptions({ inheritAttrs: false });

interface NavItem {
   href: string;
   label: string;
}

const defaultNavItems: NavItem[] = [
   { href: "/", label: "Home" },
   { href: "/works", label: "Works" },
   { href: "/services", label: "Services" },
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
const route = useRoute();
const { scrollTo } = useSmoothScroll();
const { headerMode, headerRoot, navRevealed } = useSiteHeaderMotion();
const headerActions = useTemplateRef<HTMLElement>("headerActions");
const { onDarkSurface } = useHeaderSurface(headerRoot, headerActions);
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

function handleLogoClick(event: MouseEvent) {
   closeMenu();

   if (route.path !== "/") return;
   if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
   }

   scrollTo(0);
}

watch([headerMode, isDesktop], ([mode, desktop]) => {
   if (mode === "full" && desktop) closeMenu();
});
</script>

<template>
   <header
      ref="headerRoot"
      class="site-header"
      v-bind="$attrs"
      :data-header-mode="headerMode"
      :data-header-revealed="navRevealed || undefined"
   >
      <div class="site-header-inner">
         <nav
            id="primary-navigation"
            ref="primaryNavigation"
            class="site-nav"
            aria-label="Main navigation"
            :data-nav-revealed="navRevealed || undefined"
         >
            <span
               v-for="item in resolvedNavItems"
               :key="item.href"
               class="site-nav-item"
            >
               <SiteNavLink
                  :href="item.href"
                  :label="item.label"
                  data-home-intro-nav-item
               />
            </span>
         </nav>

         <div
            ref="headerActions"
            class="site-header-actions"
            :style="footerFadeStyle"
         >
            <span ref="headerCta" class="site-header-cta-wrap">
               <span class="site-header-rise-mask" data-header-rise-mask>
                  <span class="site-header-rise" data-header-rise>
                     <Button
                        class="site-header-cta"
                        as="a"
                        :href="ctaHref"
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

            <span ref="menuButton" class="site-menu-button-wrap">
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
   >
      <span class="site-header-rise-mask" data-header-rise-mask>
         <NuxtLink
            class="site-logo-link"
            to="/"
            aria-label="byroose home"
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
   @apply sticky top-0 z-60 isolate;
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
   @apply block aspect-[680/192] h-7 bg-background sm:h-8.5;
   mask: url("/logo.svg") center / contain no-repeat;
}

.site-nav {
   @apply hidden items-center gap-6 lg:col-start-2 lg:row-start-1 lg:flex xl:gap-8;
   will-change: transform, opacity;
}

.site-nav-item {
   @apply inline-flex overflow-hidden;
   margin: -0.25em;
   padding: 0.25em;
}

.site-nav:not([data-nav-revealed]) [data-home-intro-nav-item] {
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
   @apply relative col-start-2 row-start-1 flex items-center justify-self-end gap-2 lg:col-start-3;
}

.site-header-cta-wrap,
.site-menu-button-wrap {
   @apply inline-flex shrink-0;
   will-change: transform, opacity;
}

.site-header-cta-wrap {
   @apply relative z-30 lg:translate-x-28;
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
   @apply relative z-20 lg:pointer-events-none lg:invisible;
}

@media (prefers-reduced-motion: reduce) {
   .site-header-cta,
   .site-header-cta::after {
      transition-duration: 0ms;
   }

   .site-nav:not([data-nav-revealed]) [data-home-intro-nav-item],
   .site-header:not([data-header-revealed]) [data-header-rise],
   .site-logo-layer:not([data-header-revealed]) [data-header-rise] {
      visibility: inherit;
   }
}
</style>
