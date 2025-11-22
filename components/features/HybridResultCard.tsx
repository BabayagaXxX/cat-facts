import { HybridBreed } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HybridResultCardProps {
    hybrid: HybridBreed;
    onDelete?: (id: string) => void;
}

export function HybridResultCard({ hybrid, onDelete }: HybridResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card className="relative flex h-full flex-col overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                <Sparkles className="h-3 w-3" />
                                <span>Hybrid Breed</span>
                            </div>
                            <CardTitle className="text-xl text-foreground">{hybrid.name}</CardTitle>
                        </div>
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => onDelete(hybrid.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-end space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-background/60 p-3">
                        <div>
                            <span className="block text-xs text-muted-foreground">Parent A</span>
                            <span className="font-medium text-foreground">{hybrid.parentA.breed}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-muted-foreground">Parent B</span>
                            <span className="font-medium text-foreground">{hybrid.parentB.breed}</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between border-b border-border pb-1">
                            <span>Coat</span>
                            <span className="font-medium text-foreground">{hybrid.coat}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                            <span>Pattern</span>
                            <span className="font-medium text-foreground">{hybrid.pattern}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Origin</span>
                            <span className="font-medium text-foreground">{hybrid.origin}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
