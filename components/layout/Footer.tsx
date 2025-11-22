import { Cat, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background py-8">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Cat className="h-5 w-5 text-primary" />
                    <span>CatFacts</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground md:items-end">
                    <p>
                        Powered by <a href="https://catfact.ninja" target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Cat Fact Ninja</a>
                    </p>
                    <p className="flex items-center gap-1">
                        Designed & Developed with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by <span className="font-medium text-foreground">Arn Laurence Playda</span> & <span className="font-medium text-foreground">Carl Efren</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
