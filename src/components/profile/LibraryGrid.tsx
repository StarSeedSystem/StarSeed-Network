
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Video, Image as ImageIcon, PlusCircle } from "lucide-react";

interface LibraryItem {
    id: string;
    type: "Video" | "Avatar" | "Image" | string;
    title: string;
    thumbnail: string;
    thumbnailHint: string;
    source: string;
}

interface LibraryGridProps {
    items: LibraryItem[];
}

const typeIcons = {
    Video: <Video className="h-4 w-4" />,
    Avatar: <ImageIcon className="h-4 w-4" />,
    Image: <ImageIcon className="h-4 w-4" />,
}

export function LibraryGrid({ items }: LibraryGridProps) {
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Mi Biblioteca</CardTitle>
                        <CardDescription>Tu ecosistema personal de apps, archivos y avatares.</CardDescription>
                    </div>
                    <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(item => (
                            <Card key={item.id} className="glass-card rounded-xl overflow-hidden group">
                                <div className="aspect-square relative">
                                    <Image src={item.thumbnail} alt={item.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={item.thumbnailHint} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-2 left-2 text-white">
                                        <div className="flex items-center gap-1.5 text-xs bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                                            {typeIcons[item.type as keyof typeof typeIcons] || <ImageIcon className="h-4 w-4" />}
                                            <span>{item.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="font-semibold truncate">{item.title}</p>
                                    <Link href={item.source} passHref>
                                         <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary">
                                            Creado con {item.source.split('-')[0].replace('/', '')}
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Tu biblioteca está vacía.</p>
                        <p className="text-sm">Empieza a crear avatares, videos o publicaciones para verlos aquí.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
