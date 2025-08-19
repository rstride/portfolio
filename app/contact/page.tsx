import { site } from "@/content/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata = { title: site.sections.contactTitle };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{site.sections.contactTitle}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Vous préférez échanger de vive voix ?
        <a href={site.about.scheduleHref} className="ml-1 underline underline-offset-4 decoration-border hover:decoration-foreground">Réserver un call</a>
        <span className="mx-1">ou par email :</span>
        <a href={`mailto:${site.about.email}`} className="underline underline-offset-4 decoration-border hover:decoration-foreground">{site.about.email}</a>
      </p>
      <Card className="mt-8 glass max-w-xl">
        <CardHeader>
          <CardTitle>Me contacter</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/contact" method="POST" className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm">Nom</label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm">Email</label>
              <Input id="email" type="email" name="email" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm">Message</label>
              <Textarea id="message" name="message" required />
            </div>
            <Button type="submit">Envoyer</Button>
            <p className="text-xs text-muted-foreground">En envoyant ce formulaire, vous acceptez notre
              <a className="ml-1 underline underline-offset-4" href="/legal/privacy">politique de confidentialité</a>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

