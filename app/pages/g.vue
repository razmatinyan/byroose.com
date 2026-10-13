<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";

definePageMeta({ layout: false });

const errorMessages: Record<string, string> = {
   failed: "Google sign in did not complete. Please try again.",
   unauthorized: "This Google account does not have access.",
};

const route = useRoute();
const { loggedIn, user, clear } = useUserSession();

const errorMessage = computed(() => {
   const code = route.query.error;
   return typeof code === "string" ? errorMessages[code] : undefined;
});

useSeoMeta({
   robots: "noindex, nofollow",
   title: "Sign in | byroose",
});

async function signOut() {
   await clear();
}
</script>

<template>
   <main class="sign-in">
      <section class="sign-in-panel" aria-labelledby="sign-in-title">
         <div class="sign-in-content">
            <span class="sign-in-logo" aria-hidden="true" />
            <h1 id="sign-in-title" class="sign-in-title">Back to the studio</h1>
            <p class="sign-in-lead">Sign in to publish and manage byroose work.</p>

            <div class="sign-in-card">
               <template v-if="loggedIn && user">
                  <p class="sign-in-account">
                     <span class="sign-in-note">Signed in as</span>
                     <span class="font-semibold">{{ user.email }}</span>
                  </p>
                  <Button as-child variant="light" size="lg" class="sign-in-action">
                     <NuxtLink to="/work/new" external>New project</NuxtLink>
                  </Button>
                  <Button variant="inverse" size="lg" class="sign-in-action" @click="signOut">
                     Sign out
                  </Button>
               </template>

               <template v-else>
                  <p v-if="errorMessage" role="alert" class="sign-in-alert">
                     {{ errorMessage }}
                  </p>
                  <Button as="a" href="/auth/google" variant="light" size="lg" class="sign-in-action">
                     <NuxtImg
                        src="/icons/google.svg"
                        provider="none"
                        alt=""
                        width="18"
                        height="18"
                        class="size-4.5"
                     />
                     Continue with Google
                  </Button>
                  <p class="sign-in-note">Access is limited to the byroose team.</p>
               </template>
            </div>
         </div>
      </section>

      <figure class="sign-in-media">
         <NuxtImg
            src="/images/work/3.png"
            alt=""
            width="1080"
            height="1620"
            sizes="sm:768px 2xl:1024px"
            densities="x1"
            loading="eager"
            class="sign-in-image"
         />
      </figure>
   </main>
</template>

<style scoped>
@reference "../assets/css/tailwind.css";

.sign-in {
   @apply grid min-h-svh gap-3 bg-foreground p-3 text-background sm:gap-4 sm:p-4 lg:grid-cols-2 lg:gap-6 lg:p-6;
}

.sign-in-panel {
   @apply flex items-center justify-center px-3 py-12 lg:py-16;
}

.sign-in-content {
   @apply flex w-full max-w-md flex-col items-center text-center;
}

.sign-in-logo {
   @apply mb-12 block aspect-[680/192] h-7 bg-background sm:h-8;
   mask: url("/logo.svg") center / contain no-repeat;
}

.sign-in-title {
   @apply text-5xl leading-none font-bold tracking-[-0.05em] text-balance sm:text-6xl;
}

.sign-in-lead {
   @apply mt-4 text-lg font-medium text-background/70;
}

.sign-in-card {
   @apply mt-10 flex w-full flex-col gap-3 rounded-2xl border border-background/15 bg-background/5 p-5 sm:p-6;
}

.sign-in-action {
   @apply h-12 w-full text-base;
}

.sign-in-account {
   @apply mb-2 flex flex-col gap-1 break-all;
}

.sign-in-note {
   @apply text-sm text-background/60;
}

.sign-in-alert {
   @apply rounded-lg border border-destructive/60 bg-destructive/15 px-4 py-3 text-sm text-background;
}

.sign-in-media {
   @apply relative order-first h-56 overflow-hidden rounded-2xl sm:h-72 lg:order-last lg:h-auto;
}

.sign-in-image {
   @apply absolute inset-0 size-full object-cover object-[center_55%];
}
</style>
