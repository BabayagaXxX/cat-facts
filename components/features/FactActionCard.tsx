import { useState } from "react";
import { CatFact } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface FactActionCardProps {
    fact: CatFact;
}

export function FactActionCard({ fact }: FactActionCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(fact.fact);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="mb-4 min-h-[100px] text-lg font-medium leading-relaxed text-foreground">
                    <p>{fact.fact}</p>
                </div>

                <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
