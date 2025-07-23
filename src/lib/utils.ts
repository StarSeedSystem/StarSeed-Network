import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AnyRecommendedPage } from "@/types/content-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

export const getEntityPath = (type: AnyRecommendedPage['type'], slug: string) => {
    switch (type) {
        case 'community': return `/community/${slug}`;
        case 'federation': return `/federated-entity/${slug}`;
        case 'study_group': return `/study-group/${slug}`;
        case 'chat_group': return `/chat-group/${slug}`;
        case 'political_party': return `/political-party/${slug}`;
        case 'event': return `/event/${slug}`;
        default: return '#';
    }
}
