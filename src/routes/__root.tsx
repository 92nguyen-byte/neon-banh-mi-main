import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo.png.asset.json";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-display neon-green-text">404</h1>
        <h2 className="mt-4 text-xl font-display tracking-widest uppercase">Sidan kunde inte hittas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Den här rätten finns inte på menyn.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md px-5 py-2.5 font-display tracking-widest uppercase neon-box-green hover:neon-green-text transition-all">
            Tillbaka hem
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display tracking-widest uppercase neon-red-text">
          Något gick fel
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Försök igen eller gå tillbaka till startsidan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="px-5 py-2.5 rounded-md font-display tracking-widest uppercase neon-box-green hover:neon-green-text transition-all"
          >
            Försök igen
          </button>
          <a href="/" className="px-5 py-2.5 rounded-md font-display tracking-widest uppercase border border-border hover:neon-gold-text">
            Hem
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bamboo House · Vietnamesiska & Koreanska Ratter i Uddevalla" },
      { name: "description", content: "Banh Mi, Korean Fried Chicken, Pho & mer. Street food från Vietnam och Korea, mitt i Uddevalla." },
      { name: "author", content: "Bamboo House" },
      { property: "og:title", content: "Bamboo House · Vietnamesiska & Koreanska Ratter i Uddevalla" },
      { property: "og:description", content: "Banh Mi, Korean Fried Chicken, Pho & mer. Street food från Vietnam och Korea, mitt i Uddevalla." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bamboo House · Vietnamesiska & Koreanska Ratter i Uddevalla" },
      { name: "twitter:description", content: "Banh Mi, Korean Fried Chicken, Pho & mer. Street food från Vietnam och Korea, mitt i Uddevalla." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/68647e63-8f40-4ce0-b967-29a706be2f66/id-preview-0faa252e--e2d79e16-49a5-46f9-8140-6724f68a532f.lovable.app-1782338353290.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/68647e63-8f40-4ce0-b967-29a706be2f66/id-preview-0faa252e--e2d79e16-49a5-46f9-8140-6724f68a532f.lovable.app-1782338353290.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat+Brush&family=Manrope:wght@400;500;600;700&display=swap" },
      // LCP: the hero logo is the largest paint on /. Preloading lets it
      // start downloading before the React bundle parses the <img>.
      { rel: "preload", as: "image", href: logo.url, fetchPriority: "high" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
