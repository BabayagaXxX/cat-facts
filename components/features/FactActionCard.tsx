import { useState } from "react";
import { CatFact } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, FileText, MessageCircle, Zap, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FactActionCardProps {
    fact: CatFact;
}

export function FactActionCard({ fact }: FactActionCardProps) {
    const [mode, setMode] = useState<'original' | 'joke' | 'summary' | 'dramatic'>('original');
    const [copied, setCopied] = useState(false);

    const getDisplayContent = () => {
        switch (mode) {
            case 'joke':
                return `Why did the cat? Because ${fact.fact.toLowerCase()}`;
            case 'summary':
                return `TL;DR: ${fact.fact.substring(0, 50)}...`;
            case 'dramatic':
                return `In a world where... ${fact.fact.toUpperCase()}!!!`;
            default:
                return fact.fact;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getDisplayContent());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="mb-6 min-h-[100px] text-lg font-medium leading-relaxed text-foreground">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {getDisplayContent()}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={mode === 'original' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMode('original')}
                    >
                        Original
                    </Button>
                    <Button
                        variant={mode === 'joke' ? 'soft' : 'outline'}
                        size="sm"
                        onClick={() => setMode('joke')}
                    >
                        <Smile className="mr-2 h-3 w-3" />
                        Joke
                    </Button>
                    <Button
                        variant={mode === 'summary' ? 'pastel' : 'outline'}
                        size="sm"
                        onClick={() => setMode('summary')}
                    >
                        <FileText className="mr-2 h-3 w-3" />
                        Summary
                    </Button>
                    <Button
                        variant={mode === 'dramatic' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => setMode('dramatic')}
                    >
                        <Zap className="mr-2 h-3 w-3" />
                        Dramatic
                    </Button>
                    <div className="ml-auto">
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
